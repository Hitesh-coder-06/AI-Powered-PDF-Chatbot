 **AI-Powered PDF Chatbot**

An intelligent offline AI chatbot that allows users to upload PDF documents or images and ask questions based on their content.
The application uses **Ollama (Llama 3.2)** for local LLM inference and **EasyOCR** for extracting text from images, ensuring complete offline functionality without relying on cloud APIs.

This Model is also contain the cloud API functionality so simply add link of the API and use 
---

## 📖 Overview

This project is a Retrieval-Augmented Generation (RAG) based chatbot that enables users to interact with uploaded documents.

Users can:
- Upload PDF files
- Upload images containing text
- Ask questions in **English, Hindi, or Hinglish**
- Receive answers generated only from the uploaded document

Since the model runs locally using Ollama, user data remains private and no internet connection is required after setup.

---

## ✨ Features

- 📄 PDF Upload
- 🖼️ Image OCR Support
- 🤖 Local AI using Ollama (Llama 3.2)
- 🌐 Multilingual Responses
  - English
  - Hindi
  - Hinglish (Roman Hindi)
- 🔒 Fully Offline
- ⚡ Fast Question Answering
- 📚 Context-Based Responses
- 🎯 Answer Only From Uploaded Document
- 💻 Simple & Responsive User Interface

---

## 🛠 Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- Multer
- pdf-parse

### AI & OCR

- Ollama
- Llama 3.2
- EasyOCR
- Python

---

## 📂 Project Structure

```
AI-Powered-PDF-Chatbot
│
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
│
├── server/
│   ├── ocr/
│   │   └── ocr.py
│   ├── uploads/
│   ├── newserver.js
│   └── package.json
│
├── Sample_Data/
├── package.json
└── README.md
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/Hitesh-coder-06/AI-Powered-PDF-Chatbot.git
```

Move into the project

```bash
cd AI-Powered-PDF-Chatbot
```

---

## 📦 Install Frontend Dependencies

```bash
npm install
```

---

## 📦 Install Backend Dependencies

```bash
cd server
npm install
```

---

## 🐍 Install Python Packages

```bash
pip install easyocr
pip install pdf2image
pip install pillow
```

---

## 🤖 Install Ollama

Download Ollama

https://ollama.com/download

Pull the required model

```bash
ollama pull llama3.2:3b
```

Start Ollama

```bash
ollama serve
```

---

## ▶️ Run Backend

```bash
cd server
node newserver.js
```

---

## ▶️ Run Frontend

```bash
npm run dev
```

---

## 📷 Usage

1. Start Ollama.
2. Start the backend server.
3. Start the React frontend.
4. Open the application in your browser.
5. Upload a PDF or image.
6. Ask questions related to the uploaded document.
7. Receive AI-generated answers.

---

## 🌍 Supported Languages

- English
- Hindi
- Hinglish (Roman Hindi)

---

## 🎯 Future Improvements

- Multiple PDF support
- FAISS Vector Database
- Better Semantic Search
- Voice Input
- Voice Output
- Document Summarization
- Chat History
- User Authentication
- Docker Deployment

---

## 👨‍💻 Author

**Hitesh Rathore**

GitHub: https://github.com/Hitesh-coder-06



---

## ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

---

