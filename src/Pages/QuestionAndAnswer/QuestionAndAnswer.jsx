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

function QuestionAndAnswer() {
  const { questionId } = useParams();
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
        const response = await axiosInstance.get(`/question/${questionId}`);
        setQuestionDetails(response.data);
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
  }, [questionId]);

  //Post a new answer
  // const handlePostAnswer = async (e) => {
  //   e.preventDefault();
  //   const answer = answerInput.current.value.trim();
  //   if (!answer) {
  //     return Swal.fire({
  //       title: "Error",
  //       text: "Please write your answer before submitting.",
  //       icon: "error",
  //     });
  //   }

  //   const token = localStorage.getItem("Evangadi_Forum");
  //   if (!token) {
  //     return Swal.fire({
  //       title: "Unauthorized",
  //       text: "You need to login first",
  //       icon: "warning",
  //     }).then(() => navigate("/auth"));
  //   }

  //   try {
  //    const response = await axiosInstance.post(
  //      "/answers",
  //      { userid: userId, questionUuid: questionId, answer }, // <-- use questionUuid
  //      { headers: { Authorization: `Bearer ${token}` } }
  //    );


  //     if (response.status === 201) {
  //       Swal.fire({
  //         title: "Success!",
  //         text: "Answer submitted successfully!",
  //         icon: "success",
  //       }).then(() => window.location.reload());
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     Swal.fire({
  //       title: "Error",
  //       text:
  //         error.response?.data?.msg ||
  //         "Failed to post answer. Try again later.",
  //       icon: "error",
  //     });
  //   }
  // };




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

    try {
      const response = await axiosInstance.post(
        "/answer",
        { userid: userId, questionid: questionId, answer },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "Answer submitted successfully!",
          icon: "success",
        });

        // ✅ Fetch updated answers from backend
        const updatedQuestion = await axiosInstance.get(
          `/question/${questionId}`
        );
        setQuestionDetails(updatedQuestion.data);

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

  if (loading) return <p>Loading question...</p>;

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          {/* Question Display */}
          <div style={{ display: "flex" }}>
            <FaClipboardQuestion size={35} style={{ marginRight: "10px" }} />
            <div>
              <h1 className={styles.questionTitle}>{questionDetails?.title}</h1>
              <p className={styles.questionDescription}>
                {questionDetails?.description}
              </p>
              <p className={styles.question_date}>
                Asked by:{" "}
                <span style={{ fontWeight: "600" }}>
                  @{questionDetails?.qtn_username}
                </span>
                <br />
                <LuCalendarClock style={{ marginRight: "5px" }} size={19} />
                {moment(questionDetails.qtn_createdAt)
                  .format("ddd, MMM DD, YYYY h:mm A")
                  .toUpperCase()}
              </p>
            </div>
          </div>

          {/* Answers */}
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
                <div
                  className={styles.answerTextContainer}
                  onClick={() => toggleExpandAnswer(answer.answerid)}
                >
                  <p className={styles.answerText}>
                    {expandedAnswer === answer.answerid
                      ? answer.answer
                      : truncateText(answer.answer)}
                  </p>
                  <p className={styles.answer_date}>
                    <LuCalendarClock style={{ marginRight: "5px" }} size={19} />
                    {moment(answer.createdAt)
                      .format("ddd, MMM DD, YYYY h:mm A")
                      .toUpperCase()}
                  </p>
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
                  if (msg.sender === "ai" && msg.structured) {
                    // Render structured AI content
                    const sections = msg.structured.split(/(?=✅\d️⃣)/g);
                    return (
                      <div
                        key={index}
                        className={`${styles.chatMessage} ${styles.aiMessage}`}
                      >
                        {sections.map((section, idx) => {
                          const headingMatch = section.match(/(✅\d️⃣)(.*?):/);
                          const heading = headingMatch ? headingMatch[0] : null;
                          const content = headingMatch
                            ? section.replace(headingMatch[0], "").trim()
                            : section.trim();
                          const lines = content
                            .split("\n")
                            .map((l) => l.replace(/^\*?\s*/, "").trim())
                            .filter(Boolean);

                          return (
                            <div key={idx} style={{ marginBottom: "12px" }}>
                              {heading && (
                                <h4 style={{ color: "#1D4ED8" }}>{heading}</h4>
                              )}
                              {lines.length > 1 ? (
                                <ul>
                                  {lines.map((line, i) => (
                                    <li key={i}>{line}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p>{content}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  }

                  // Plain AI or user messages
                  return (
                    <div
                      key={index}
                      className={`${styles.chatMessage} ${
                        msg.sender === "ai"
                          ? styles.aiMessage
                          : styles.userMessage
                      }`}
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

                  setChatHistory([
                    ...chatHistory,
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
                    } catch {}

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





// import { useContext, useEffect, useRef, useState } from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import { axiosInstance } from "../../utility/axios.js";
// import Layout from "../../Layout/Layout.jsx";
// import styles from "./answer.module.css";
// import { MdAccountCircle, MdOutlineQuestionAnswer } from "react-icons/md";
// import { FaClipboardQuestion } from "react-icons/fa6";
// import { LuCalendarClock } from "react-icons/lu";
// import moment from "moment";
// import { UserState } from "../../App.jsx";
// import Swal from "sweetalert2";

// function QuestionAndAnswer() {
//   const { questionId } = useParams(); // this is UUID
//   const navigate = useNavigate();
//   const { user } = useContext(UserState);
//   const userId = user?.userid;
//   const userName = user?.username || "Guest";

//   const [questionDetails, setQuestionDetails] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [expandedAnswer, setExpandedAnswer] = useState(null);
//   const [aiLoading, setAiLoading] = useState(false);
//   const [chatHistory, setChatHistory] = useState([]);
//   const answerInput = useRef();

//   // Redirect if not logged in
//   useEffect(() => {
//     if (!user) {
//       Swal.fire({
//         title: "Unauthorized",
//         text: "Please login to view and post answers",
//         icon: "warning",
//         confirmButtonText: "OK",
//       }).then(() => navigate("/auth"));
//     }
//   }, [user, navigate]);

//   // Fetch question + answers
//   const fetchQuestionDetails = async () => {
//     try {
//       const response = await axiosInstance.get(`/question/${questionId}`);
//       setQuestionDetails(response.data);
//     } catch (err) {
//       console.error("❌ Error fetching question:", err);
//       Swal.fire({
//         title: "Error",
//         text: "Failed to load question. Try again later.",
//         icon: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuestionDetails();
//   }, [questionId]);

//   // Post a new answer
//   const handlePostAnswer = async (e) => {
//     e.preventDefault();
//     const answer = answerInput.current.value.trim();
//     if (!answer) {
//       return Swal.fire({
//         title: "Error",
//         text: "Please write your answer before submitting.",
//         icon: "error",
//       });
//     }

//     const token = localStorage.getItem("Evangadi_Forum");
//     if (!token) {
//       return Swal.fire({
//         title: "Unauthorized",
//         text: "You need to login first",
//         icon: "warning",
//       }).then(() => navigate("/auth"));
//     }

//     try {
//       await axiosInstance.post(
//         "/answers",
//         { userid: userId, questionUuid: questionId, answer },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       Swal.fire({
//         title: "Success!",
//         text: "Answer submitted successfully!",
//         icon: "success",
//       });

//       // Clear input
//       answerInput.current.value = "";

//       // Refetch question to get latest answers
//       fetchQuestionDetails();
//     } catch (error) {
//       console.error(error);
//       Swal.fire({
//         title: "Error",
//         text:
//           error.response?.data?.message ||
//           "Failed to post answer. Try again later.",
//         icon: "error",
//       });
//     }
//   };

//   const truncateText = (text, limit = 50) => {
//     if (!text) return "";
//     const words = text.split(" ");
//     if (words.length > limit) {
//       return (
//         <>
//           {words.slice(0, limit).join(" ")}{" "}
//           <span
//             style={{ color: "var(--blue-shade)", cursor: "pointer" }}
//             onClick={() => toggleExpandAnswer(null)}
//           >
//             ... See More
//           </span>
//         </>
//       );
//     }
//     return text;
//   };

//   const toggleExpandAnswer = (answerId) => {
//     setExpandedAnswer(expandedAnswer === answerId ? null : answerId);
//   };

//   if (loading) return <p>Loading question...</p>;

//   return (
//     <Layout>
//       <div className={styles.container}>
//         <div className={styles.mainContainer}>
//           {/* Question Display */}
//           <div style={{ display: "flex" }}>
//             <FaClipboardQuestion size={35} style={{ marginRight: "10px" }} />
//             <div>
//               <h1 className={styles.questionTitle}>{questionDetails?.title}</h1>
//               <p className={styles.questionDescription}>
//                 {questionDetails?.description}
//               </p>
//               <p className={styles.question_date}>
//                 Asked by:{" "}
//                 <span style={{ fontWeight: "600" }}>
//                   @{questionDetails?.qtn_username}
//                 </span>
//                 <br />
//                 <LuCalendarClock style={{ marginRight: "5px" }} size={19} />
//                 {moment(questionDetails.qtn_createdAt)
//                   .format("ddd, MMM DD, YYYY h:mm A")
//                   .toUpperCase()}
//               </p>
//             </div>
//           </div>

//           {/* Answers */}
//           <h2
//             style={{ padding: "5px 0", textAlign: "left", fontWeight: "600" }}
//           >
//             <MdOutlineQuestionAnswer
//               size={35}
//               style={{ marginRight: "10px" }}
//             />
//             Answers From the Community:
//           </h2>

//           {questionDetails?.answers && questionDetails.answers.length > 0 ? (
//             questionDetails.answers.map((answer) => (
//               <div key={answer.answerid} className={styles.answer_holder}>
//                 <div className={styles.account_holder}>
//                   <MdAccountCircle size={50} />
//                   <div className={styles.profileName}>@{answer.username}</div>
//                 </div>
//                 <div
//                   className={styles.answerTextContainer}
//                   onClick={() => toggleExpandAnswer(answer.answerid)}
//                 >
//                   <p className={styles.answerText}>
//                     {expandedAnswer === answer.answerid
//                       ? answer.answer
//                       : truncateText(answer.answer)}
//                   </p>
//                   <p className={styles.answer_date}>
//                     <LuCalendarClock style={{ marginRight: "5px" }} size={19} />
//                     {moment(answer.createdAt)
//                       .format("ddd, MMM DD, YYYY h:mm A")
//                       .toUpperCase()}
//                   </p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>
//               <span style={{ color: "red", fontWeight: "bold" }}>
//                 No answers yet!
//               </span>
//               <br /> Be the first to contribute your answer and help the
//               community.
//             </p>
//           )}

//           {/* Post Answer + AI Chat Section */}
//           <section className={styles.answerSection}>
//             {/* Left: User Answer Form */}
//             <div className={styles.userAnswerBox}>
//               <h3 className={styles.answerFormTitle}>
//                 📝 Contribute Your Answer
//               </h3>
//               <Link to="/" className={styles.questionPageLink}>
//                 ← Back to Questions
//               </Link>
//               <form onSubmit={handlePostAnswer}>
//                 <textarea
//                   placeholder="Write your answer here..."
//                   className={styles.answerInput}
//                   required
//                   ref={answerInput}
//                 />
//                 <button className={styles.postAnswerButton} type="submit">
//                   Post Answer
//                 </button>
//               </form>
//             </div>

//             {/* Right: AI Assistant */}
//             <div className={styles.aiChatBox}>
//               <h3 className={styles.aiTitle}>🤖 Your AI Assistant</h3>
//               <div
//                 className={styles.chatContainer}
//                 style={{ maxHeight: "300px", overflowY: "auto" }}
//               >
//                 <div className={`${styles.chatMessage} ${styles.aiMessage}`}>
//                   Welcome <strong>{userName} 👋</strong> Ask me anything
//                 </div>

//                 {chatHistory.map((msg, index) => {
//                   if (msg.sender === "ai" && msg.structured) {
//                     const sections = msg.structured.split(/(?=✅\d️⃣)/g);
//                     return (
//                       <div
//                         key={index}
//                         className={`${styles.chatMessage} ${styles.aiMessage}`}
//                       >
//                         {sections.map((section, idx) => {
//                           const headingMatch = section.match(/(✅\d️⃣)(.*?):/);
//                           const heading = headingMatch ? headingMatch[0] : null;
//                           const content = headingMatch
//                             ? section.replace(headingMatch[0], "").trim()
//                             : section.trim();
//                           const lines = content
//                             .split("\n")
//                             .map((l) => l.replace(/^\*?\s*/, "").trim())
//                             .filter(Boolean);

//                           return (
//                             <div key={idx} style={{ marginBottom: "12px" }}>
//                               {heading && (
//                                 <h4 style={{ color: "#1D4ED8" }}>{heading}</h4>
//                               )}
//                               {lines.length > 1 ? (
//                                 <ul>
//                                   {lines.map((line, i) => (
//                                     <li key={i}>{line}</li>
//                                   ))}
//                                 </ul>
//                               ) : (
//                                 <p>{content}</p>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     );
//                   }

//                   return (
//                     <div
//                       key={index}
//                       className={`${styles.chatMessage} ${
//                         msg.sender === "ai"
//                           ? styles.aiMessage
//                           : styles.userMessage
//                       }`}
//                     >
//                       {msg.text}
//                     </div>
//                   );
//                 })}

//                 {aiLoading && (
//                   <div className={`${styles.chatMessage} ${styles.aiMessage}`}>
//                     <span className={styles.typingDots}>
//                       <span>Searching</span>
//                       <span>.</span>
//                       <span>.</span>
//                       <span>.</span>
//                     </span>
//                   </div>
//                 )}
//               </div>

//               <form
//                 className={styles.chatInputArea}
//                 onSubmit={async (e) => {
//                   e.preventDefault();
//                   if (!user)
//                     return Swal.fire(
//                       "Login Required",
//                       "Please login to ask AI",
//                       "warning"
//                     );

//                   const question = e.target.aiQuestion.value.trim();
//                   if (!question) return;

//                   setChatHistory([
//                     ...chatHistory,
//                     { sender: "user", text: question },
//                   ]);
//                   e.target.aiQuestion.value = "";
//                   setAiLoading(true);

//                   try {
//                     const token = localStorage.getItem("Evangadi_Forum");
//                     const res = await axiosInstance.post(
//                       "/ai/suggest-answer",
//                       { question, description: questionDetails.description },
//                       { headers: { Authorization: `Bearer ${token}` } }
//                     );

//                     let structuredData = null;
//                     try {
//                       structuredData = JSON.parse(res.data.suggestion);
//                     } catch {}

//                     setChatHistory((prev) => [
//                       ...prev,
//                       {
//                         sender: "ai",
//                         text: structuredData
//                           ? ""
//                           : res.data.suggestion || "No response from AI",
//                         structured: structuredData,
//                       },
//                     ]);
//                   } catch (err) {
//                     setChatHistory((prev) => [
//                       ...prev,
//                       { sender: "ai", text: "❌ Failed to fetch AI response." },
//                     ]);
//                   }

//                   setAiLoading(false);
//                 }}
//               >
//                 <textarea
//                   name="aiQuestion"
//                   placeholder="Ask AI anything..."
//                   className={styles.chatInput}
//                   required
//                 />
//                 <button
//                   className={styles.aiButton}
//                   type="submit"
//                   disabled={aiLoading}
//                 >
//                   {aiLoading ? " Asking AI..." : " Ask AI"}
//                 </button>
//               </form>
//             </div>
//           </section>
//         </div>
//       </div>
//     </Layout>
//   );












  
// }

// export default QuestionAndAnswer;

