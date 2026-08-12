// Online deployment server
// Uses Groq API for cloud/online testing and deployment.
// Supports PDF upload and document-based chat.
// Image OCR is intentionally not included in the online server because
// EasyOCR/PyTorch can exceed the memory available on low-memory cloud instances.

const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const Groq = require("groq-sdk");

const app = express();

const PORT = process.env.PORT || 5000;

// ======================
// Groq Model
// ======================

const GROQ_MODEL = "openai/gpt-oss-120b";

// ======================
// CORS
// ======================

app.use(
    cors({
        origin: process.env.FRONTEND_URL || true,
        credentials: true
    })
);

app.use(express.json());

// ======================
// Groq API
// ======================

if (!process.env.GROQ_API_KEY) {
    console.warn("WARNING: GROQ_API_KEY is not configured.");
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// ======================
// Store Extracted Text
// ======================

let pdfChunks = [];
let pdfText = "";

// ======================
// Upload Setup
// ======================

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true
    });
}

const upload = multer({
    dest: uploadDir
});

// ======================
// Health Check
// ======================

app.get("/health", (req, res) => {

    res.json({
        status: "OK",
        message: "Online AI PDF Chatbot backend is running (PDF mode)"
    });

});

// ======================
// Upload PDF
// ======================

app.post("/upload", upload.single("pdf"), async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                message: "No PDF file uploaded"
            });

        }

        const dataBuffer =
            fs.readFileSync(req.file.path);

        const data =
            await pdfParse(dataBuffer);

        pdfText =
            data.text || "";

        pdfChunks = [];

        for (
            let i = 0;
            i < pdfText.length;
            i += 1000
        ) {

            pdfChunks.push(
                pdfText.slice(i, i + 1000)
            );

        }

        // Delete uploaded PDF after extraction

        if (fs.existsSync(req.file.path)) {

            fs.unlinkSync(req.file.path);

        }

        console.log("=================================");
        console.log("PDF Uploaded Successfully");
        console.log("PDF Length :", pdfText.length);
        console.log("Chunks :", pdfChunks.length);
        console.log("=================================");

        res.json({
            message: "PDF Uploaded Successfully"
        });

    }

    catch (error) {

        console.log(
            "PDF Upload Error:",
            error
        );

        if (
            req.file &&
            fs.existsSync(req.file.path)
        ) {

            fs.unlinkSync(req.file.path);

        }

        res.status(500).json({
            message: "Error Uploading PDF"
        });

    }

});

// ======================
// Chat Route
// ======================

app.post("/chat", async (req, res) => {

    try {

        const question =
            req.body.question;

        if (
            !question ||
            !question.trim()
        ) {

            return res.status(400).json({
                answer: "Please enter a question."
            });

        }

        const q =
            question
                .toLowerCase()
                .trim();

        // ======================
        // Hitesh Response
        // ======================

        if (

            q === "who is hitu" ||
            q === "who is hitesh" ||
            q === "who is hitesh rathore" ||
            q === "hitu" ||
            q === "hitesh" ||
            q === "hitesh rathore"

        ) {

            return res.json({

                answer:
                    "😎 Buddy, you are my owner."

            });

        }

        // ======================
        // Detect Language
        // ======================

        let responseLanguage =
            "English";

        const lowerQuestion =
            question.toLowerCase();

        if (
            /[\u0900-\u097F]/.test(question)
        ) {

            responseLanguage =
                "Hindi";

        }

        else if (

            lowerQuestion.includes(
                "hinglish"
            ) ||

            lowerQuestion.includes(
                "roman hindi"
            ) ||

            /\b(kya|kaise|kyu|kyon|hai|ho|kar|karo|seekhna|batao)\b/
                .test(lowerQuestion)

        ) {

            responseLanguage =
                "Hinglish";

        }

        console.log(
            "Question:",
            question
        );

        // ======================
        // Check PDF
        // ======================

        if (
            pdfChunks.length === 0
        ) {

            return res.json({

                answer:
                    "Please upload a PDF first. Image OCR is available only in the offline version."

            });

        }

        // ======================
        // Find Relevant Chunk
        // ======================

        let relevantChunk = "";

        let maxScore = 0;

        const stopWords = [

            "what",
            "is",
            "the",
            "a",
            "an",
            "of",
            "to",
            "in",
            "for",
            "on",
            "and",
            "or",
            "with",
            "are",
            "was",
            "were",
            "how",
            "why",
            "when",
            "where",
            "which",
            "who"

        ];

        const words =
            question
                .toLowerCase()
                .replace(/[^\w\s]/g, "")
                .split(/\s+/)
                .filter(
                    word =>
                        !stopWords.includes(word)
                );

        for (
            const chunk of pdfChunks
        ) {

            let score = 0;

            const chunkLower =
                chunk.toLowerCase();

            for (
                const word of words
            ) {

                if (

                    word.length > 2 &&
                    chunkLower.includes(word)

                ) {

                    score++;

                }

            }

            if (
                score > maxScore
            ) {

                maxScore =
                    score;

                relevantChunk =
                    chunk;

            }

        }

        console.log(
            "Best Score:",
            maxScore
        );

        if (
            maxScore === 0
        ) {

            return res.json({

                answer:
                    "Answer is Not found in uploaded Document"

            });

        }

        console.log(
            "Relevant Chunk:"
        );

        console.log(
            relevantChunk
        );

        // ======================
        // Check Groq API Key
        // ======================

        if (
            !process.env.GROQ_API_KEY
        ) {

            return res.status(500).json({

                answer:
                    "Groq API key is not configured on the server."

            });

        }

        // ======================
        // Groq AI
        // ======================

        const completion =
            await groq.chat.completions.create({

                model:
                    GROQ_MODEL,

                temperature:
                    0.2,

                messages: [

                    {

                        role:
                            "system",

                        content: `

You are a bilingual PDF assistant.

Answer ONLY using the information
provided in the PDF.

Rules:

1. If the question is completely
in English, answer ONLY in English.

2. If the question is completely
in Hindi using Devanagari script,
answer ONLY in Hindi.

3. If the question contains English
words like "hinglish", "Roman Hindi",
or is written in Roman Hindi such as
"Python kya hai", answer ONLY in
Hinglish.

4. Never mix English script and
Hindi script in the same answer.

5. Never translate unless requested.

6. Use ONLY the PDF content.

7. Do not use general knowledge.

8. If the answer is not available
in the PDF, say that the answer
was not found in the document.

9. Response language MUST be:

${responseLanguage}

10. English means ONLY English.

11. Hindi means ONLY Devanagari Hindi.

12. Hinglish means ONLY Roman Hindi.

Do not mix languages.

`

                    },

                    {

                        role:
                            "user",

                        content: `

PDF Content:

${relevantChunk}

Question:

${question}

`

                    }

                ]

            });

        // ======================
        // Get Response
        // ======================

        const text =
            completion
                .choices?.[0]
                ?.message
                ?.content ||
            "Error generating response.";

        console.log(
            "Bot Answer:"
        );

        console.log(
            text
        );

        res.json({

            answer:
                text

        });

    }

    catch (error) {

        console.log(
            "Chat Error:",
            error
        );

        res.status(500).json({

            answer:
                "Error generating response."

        });

    }

});

// ======================
// Serve React Build
// ======================

const distPath =
    path.join(
        __dirname,
        "..",
        "dist"
    );

console.log(
    "Dist Path:",
    distPath
);

console.log(
    "Dist Exists:",
    fs.existsSync(distPath)
);

if (
    fs.existsSync(distPath)
) {

    app.use(
        express.static(distPath)
    );

    app.get(
        "/",
        (req, res) => {

            res.sendFile(
                path.join(
                    distPath,
                    "index.html"
                )
            );

        }
    );

}

// ======================
// Start Server
// ======================

const server =
    app.listen(
        PORT,
        "0.0.0.0",
        () => {

            console.log(
                "================================="
            );

            console.log(
                `Online Server Running on Port ${PORT}`
            );

            console.log(
                "Using Groq API"
            );

            console.log(
                `Model: ${GROQ_MODEL}`
            );

            console.log(
                "================================="
            );

        }
    );

server.on(
    "error",
    (err) => {

        console.error(
            "Server Error:",
            err
        );

    }
);

process.on(
    "uncaughtException",
    (err) => {

        console.error(
            "Uncaught Exception:",
            err
        );

    }
);

process.on(
    "unhandledRejection",
    (err) => {

        console.error(
            "Unhandled Rejection:",
            err
        );

    }
);