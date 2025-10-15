// import { Routes, Route } from "react-router-dom";

// import QuestionAndAnswer from "../Pages/QuestionAndAnswer/QuestionAndAnswer.jsx";
// import AskQuestion from "../Pages/AskQuestion/AskQuestion.jsx";
// import PrivacyPolicy from "../Pages/PrivacyPolicy/PrivacyPolicy.jsx";
// import Home from "../Pages/Home/Home.jsx";
// import AuthLayout from "../Pages/AuthLayout/AuthLayout.jsx";
// import ForgetPassword from "../Pages/ForgetPassword/ForgetPassword.jsx";
// import NotFound from "../Pages/NotFound/NotFound.jsx";

// function AppRouter() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/ask" element={<AskQuestion />} />
//       <Route path="/question/:questionId" element={<QuestionAndAnswer />} />
//       <Route path="*" element={<NotFound />} />

//       <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
//       <Route path="/auth" element={<AuthLayout />} />
//       <Route path="/forgetPass" element={<ForgetPassword />} />
//     </Routes>
//   );
// }

// export default AppRouter;

import { Routes, Route } from "react-router-dom";

import QuestionAndAnswer from "../Pages/QuestionAndAnswer/QuestionAndAnswer.jsx";
import AskQuestion from "../Pages/AskQuestion/AskQuestion.jsx";
import PrivacyPolicy from "../Pages/PrivacyPolicy/PrivacyPolicy.jsx";
import Home from "../Pages/Home/Home.jsx";
import AuthLayout from "../Pages/AuthLayout/AuthLayout.jsx";
import ForgetPassword from "../Pages/ForgetPassword/ForgetPassword.jsx";
import NotFound from "../Pages/NotFound/NotFound.jsx";
import ProtectedRoute from "../components/protectedRoutes/ProtectedRoute.jsx";

function AppRouter() {
  return (
    <Routes>
      {/* Protected Home */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route path="/ask" element={<AskQuestion />} />

      <Route path="/question/:questionId" element={<QuestionAndAnswer />} />

      <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
      <Route path="/auth" element={<AuthLayout />} />
      <Route path="/forgetPass" element={<ForgetPassword />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
