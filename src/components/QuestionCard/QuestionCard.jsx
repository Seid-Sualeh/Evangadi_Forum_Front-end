import styles from "./questionCard.module.css";
import { MdAccountCircle } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import moment from "moment";
import { LuCalendarClock } from "react-icons/lu";
import { useState, useContext } from "react";
import { UserState } from "../../App.jsx";
import { axiosInstance } from "../../utility/axios.js";
import Swal from "sweetalert2";

function QuestionCard({
  id, // This should be the UUID now
  userName,
  questionTitle,
  description,
  question_date,
  views,
  answer_count,
  userid, // The question creator's user ID
  onQuestionUpdate,
}) {
  const { user } = useContext(UserState);
  const currentUserId = user?.userid; // Current logged in user's ID

  // ✅ Check if current user owns this question
  const isQuestionOwner =
    user &&
    currentUserId &&
    userid &&
    currentUserId.toString() === userid.toString();

  // ✅ Edit states
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(questionTitle);
  const [editDescription, setEditDescription] = useState(description);
  const [isLoading, setIsLoading] = useState(false);

  const formattedDate = moment(question_date)
    .format("ddd, MMM DD, YYYY h:mm A")
    .toUpperCase();

  // ✅ Handle edit question
  const handleEditQuestion = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!editTitle.trim() || !editDescription.trim()) {
      Swal.fire("Error", "Title and description are required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("Evangadi_Forum");
      await axiosInstance.put(
        `question/${id}`, // API calls
        {
          title: editTitle,
          description: editDescription,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Call parent callback to update the question in the list
      if (onQuestionUpdate) {
        onQuestionUpdate(id, editTitle, editDescription);
      }

      setEditing(false);
      Swal.fire("Success!", "Question updated successfully!", "success");
    } catch (error) {
      console.error("Error updating question:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update question",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditing(false);
    setEditTitle(questionTitle);
    setEditDescription(description);
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditing(true);
  };

  return (
    <div className={styles.question_holder}>
      <div className={styles.requester_question_holder}>
        <div className={styles.requester_holder}>
          <MdAccountCircle size={50} />
          <div className={styles.username}>@{userName}</div>
        </div>

        <div className={styles.title_description_holder}>
          {editing ? (
            // ✅ EDIT MODE
            <div className={styles.editContainer}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className={styles.editTitleInput}
                placeholder="Question title..."
                onClick={(e) => e.stopPropagation()}
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className={styles.editDescriptionInput}
                placeholder="Question description..."
                rows="3"
                onClick={(e) => e.stopPropagation()}
              />
              <div className={styles.editActions}>
                <button
                  onClick={handleEditQuestion}
                  className={styles.saveButton}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "💾 Save"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className={styles.cancelButton}
                  disabled={isLoading}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          ) : (
            // ✅ VIEW MODE - Everything inside Link for clickability
            <Link
              to={`/question/${id}`} // ✅ Use id prop (UUID)
              style={{ textDecoration: "none", color: "black" }}
              className={styles.questionLink}
            >
              <p className={styles.question_title}>
                {String(questionTitle).length > 100
                  ? String(questionTitle).substring(0, 100).concat("...")
                  : questionTitle}
              </p>
              <p className={styles.question_description}>
                {String(description).length > 300
                  ? String(description).substring(0, 300).concat("...")
                  : description}
              </p>

              <div className={styles.info_holder}>
                <p className={styles.question_date}>
                  <LuCalendarClock
                    style={{
                      marginRight: "5px",
                      color: "#FE9119",
                      fontSize: "16px",
                    }}
                  />
                  {formattedDate}
                </p>
                <p>
                  👁 {views}{" "}
                  <span className={styles.question_stats}>views </span>
                  💬
                  {answer_count}{" "}
                  <span className={styles.question_stat}>answers</span>
                  {/* ✅ EDIT BUTTON - Only show for question creator */}
                  {isQuestionOwner && (
                    <button
                      onClick={handleEditClick}
                      className={styles.editButton}
                      style={{ marginLeft: "10px" }}
                    >
                      ✏️ Edit
                    </button>
                  )}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* ✅ Arrow for navigation (outside the main content link) */}
      {!editing && (
        <div className={styles.question_arrow_holder}>
          <Link to={`/question/${id}`}>
            {" "}
            {/* ✅ Use id prop (UUID) */}
            <FaChevronRight size={18} color="#FE9119" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default QuestionCard;
