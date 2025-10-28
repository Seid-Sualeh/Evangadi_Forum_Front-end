import { useEffect, useState, useContext } from "react";
import styles from "./questions.module.css";
import { axiosInstance } from "../../utility/axios.js";
import QuestionCard from "../../components/QuestionCard/QuestionCard.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import { UserState } from "../../App.jsx";
import { FaSearch } from "react-icons/fa";
const QUESTIONS_PER_PAGE = 6;

function Question() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useContext(UserState);

  useEffect(() => {
    setLoading(true);
    axiosInstance.get("/question").then((res) => {
      console.log("Questions API Response:", res.data.message); // Debug: check if userid exists
      setQuestions(res.data.message);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // ✅ NEW: Handle question update from child component
  const handleQuestionUpdate = (questionId, newTitle, newDescription) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.questionid === questionId
          ? { ...question, title: newTitle, description: newDescription }
          : question
      )
    );
  };

  const filteredQuestions = questions.filter((question) => {
    const titleMatches = question.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const descriptionMatches = question.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const userNameMatches = question.username
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    return titleMatches || descriptionMatches || userNameMatches;
  });

  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

  const groupedQuestions = [];
  for (let i = 0; i < paginatedQuestions.length; i += 2) {
    groupedQuestions.push(paginatedQuestions.slice(i, i + 2));
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className={styles.container}>
      <div className={styles.search_question}>
        <input
          type="text"
          placeholder="Search for a question title . . ."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FaSearch size={38} />
      </div>
      <hr />
      <h1 className={styles.title}>Questions</h1>
      <p className={styles.questionCount}>
        Total Asked Questions: <strong>{filteredQuestions.length}</strong>
      </p>

      {loading ? (
        <Loader />
      ) : filteredQuestions.length === 0 ? (
        <div className={styles.no_questions}>
          <p>No Questions Found Matching Search</p>
        </div>
      ) : (
        <>
          <div className={styles.questions_wrapper}>
            {groupedQuestions.map((group, index) => (
              <div
                key={index}
                className={
                  group.length === 2
                    ? styles.questions_grid
                    : styles.single_question_wrapper
                }
              >
                {group.map((question) => (
                  <QuestionCard
                    key={question.questionid}
                    id={question.question_uuid}
                    userid={question.userid}
                    userName={question.username}
                    questionTitle={question.title}
                    description={question.description}
                    question_date={question.createdAt}
                    views={question.views}
                    answer_count={question.answer_count}
                    onQuestionUpdate={handleQuestionUpdate}
                  />
                ))}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination_controls}>
              <button onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous Page
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next Page
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Question;
