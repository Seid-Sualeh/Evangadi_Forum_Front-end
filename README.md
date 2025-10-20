# 🗣️ Evangadi Forum – Frontend  

## 📖 Overview  
**Evangadi Forum** is a modern discussion platform built with **React.js** that allows users to ask, answer, and explore questions across various topics.  
It features **AI-powered assistance** that automatically suggests **videos**, **websites**, and **books** related to the user’s question — helping learners explore topics deeply.  

---

## 🚀 Key Features  

### 🧠 AI Integration  
- Integrated **AI system** that analyzes the question’s topic or keywords.  
- Automatically provides **3 recommended videos**, **3 websites**, and **3 books** related to the question.  
- Displays AI-generated **definitions or explanations** for better understanding.  
- Designed to enhance user learning and engagement.  

### 🙋‍♂️ Question & Answer System  
- Users can:
  - **Ask questions**
  - **Answer questions**
- Each answer includes:
  - 👍 Like count
  - 💬 Comment count
- Questions display:
  - 👁️ Viewer count
  - 💬 Number of answers  

### ✏️ Editing and Permissions  
- Only the **creator user** can **edit** or **delete** their own questions and answers.  
- Changes update instantly for **online users**.  

### 🔍 Filtering & Search  
- Filter questions by **title** or **keyword**.  
- Optimized for fast and accurate search results.  

### 📄 Pagination  
- Automatically loads **next pages** if total questions exceed 6.  
- Smooth “Next Page” navigation for large forums.  

### 🔐 Authentication  
- **Google Sign Up / Login** (via   Google OAuth).  
- Secure **JWT-based authentication**.  
- Includes **Forget Password** and **Reset Password** features.  

### 💬 User Experience  
- Responsive and modern design using **custom CSS**.  
- Consistent navigation with **React Router v6**.  
- Dynamic updates using **React Context API**.  

---

## 🧩 Tech Stack  

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React.js, Vite, React Router, Context API |
| **Styling** |  FontAwesome, Custom CSS |
| **AI Integration** | Gemini |
| **Auth** |  Google OAuth + JWT |
| **Backend API** | Node.js + Express + MySQL |
| **Deployment** | Render (Backend) + Netlify/Vercel (Frontend) |

---

## 🧠 How the AI Suggestion Works  

When a user asks a question, it is sent to the **AI endpoint**.  

The AI analyzes the topic and returns:  

- 🧾 A brief **definition or explanation**.  
- 🎥 **3 related videos** (YouTube links).  
- 🌍 **3 educational websites**.  
- 📘 **3 recommended books**.  

These resources appear below the question to help the asker and others learn more.  

---

### 🧩 Example  

If the user asks: **“What is React Context API?”**  

AI Suggestions might include:  

- **Definition:** “Context API allows data to be shared globally without prop drilling.”  
- **Videos:** Traversy Media, Codevolution, Programming with Mosh.  
- **Websites:** react.dev, w3schools.com, freecodecamp.org.  
- **Books:** *Learning React*, *Fullstack React*, *React Up & Running*.  

---


## 🧑‍💻 Author  

**Seid Sualeh Mohammed**  
Full-stack Developer |AI Integration Enthusiast  

🌐 [LinkedIn](https://LinkedIn/in/seid-sualeh) | 💻 [Portfolio](https://seidsualeh.netlify.app) | 📧 plshireseid@gmail.com 

---







