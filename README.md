#  AI-Powered PDF Chatbot

An intelligent AI chatbot that allows users to upload PDF documents or images and ask questions based on their content.

The application supports **two modes**:

* **Offline Mode** — Uses **Ollama (Llama 3.2)** for local AI inference and **EasyOCR** for image text extraction. This mode works completely offline and keeps user data on the local machine. this modes is use both format text and pdf
* **Online Mode** — Uses **Groq API** through `Online_server.js` and is designed for **cloud deployment**. This mode can be used when deploying the backend on platforms such as Render. this mode only support the pdf format. This mode is testing the UI and functionality of the project that how it responding through pdf upload 

---

## 📖 Overview

This project is a Retrieval-Augmented Generation (RAG) based chatbot that enables users to interact with uploaded documents.

Users can:

* Upload PDF files
* Upload images containing text
* Ask questions in **English, Hindi, or Hinglish**
* Receive answers generated only from the uploaded document

### 🔌 Two Server Modes

**Offline Mode**

The offline version uses:

```text
Offline_server.js
        ↓
Ollama
        ↓
Llama 3.2
```

It runs the AI model locally and does not require a cloud API.

**Online / Deployment Mode**

The online version uses:

```text
Online_server.js
        ↓
Groq API
        ↓
Cloud-hosted LLM
```

`Online_server.js` is intended for online deployment. It can be used as the backend when deploying the application to a cloud platform such as Render.

---

Since the offline model runs locally using Ollama, user data remains private and no internet connection is required after setup.

---

## ✨ Features

* 📄 PDF Upload
* 🖼️ Image OCR Support
* 🤖 Local AI using Ollama (Llama 3.2)
* 🌐 Multilingual Responses

  * English
  * Hindi
  * Hinglish (Roman Hindi)
* 🔒 Fully Offline
* ☁️ Online Deployment Support
* ⚡ Fast Question Answering
* 📚 Context-Based Responses
* 🎯 Answer Only From Uploaded Document
* 💻 Simple & Responsive User Interface

---

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* Multer
* pdf-parse

### AI & OCR

* Ollama
* Llama 3.2
* Groq API
* EasyOCR
* Python

---

## 📂 Project Structure

```text
AI-Powered-PDF-Chatbot
│
├── backend/
│   ├── ocr/
│   │   ├── ocr.py
│   │   └── test.py
│   ├── uploads/
│   ├── Offline_server.js
│   ├── Online_server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── ChatMessages.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   └── Footer.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── Style.css
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── Sample_Data/
├── .gitignore
└── README.md
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/Hitesh-coder-06/AI-Powered-PDF-Chatbot.git
```

Move into the project:

```bash
cd AI-Powered-PDF-Chatbot
```

---

## 📦 Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 📦 Install Backend Dependencies

Open another terminal and run:

```bash
cd backend
npm install
```

---

# 📴 Offline Mode

The offline version uses **Ollama** and the local Llama 3.2 model.

## 🤖 Install Ollama

Download Ollama from:

https://ollama.com/download

Pull the required model:

```bash
ollama pull llama3.2:3b
```

Start Ollama:

```bash
ollama serve
```

## 🐍 Install Python Packages

```bash
pip install easyocr
pip install pdf2image
pip install pillow
```

## ▶️ Run Offline Backend

From the `backend` folder:

```bash
node Offline_server.js
```

The offline backend communicates with the locally running Ollama model.

---

# ☁️ Online / Deployment Mode

The online version uses **Groq API** instead of running the LLM locally.

The deployment backend is:

```text
backend/Online_server.js
```

It is designed to be used when deploying the backend to a cloud platform such as **Render**.

### 🔑 Environment Variable

Create a `.env` file inside the `backend` folder:

```env
GROQ_API_KEY=your_groq_api_key
```

**Never upload your `.env` file or API key to GitHub.**

The `.gitignore` file already excludes the environment file.

## ▶️ Run Online Backend Locally

```bash
cd backend
node Online_server.js
```

The online backend will use the Groq API for AI responses.

---

## ▶️ Run Frontend

From the `frontend` folder:

```bash
npm run dev
```

Then open the URL provided by Vite in your browser.

---

## 📷 Usage

1. Choose the required mode:

   * Offline mode using `Offline_server.js`
   * Online/deployment mode using `Online_server.js`
2. Start the corresponding backend server.
3. Start the React frontend.
4. Open the application in your browser.
5. Upload a PDF or image.
6. Ask questions related to the uploaded document.
7. Receive AI-generated answers.

---

## 🌍 Supported Languages

* English
* Hindi
* Hinglish (Roman Hindi)

---

## 🎯 Future Improvements

* Multiple PDF support
* FAISS Vector Database
* Better Semantic Search
* Voice Input
* Voice Output
* Document Summarization
* Chat History
* User Authentication
* Docker Deployment

---

## 👨‍💻 Author

**Hitesh Rathore**

GitHub: https://github.com/Hitesh-coder-06

---

## ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.
