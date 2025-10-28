import { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/axios.js";
import Layout from "../../Layout/Layout.jsx";
import styles from "./answer.module.css";
import { MdAccountCircle, MdOutlineQuestionAnswer } from "react-icons/md";
import { FaClipboardQuestion } from "react-icons/fa6";
import { LuCalendarClock } from "react-icons/lu";
import moment from "moment";
import { UserState } from "../../App.jsx";
import Swal from "sweetalert2";
import Loader from "../../components/Loader/Loader.jsx";

function QuestionAndAnswer() {
  const { questionUuid } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserState);
  const userId = user?.userid;
  const userName = user?.username || "Guest";

  const [questionDetails, setQuestionDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedAnswer, setExpandedAnswer] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const answerInput = useRef();

  // ✅ REMOVED: Question edit states
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editAnswerText, setEditAnswerText] = useState("");

  // NEW: likes & comments state
  const [likeCounts, setLikeCounts] = useState({});
  const [comments, setComments] = useState({});
  const [expandedCommentsFor, setExpandedCommentsFor] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      Swal.fire({
        title: "Unauthorized",
        text: "Please login to view and post answers",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => navigate("/auth"));
    }
  }, [user, navigate]);

  // Fetch question details
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/question/${questionUuid}`);
        setQuestionDetails(response.data);

        // after getting answers, fetch like counts for each answer
        const answers = response.data.answers || [];
        if (answers.length > 0) {
          const likePromises = answers.map((a) =>
            axiosInstance
              .get(`/like/${a.answerid}`)
              .then((r) => ({ id: a.answerid, count: r.data.likeCount ?? 0 }))
              .catch(() => ({ id: a.answerid, count: 0 }))
          );
          const likeResults = await Promise.all(likePromises);
          const likeMap = {};
          likeResults.forEach((lr) => (likeMap[lr.id] = lr.count));
          setLikeCounts(likeMap);
        } else {
          setLikeCounts({});
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Error",
          text: "Failed to load question. Try again later.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [questionUuid]);

  // ✅ EDIT ANSWER HANDLERS (keep these)
  const handleEditAnswer = (answer) => {
    setEditingAnswerId(answer.answerid);
    setEditAnswerText(answer.answer);
  };

  const handleSaveAnswer = async (answerid) => {
    const token = localStorage.getItem("Evangadi_Forum");
    if (!token) {
      Swal.fire("Unauthorized", "Please login to edit", "warning");
      return;
    }

    try {
      await axiosInstance.put(
        `/answer/${answerid}`,
        { answer: editAnswerText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh question data
      const response = await axiosInstance.get(`/question/${questionUuid}`);
      setQuestionDetails(response.data);
      setEditingAnswerId(null);
      setEditAnswerText("");

      Swal.fire("Success!", "Answer updated successfully!", "success");
    } catch (error) {
      console.error("Error updating answer:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update answer",
        "error"
      );
    }
  };

  const handleCancelEditAnswer = () => {
    setEditingAnswerId(null);
    setEditAnswerText("");
  };

  // Post a new answer
  const handlePostAnswer = async (e) => {
    e.preventDefault();
    const answer = answerInput.current.value.trim();
    if (!answer)
      return Swal.fire({
        title: "Error",
        text: "Please write your answer",
        icon: "error",
      });

    const token = localStorage.getItem("Evangadi_Forum");
    if (!token)
      return Swal.fire({
        title: "Unauthorized",
        text: "You need to login first",
        icon: "warning",
      }).then(() => navigate("/auth"));

    console.log("Sending answer data:", {
      userid: userId,
      questionid: questionUuid,
      answer: answer,
    });

    try {
      const response = await axiosInstance.post(
        "/answer",
        { userid: userId, questionid: questionUuid, answer },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "Answer submitted successfully!",
          icon: "success",
        });

        // Fetch updated question
        const updatedQuestion = await axiosInstance.get(
          `/question/${questionUuid}`
        );
        setQuestionDetails(updatedQuestion.data);

        // also fetch likes for new answers
        const answers = updatedQuestion.data.answers || [];
        if (answers.length > 0) {
          const likePromises = answers.map((a) =>
            axiosInstance
              .get(`/like/${a.answerid}`)
              .then((r) => ({ id: a.answerid, count: r.data.likeCount ?? 0 }))
              .catch(() => ({ id: a.answerid, count: 0 }))
          );
          const likeResults = await Promise.all(likePromises);
          const likeMap = {};
          likeResults.forEach((lr) => (likeMap[lr.id] = lr.count));
          setLikeCounts(likeMap);
        }

        // Clear the textarea
        answerInput.current.value = "";
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to post answer.",
        icon: "error",
      });
    }
  };

  // Truncate text
  const truncateText = (text, limit = 50) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length > limit) {
      return (
        <>
          {words.slice(0, limit).join(" ")}{" "}
          <span
            style={{ color: "var(--blue-shade)", cursor: "pointer" }}
            onClick={() => toggleExpandAnswer(null)}
          >
            ... See More
          </span>
        </>
      );
    }
    return text;
  };

  const toggleExpandAnswer = (answerId) => {
    setExpandedAnswer(expandedAnswer === answerId ? null : answerId);
  };

  // ---------- COMMENTS HANDLERS ----------
  const fetchCommentsForAnswer = async (answerid) => {
    try {
      const res = await axiosInstance.get(`/comment/${answerid}`);
      setComments((prev) => ({ ...prev, [answerid]: res.data }));
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments((prev) => ({ ...prev, [answerid]: [] }));
    }
  };

  const toggleCommentsPanel = async (answerid) => {
    if (expandedCommentsFor === answerid) {
      setExpandedCommentsFor(null);
      return;
    }
    setExpandedCommentsFor(answerid);
    if (!comments[answerid]) {
      await fetchCommentsForAnswer(answerid);
    }
  };

  const handleAddComment = async (e, answerid) => {
    e.preventDefault();
    const input = e.target.elements.comment;
    const commentText = input.value.trim();
    if (!commentText) return;

    const token = localStorage.getItem("Evangadi_Forum");
    if (!token) {
      Swal.fire("Unauthorized", "Please login to comment", "warning");
      return;
    }

    try {
      await axiosInstance.post(
        "/comment",
        { answerid, userid: userId, comment: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // refresh comments
      await fetchCommentsForAnswer(answerid);
      setQuestionDetails((prev) => ({
        ...prev,
        answers: prev.answers.map((a) =>
          a.answerid === answerid
            ? { ...a, comment_count: (a.comment_count || 0) + 1 }
            : a
        ),
      }));
      input.value = "";
    } catch (err) {
      console.error("Error posting comment:", err);
      Swal.fire("Error", "Failed to post comment", "error");
    }
  };

  // ---------- LIKES HANDLERS ----------
  const handleLikeToggle = async (answerid) => {
    const token = localStorage.getItem("Evangadi_Forum");
    if (!token) {
      Swal.fire("Unauthorized", "Please login to like answers", "warning");
      return;
    }

    try {
      await axiosInstance.post(
        "/like",
        { answerid, userid: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // fetch updated like count
      const res = await axiosInstance.get(`/like/${answerid}`);
      setLikeCounts((prev) => ({
        ...prev,
        [answerid]: res.data.likeCount ?? 0,
      }));
    } catch (err) {
      console.error("Error toggling like:", err);
      Swal.fire("Error", "Failed to toggle like", "error");
    }
  };

  if (loading)
    return (
      <p>
        <Loader />
      </p>
    );

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          {/* ✅ UPDATED: Question Display WITHOUT Edit */}
          <div style={{ display: "flex" }}>
            <FaClipboardQuestion size={35} style={{ marginRight: "10px" }} />
            <div style={{ width: "100%" }}>
              {/* ✅ REMOVED: Edit question form */}
              <>
                <h1 className={styles.questionTitle}>
                  {questionDetails?.title}
                </h1>
                <p className={styles.questionDescription}>
                  {questionDetails?.description}
                </p>
                <p className={styles.question_date}>
                  Asked by:
                  <span style={{ fontWeight: "600" }}>
                    @{questionDetails?.username}
                  </span>
                  <br />
                  <LuCalendarClock style={{ marginRight: "5px" }} size={19} />
                  {moment(questionDetails.createdAt)
                    .format("ddd, MMM DD, YYYY h:mm A")
                    .toUpperCase()}
                  {/* ✅ REMOVED: Edit question button */}
                </p>
              </>
            </div>
          </div>

          {/* ✅ UPDATED: Answers with Edit */}
          <h2
            style={{ padding: "5px 0", textAlign: "left", fontWeight: "600" }}
          >
            <MdOutlineQuestionAnswer
              size={35}
              style={{ marginRight: "10px" }}
            />
            Answers From the Community:
          </h2>

          {questionDetails?.answers?.length > 0 ? (
            questionDetails.answers.map((answer) => (
              <div key={answer.answerid} className={styles.answer_holder}>
                <div className={styles.account_holder}>
                  <MdAccountCircle size={50} />
                  <div className={styles.profileName}>@{answer.username}</div>
                </div>

                <div className={styles.answerTextContainer}>
                  {editingAnswerId === answer.answerid ? (
                    <div className={styles.editContainer}>
                      <textarea
                        value={editAnswerText}
                        onChange={(e) => setEditAnswerText(e.target.value)}
                        className={styles.editAnswerInput}
                        placeholder="Your answer..."
                        rows="4"
                      />
                      <div className={styles.editActions}>
                        <button
                          onClick={() => handleSaveAnswer(answer.answerid)}
                          className={styles.saveButton}
                        >
                          💾 Save
                        </button>
                        <button
                          onClick={handleCancelEditAnswer}
                          className={styles.cancelButton}
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p
                        className={styles.answerText}
                        onClick={() => toggleExpandAnswer(answer.answerid)}
                      >
                        {expandedAnswer === answer.answerid
                          ? answer.answer
                          : truncateText(answer.answer)}
                      </p>
                      <p className={styles.answer_date}>
                        <LuCalendarClock
                          style={{ marginRight: "5px" }}
                          size={19}
                        />
                        {moment(answer.createdAt)
                          .format("ddd, MMM DD, YYYY h:mm A")
                          .toUpperCase()}

                        {/* ✅ Edit Answer Button - Only show if user owns the answer */}
                        {user && answer.userid === userId && (
                          <button
                            onClick={() => handleEditAnswer(answer)}
                            className={styles.editButton}
                            style={{ marginLeft: "10px" }}
                          >
                            ✏️ Edit
                          </button>
                        )}
                      </p>

                      {/* Like/Comment Actions */}
                      <div
                        className={styles.answerActions}
                        style={{ marginTop: 8 }}
                      >
                        {likeCounts[answer.answerid] ?? 0}{" "}
                        <button
                          style={{ marginRight: 5 }}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeToggle(answer.answerid);
                          }}
                          className={styles.likeButton}
                        >
                          <span>👍 Likes</span>
                        </button>
                        {answer.comment_count ?? 0}{" "}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCommentsPanel(answer.answerid);
                          }}
                          className={styles.commentToggleBtn}
                        >
                          💬 Comments
                        </button>
                      </div>

                      {/* Comments section */}
                      {expandedCommentsFor === answer.answerid && (
                        <div
                          className={styles.commentsSection}
                          style={{ marginTop: 10 }}
                        >
                          {(comments[answer.answerid] || []).length === 0 ? (
                            <p style={{ fontStyle: "italic" }}>
                              No comments yet
                            </p>
                          ) : (
                            (comments[answer.answerid] || []).map((c) => (
                              <div
                                key={c.commentid}
                                className={styles.commentItem}
                                style={{ marginBottom: 8 }}
                              >
                                <strong>@{c.username}</strong> &nbsp;{" "}
                                <small style={{ color: "#666" }}>
                                  {moment(c.createdAt).fromNow()}
                                </small>
                                <div>{c.comment}</div>
                              </div>
                            ))
                          )}

                          <form
                            onSubmit={(e) =>
                              handleAddComment(e, answer.answerid)
                            }
                          >
                            <input
                              name="comment"
                              className={styles.comment}
                              placeholder="Write a comment here ..."
                              required
                            />
                            <div style={{ marginTop: 6, textAlign: "right" }}>
                              <button
                                type="submit"
                                className={styles.postCommentButton}
                              >
                                Post Comment
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>
              <span style={{ color: "red", fontWeight: "bold" }}>
                No answers yet!
              </span>
              <br /> Be the first to contribute your answer and help the
              community.
            </p>
          )}

          {/* Post Answer + AI Chat Section */}
          <section className={styles.answerSection}>
            {/* Left: User Answer Form */}
            <div className={styles.userAnswerBox}>
              <h3 className={styles.answerFormTitle}>
                📝 Contribute Your Answer
              </h3>
              <Link to="/" className={styles.questionPageLink}>
                ← Back to Questions
              </Link>
              <form onSubmit={handlePostAnswer}>
                <textarea
                  placeholder="Write your answer here..."
                  className={styles.answerInput}
                  required
                  ref={answerInput}
                />
                <button className={styles.postAnswerButton} type="submit">
                  Post Answer
                </button>
              </form>
            </div>

            {/* Right: AI Assistant */}
            <div className={styles.aiChatBox}>
              <h3 className={styles.aiTitle}>🤖 Your AI Assistant</h3>
              <div
                className={styles.chatContainer}
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                <div className={`${styles.chatMessage} ${styles.aiMessage}`}>
                  Welcome <strong>{userName} 👋</strong> Ask me anything
                </div>

                {chatHistory.map((msg, index) => {
                  if (msg.sender === "ai") {
                    if (msg.structured) {
                      const sections = String(msg.structured)
                        .split(/(?=✅\d️⃣|\n\n)/g)
                        .map((s) => s.trim())
                        .filter(Boolean);

                      return (
                        <div
                          key={index}
                          className={`${styles.chatMessage} ${styles.aiMessage}`}
                          style={{ alignSelf: "stretch" }}
                        >
                          <div className={styles.aiAnswerContainer}>
                            {sections.map((section, idx) => {
                              const cleanedSection = section
                                .replace(/\*\*/g, "")
                                .trim();
                              const headingMatch = cleanedSection.match(
                                /^(?:[\s\W_]*?)?([^:\n\r]+):/
                              );
                              const headingText = headingMatch
                                ? headingMatch[1].replace(/\*+/g, "").trim()
                                : null;
                              const content = headingMatch
                                ? cleanedSection
                                    .replace(headingMatch[0], "")
                                    .trim()
                                : cleanedSection;

                              const lines = content
                                .split(/\r?\n|\n\r/)
                                .map((l) =>
                                  l
                                    .replace(/^\*+\s*/, "")
                                    .replace(/\*+$/g, "")
                                    .trim()
                                )
                                .filter(Boolean);

                              let bullet = "🔹";
                              let bulletColor = "#1d4ed8";
                              if (/book/i.test(headingText)) {
                                bullet = "📚";
                                bulletColor = "#f59e0b";
                              } else if (/video/i.test(headingText)) {
                                bullet = "🎬";
                                bulletColor = "#10b981";
                              } else if (
                                /channel|youtube|channel/i.test(headingText)
                              ) {
                                bullet = "📺";
                                bulletColor = "#ef4444";
                              }

                              return (
                                <div key={idx} style={{ marginBottom: 12 }}>
                                  {headingText && (
                                    <h4 className={styles.aiHeading}>
                                      {headingText}
                                    </h4>
                                  )}

                                  {lines.length > 1 ? (
                                    <ul className={styles.aiList}>
                                      {lines.map((ln, li) => (
                                        <li
                                          key={li}
                                          className={styles.aiListItem}
                                        >
                                          <span
                                            style={{
                                              marginRight: 8,
                                              color: bulletColor,
                                            }}
                                          >
                                            {bullet}
                                          </span>
                                          <span>{ln}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className={styles.mainAnswer}>
                                      {content}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={index}
                        className={`${styles.chatMessage} ${styles.aiMessage}`}
                      >
                        <div className={styles.aiAnswerContainer}>
                          <p className={styles.mainAnswer}>{msg.text}</p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={index}
                      className={`${styles.chatMessage} ${styles.userMessage}`}
                    >
                      {msg.text}
                    </div>
                  );
                })}

                {aiLoading && (
                  <div className={`${styles.chatMessage} ${styles.aiMessage}`}>
                    <span className={styles.typingDots}>
                      <span>Searching</span>
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  </div>
                )}
              </div>

              <form
                className={styles.chatInputArea}
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!user)
                    return Swal.fire(
                      "Login Required",
                      "Please login to ask AI",
                      "warning"
                    );

                  const question = e.target.aiQuestion.value.trim();
                  if (!question) return;

                  setChatHistory((prev) => [
                    ...prev,
                    { sender: "user", text: question },
                  ]);
                  e.target.aiQuestion.value = "";
                  setAiLoading(true);

                  try {
                    const token = localStorage.getItem("Evangadi_Forum");
                    const res = await axiosInstance.post(
                      "/ai/suggest-answer",
                      { question, description: questionDetails.description },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );

                    let structuredData = null;
                    try {
                      structuredData = JSON.parse(res.data.suggestion);
                    } catch (err) {
                      console.log(err);
                    }

                    setChatHistory((prev) => [
                      ...prev,
                      {
                        sender: "ai",
                        text: structuredData
                          ? ""
                          : res.data.suggestion || "No response from AI",
                        structured: structuredData,
                      },
                    ]);
                  } catch (err) {
                    console.log(err);
                    setChatHistory((prev) => [
                      ...prev,
                      { sender: "ai", text: "❌ Failed to fetch AI response." },
                    ]);
                  }

                  setAiLoading(false);
                }}
              >
                <textarea
                  name="aiQuestion"
                  placeholder="Ask AI anything..."
                  className={styles.chatInput}
                  required
                />
                <button
                  className={styles.aiButton}
                  type="submit"
                  disabled={aiLoading}
                >
                  {aiLoading ? " Asking AI..." : " Ask AI"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default QuestionAndAnswer;
