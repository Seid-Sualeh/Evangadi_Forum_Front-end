


import { useContext, useRef, useEffect } from "react";
import classes from "./askQuestion.module.css";
import { axiosInstance } from "../../utility/axios.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../Layout/Layout.jsx";
import { UserState } from "../../App.jsx";
import Swal from "sweetalert2";

function AskQuestion() {
  const navigate = useNavigate();
  const { user } = useContext(UserState);

  const titleDom = useRef();
  const descriptionDom = useRef();
  const userId = user?.userid;

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      Swal.fire({
        title: "Unauthorized",
        text: "Please login to ask a question",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => navigate("/auth"));
    }
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !titleDom.current.value.trim() ||
      !descriptionDom.current.value.trim()
    ) {
      return Swal.fire({
        title: "Error",
        text: "Title and description cannot be empty",
        icon: "error",
      });
    }

    const title = titleDom.current.value;
    const description = descriptionDom.current.value;
    const userid = userId;
    const tag = "General";

    const token = localStorage.getItem("Evangadi_Forum");

    if (!token) {
      return Swal.fire({
        title: "Unauthorized",
        text: "You need to login first",
        icon: "warning",
      }).then(() => navigate("/auth"));
    }

    try {
      const response = await axiosInstance.post(
        "/question",
        { userid, title, description, tag },
        { headers: { Authorization: `Bearer ${token}` } } // attach JWT token
      );

      if (response.status === 201) {
        await Swal.fire({
          title: "Success!",
          text: "✅ Question created successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/"); // go to home or questions list
      } else {
        await Swal.fire({
          title: "Error",
          text: response.data.msg || "Failed to create question",
          icon: "error",
        });
      }
    } catch (error) {
      console.error(error);
      await Swal.fire({
        title: "Error",
        text:
          error.response?.data?.msg ||
          "Failed to create question. Try again later",
        icon: "error",
      });
    }
  }

  return (
    <Layout>
      <div className={classes.allContainer}>
        <div className={classes.question__container}>
          <div className={classes.question__wrapper}>
            <h3 className={classes.question__header__title}>
              <span className={classes.highlight}>
                Steps To Write A Good Question
              </span>
            </h3>

            <div className={classes.questionContainer}>
              <h2 className={classes.questionTitle}>
                How to Ask a Good Question
              </h2>
              <div className={classes.questionList}>
                <ul className={classes.questionListUl}>
                  <li className={classes.questionItem}>
                    Summarize your problem in a one-line title.
                  </li>
                  <li className={classes.questionItem}>
                    Describe your problem in more detail.
                  </li>
                  <li className={classes.questionItem}>
                    Explain what you have tried and what you expected to happen.
                  </li>
                  <li className={classes.questionItem}>
                    Review your question and post it to the site.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <h4 className={classes.highlight}>Post Your Question</h4>
          <div className={classes.question__header__titleTwo}>
            <form onSubmit={handleSubmit} className={classes.question__form}>
              <input
                className={classes.question__title2}
                ref={titleDom}
                type="text"
                placeholder="Question title"
                required
              />
              <textarea
                rows={4}
                className={classes.question__description}
                ref={descriptionDom}
                placeholder="Question Description..."
                required
              />
              <div className={classes.buttonContainer}>
                <button className={classes.question__button} type="submit">
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AskQuestion;
