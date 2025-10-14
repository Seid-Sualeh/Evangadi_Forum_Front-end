import { useEffect, useState, useContext } from "react";
import styles from "./questions.module.css";
import { axiosInstance } from "../../utility/axios.js";
import QuestionCard from "../../components/QuestionCard/QuestionCard.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import { UserState } from "../../App.jsx";

const QUESTIONS_PER_PAGE = 6; // 👈 Define the limit

function Question() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // 👈 New state for pagination

  const { user } = useContext(UserState);

  useEffect(() => {
    setLoading(true);
    axiosInstance.get("/question").then((res) => {
      setQuestions(res.data.message);
      setLoading(false);
    });
  }, []);

  // Reset page whenever search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // 1. Filter Questions (Based on title/description - what you already had)
  const filteredQuestions = questions.filter((question) => {
    const titleMatches = question.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const descriptionMatches = question.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    // Assuming "search question by their name" means searching the user's name
    const userNameMatches = question.username // Assuming the question object has 'username'
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    // You can adjust this 'return' condition based on what 'name' refers to:
    return titleMatches || descriptionMatches || userNameMatches;
  });

  // 2. Calculate Pagination Values
  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;

  // 3. Slice Questions for the Current Page
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

  // 4. Divide Paginated Questions into groups of 2 (for 2x2 rows)
  const groupedQuestions = [];
  for (let i = 0; i < paginatedQuestions.length; i += 2) {
    groupedQuestions.push(paginatedQuestions.slice(i, i + 2));
  }

  // Pagination Handlers
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
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
      </div>
      <hr />
      <h1 className={styles.title}>Questions</h1>

      <p className={styles.questionCount}>
        Total Asked Questions : <strong>{filteredQuestions.length}</strong>{" "}
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
                    id={question.questionid}
                    // Ensure you pass a prop for user name if you want to search it
                    userName={question.username}
                    questionTitle={question.title}
                    description={question.description}
                    question_date={question.createdAt}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* 👈 PAGINATION CONTROLS */}
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















// import { useEffect, useState, useContext } from "react";
// import { Link } from "react-router-dom";
// import styles from "./questions.module.css";
// import { axiosInstance } from "../../utility/axios.js";
// import Loader from "../../components/Loader/Loader.jsx";
// import { UserState } from "../../App.jsx";

// const QUESTIONS_PER_PAGE = 6; // Pagination limit

// function Question() {
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   const { user } = useContext(UserState);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       setLoading(true);
//       try {
//         const res = await axiosInstance.get("/questions");
//         setQuestions(res.data.questions || []); // Updated backend returns "questions"
//       } catch (err) {
//         console.error("Failed to fetch questions:", err);
//       }
//       setLoading(false);
//     };
//     fetchQuestions();
//   }, []);

//   // Reset page when search query changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery]);

//   // Filter questions by title, description, or username
//   const filteredQuestions = questions.filter((q) => {
//     const titleMatch = q.title
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     const descMatch = q.description
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     const userMatch = q.username
//       ?.toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     return titleMatch || descMatch || userMatch;
//   });

//   // Pagination
//   const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
//   const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
//   const paginatedQuestions = filteredQuestions.slice(
//     startIndex,
//     startIndex + QUESTIONS_PER_PAGE
//   );

//   // Group questions for 2x2 layout
//   const groupedQuestions = [];
//   for (let i = 0; i < paginatedQuestions.length; i += 2) {
//     groupedQuestions.push(paginatedQuestions.slice(i, i + 2));
//   }

//   // Pagination handlers
//   const handleNextPage = () =>
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//   const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

//   return (
//     <div className={styles.container}>
//       <div className={styles.search_question}>
//         <input
//           type="text"
//           placeholder="Search for a question title . . ."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>
//       <hr />
//       <h1 className={styles.title}>Questions</h1>

//       <p className={styles.questionCount}>
//         Total Asked Questions : <strong>{filteredQuestions.length}</strong>{" "}
//       </p>

//       {loading ? (
//         <Loader />
//       ) : filteredQuestions.length === 0 ? (
//         <div className={styles.no_questions}>
//           <p>No Questions Found Matching Search</p>
//         </div>
//       ) : (
//         <>
//           <div className={styles.questions_wrapper}>
//             {groupedQuestions.map((group, index) => (
//               <div
//                 key={index}
//                 className={
//                   group.length === 2
//                     ? styles.questions_grid
//                     : styles.single_question_wrapper
//                 }
//               >
//                 {group.map((question) => (
//                   <div key={question.uuid} className={styles.question_card}>
//                     <h3>{question.title}</h3>
//                     <p>{question.description}</p>
//                     <small>
//                       Asked by <strong>{question.username}</strong> on{" "}
//                       {new Date(question.createdAt).toLocaleString()}
//                     </small>
//                     <Link
//                       to={`/question/${question.uuid}`}
//                       className={styles.view_button}
//                     >
//                       View Answers
//                     </Link>
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>

//           {/* Pagination Controls */}
//           {totalPages > 1 && (
//             <div className={styles.pagination_controls}>
//               <button onClick={handlePrevPage} disabled={currentPage === 1}>
//                 Previous Page
//               </button>
//               <span>
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 onClick={handleNextPage}
//                 disabled={currentPage === totalPages}
//               >
//                 Next Page
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// export default Question;
