# 📄 AI Document Chatbot

An AI-powered single-page document chatbot that enables users to upload documents, analyze their content, and ask topic-related questions. The system delivers intelligent, real-time answers strictly based on the uploaded document through a clean, responsive, and user-friendly interface.

## Project Overview

AI Document Chatbot demonstrates the practical use of Artificial Intelligence in understanding and interacting with document-based content. Users can upload a document and communicate with it through a conversational interface. The AI processes the document, understands its context, and provides accurate answers without generating information outside the provided data.

## Key Features

- Upload documents (PDF, Text, Docs)
- AI-powered document understanding
- Interactive chat-based question answering
- Strictly document-based responses
- Real-time intelligent replies
- Clean and responsive user interface
- Chat history management
- Delete chats without page reload
- Starter questions for improved user experience

## Tech Stack

**Frontend:** React.js (Vite), Tailwind CSS, Axios, React Icons  
**Backend:** Node.js, Express.js, MongoDB, Multer, Google Generative AI (Gemini)

## Application Flow

The user uploads a document, which is processed and converted into readable text. The extracted content is analyzed by the AI model. Users then ask questions through the chat interface, and the system responds strictly based on the uploaded document. All conversations are stored and can be managed efficiently.

## AI Logic

The system converts uploaded documents into text, sends the content to the AI model, and matches user queries with the document context. The AI generates accurate responses without hallucination. If relevant information is not found, the system clearly indicates that the answer is unavailable.

## Use Cases

- Study notes question answering
- Resume and CV analysis
- Company policy assistant
- Legal or technical document support
- Personal knowledge base

## Installation and Setup

Clone the repository:


git clone https://github.com/your-username/ai-document-chatbot.git

## Installation and Setup

Install and run the frontend:
````bash
cd frontend
npm install
npm run dev
````
## Backend Setup

Install and run the backend:
````bash
cd backend
npm install
npm run dev
````
## Environment Variables

Create a `.env` file in the backend directory:
````env
PORT=5000
MONGODB_URI=your_mongodb_connection
GEMINI_API_KEY=your_api_key
````
Create a `.env` file in the frontend root directory:
````env
VITE_API_BASE_URL=http://localhost:5000
````
## Future Enhancements

- Support for multiple documents
- User authentication system
- Document summarization feature
- Analytics dashboard
- Dark mode support

## Developer

**Hassnain Ali**  
Frontend Developer | AI Enthusiast  
Email: hassnainali96788@gmail.com  
Portfolio: https://hassnainali-portfolio.vercel.app/
