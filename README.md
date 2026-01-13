📄 AI Document Chatbot

An AI-powered single-page document chatbot that allows users to upload documents, analyze their content, and ask topic-related questions. The system provides intelligent, real-time answers based strictly on the uploaded document through a clean, responsive, and user-friendly interface.

🚀 Project Overview

This project is designed to demonstrate how Artificial Intelligence can be used to understand documents and interact with users in a conversational way.
Users can upload documents and then ask questions related only to that document. The AI analyzes the content and responds accurately without going outside the provided data.

👉 Simple words mein:
Ye project ek AI chatbot hai jo documents ko samajh kar un par based questions ke answers deta hai.

✨ Key Features

📂 Upload documents (PDF / Text / Docs)

🤖 AI-powered document understanding

💬 Chat interface for asking questions

🎯 Answers are strictly document-based

⚡ Real-time responses

🧼 Clean and responsive UI

🔄 Chat history support

🗑️ Delete chats without page reload

🧠 Starter questions for better UX

🛠️ Tech Stack
Frontend

React.js (Vite)

Tailwind CSS

Axios

React Icons

Backend

Node.js

Express.js

MongoDB

Multer (for file uploads)

Google Generative AI (Gemini)

🔄 Application Flow

User opens the web app

Uploads a document

AI processes and stores document content

User asks questions in chat

AI responds based only on uploaded document

Chat history is saved and manageable

🧠 AI Logic (How It Works)

Uploaded documents are converted into readable text

Text is sent to the AI model

User queries are matched with document context

AI generates answers without hallucination

If answer is not found, AI politely responds that information is unavailable

🧪 Example Use Cases

📚 Study notes Q&A

📄 Resume analysis

🏢 Company policy chatbot

📑 Legal or technical document assistance

🧠 Personal knowledge base

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/ai-document-chatbot.git

2️⃣ Install Dependencies
Frontend
cd frontend
npm install
npm run dev

Backend
cd backend
npm install
npm run dev

🔐 Environment Variables

Create a .env file in backend:

PORT=5000
MONGODB_URI=your_mongodb_connection
GEMINI_API_KEY=your_api_key

🌐 Frontend Environment Variables

Create a .env file in the frontend root directory and add the backend localhost URL:

VITE_API_BASE_URL=http://localhost:5000

📌 Future Improvements

🔍 Multiple document support

🌐 User authentication

🧾 Document summary feature

📊 Analytics dashboard

🌙 Dark mode

👨‍💻 Developer

Hassnain Ali
Frontend Developer | AI Enthusiast

📧 Email: your-email@example.com

🌐 Portfolio: your-portfolio-link
