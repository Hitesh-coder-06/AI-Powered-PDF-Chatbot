const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const { Ollama } = require("ollama");
const path = require("path");
const { spawn } = require("child_process");

const ollama = new Ollama();

// ===================================================
// OPTIONAL ONLINE MODEL (Groq)
// Uncomment these lines to enable online mode
// ===================================================

// require("dotenv").config();
// const Groq = require("groq-sdk");

// const groq = new Groq({
//     apiKey: process.env.GROQ_API_KEY,
// });

const app = express();

app.use(cors());
app.use(express.json());

// ======================
// Store Extracted Text
// ======================

let pdfChunks = [];
let pdfText = "";

// ======================
// Upload Setup
// ======================

const upload = multer({

    dest: "uploads/"

});

// ======================
// Upload PDF
// ======================

app.post("/upload", upload.single("pdf"), async (req, res) => {

    try{

        const dataBuffer = fs.readFileSync(req.file.path);

        const data = await pdfParse(dataBuffer);

        pdfText = data.text;

        pdfChunks = [];

        for(let i=0;i<pdfText.length;i+=1000){

            pdfChunks.push(

                pdfText.slice(i,i+1000)

            );

        }

        console.log("=================================");
        console.log("PDF Uploaded Successfully");
        console.log("PDF Length :",pdfText.length);
        console.log("Chunks :",pdfChunks.length);
        console.log("=================================");

        res.json({

            message:"PDF Uploaded Successfully"

        });

    }

    catch(error){

        console.log(error);

        res.json({

            message:"Error Uploading PDF"

        });

    }

});

// ======================
// Upload Image
// ======================

app.post("/uploadImage", upload.single("image"), async (req,res)=>{

    try{

        const imagePath = req.file.path;

        const python = spawn(

            "python",

            [

                path.join(__dirname,"ocr","ocr.py"),

                imagePath

            ]

        );

        let extractedText = "";

        let errorText = "";

        python.stdout.on("data",(data)=>{

            extractedText += data.toString();

        });

        python.stderr.on("data",(data)=>{

            errorText += data.toString();

        });

        python.on("close",(code)=>{

            if(code!==0){

                console.log(errorText);

                return res.json({

                    message:"OCR Failed"

                });

            }

            pdfText = extractedText;

            pdfChunks = [];

            for(let i=0;i<pdfText.length;i+=1000){

                pdfChunks.push(

                    pdfText.slice(i,i+1000)

                );

            }

            if(fs.existsSync(imagePath)){

                fs.unlinkSync(imagePath);

            }

            console.log("=================================");
            console.log("Image Uploaded Successfully");
            console.log("OCR Text Length :",pdfText.length);
            console.log("Chunks :",pdfChunks.length);
            console.log("=================================");

            res.json({

                message:"Image Uploaded Successfully"

            });

        });

    }

    catch(error){

        console.log(error);

        res.json({

            message:"Error Uploading Image"

        });

    }

});


// ======================
// Chat Route
// ======================

app.post("/chat", async (req, res) => {

    try {

        const question = req.body.question;
        const q = question.toLowerCase().trim();

       if (
       q === "who is hitu" ||
      q === "who is hitesh" ||
      q === "who is hitesh rathore" ||
      q === "hitu" ||
       q === "hitesh" ||
      q === "hitesh rathore"
     ) {

    return res.json({

        answer: "😎 Buddy, you are my owner."

    });

}
        let responseLanguage = "English";

    const lowerQuestion = question.toLowerCase();

    if (/[\u0900-\u097F]/.test(question)) {
    responseLanguage = "Hindi";
    }
    else if (
    lowerQuestion.includes("hinglish") ||
    lowerQuestion.includes("roman hindi") ||
     /\b(kya|kaise|kyu|kyon|hai|ho|kar|karo|seekhna|batao)\b/.test(lowerQuestion)
     ) {
    responseLanguage = "Hinglish";
    }

        console.log("Question:", question);

        // Check if PDF exists
        if (pdfChunks.length === 0) {

            return res.json({

                answer: "Please upload a PDF first."

            });

        }

        // -----------------------------
        // Find Relevant Chunk
        // -----------------------------

        let relevantChunk = "";
        let maxScore = 0;

        // const words = question.toLowerCase().split(" ");
        const stopWords = [
            "what","is","the","a","an","of","to",
            "in","for","on","and","or","with",
             "are","was","were","how","why","when",
             "where","which","who"
            ];

        const words = question
         .toLowerCase()
          .replace(/[^\w\s]/g,"")
        .split(/\s+/)
        .filter(word => !stopWords.includes(word));

        for (let chunk of pdfChunks) {

            let score = 0;

            for (let word of words) {

                // if (chunk.toLowerCase().includes(word)) {

                //     score++;

                // }

            const chunkLower=chunk.toLowerCase();

            if(
                word.length>2 && chunkLower.includes(word)
            ){
                score++;
            }

            }

            if (score > maxScore) {

                maxScore = score;
                relevantChunk = chunk;

            }

        }

        

        console.log("Best Score:", maxScore);
        if(maxScore==0){
            return  res.json({
                answer:"Answer is Not found in uploaded Document"
            })
        }
    
       
        console.log("Relevant Chunk:");
        console.log(relevantChunk);

        // -----------------------------
        // Ollama Local LLM
        // -----------------------------

        const response = await ollama.chat({

            model: "llama3.2:3b",

            messages: [

                {

                    role: "system",

                    content: `
// You are a bilingual PDF assistant.

// Answer ONLY using the information provided in the PDF.

// Rules:

// 1. If the question is completely in English, answer ONLY in English.

// Example:
// Question: What is Python?
// Answer: Python is a high-level interpreted programming language.

// 2. If the question is completely in Hindi (Devanagari script), answer ONLY in Hindi.

// Example:
// Question: पायथन क्या है?
// Answer: पायथन एक उच्च स्तरीय इंटरप्रेटेड प्रोग्रामिंग भाषा है।

// 3. If the question contains English words like "in hinglish", "hinglish", "Roman Hindi", or is written in Roman Hindi (for example "Python kya hai"), answer ONLY in Hinglish (Roman Hindi).

// Example:
// Question: Python kya hai?
// Answer: Python ek high-level interpreted programming language hai.

// Question: Why learn Python in Hinglish?
// Answer: Python seekhna easy hai kyunki iska syntax simple hai aur iska use AI, Machine Learning, Web Development aur Data Science mein hota hai.

// 4. Never mix English script and Hindi script in the same answer unless the user explicitly asks.

// 5. Never translate unless requested.

// 6. Use ONLY the PDF content.

// 7. If the answer is not available in the PDF, reply in the same language/style as the question.

// English:
// Answer not found in PDF.

// Hindi:
// उत्तर PDF में नहीं मिला।

// Hinglish:
// Answer PDF mein nahi mila.
You are a PDF assistant.

Answer ONLY using the provided PDF content.

The response language MUST be ${responseLanguage}.

Rules:

- If response language is English, use ONLY English words.
- If response language is Hindi, use ONLY Hindi (Devanagari script).
- If response language is Hinglish, use ONLY Roman Hindi.

Do not mix languages.

If the answer is not in the PDF, answer in ${responseLanguage}.
`

                },

                {

                    role: "user",

                    content: `
PDF Content:

${relevantChunk}

Question:

${question}
`

                }

            ]

        });
        // =======================================================
// ONLINE VERSION (Groq)
// Uncomment this block if you want to use Groq API
// =======================================================

// const completion = await groq.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     messages: [
//         {
//             role: "system",
//             content: `
// You are a bilingual PDF assistant.
// Answer ONLY using the provided PDF content.
// Response language: ${responseLanguage}
//             `
//         },
//         {
//             role: "user",
//             content: `
// PDF Content:
//
// ${relevantChunk}
//
// Question:
//
// ${question}
// `
//         }
//     ]
// });

// const text = completion.choices[0].message.content;

        const text = response.message.content;

        console.log("Bot Answer:");
        console.log(text);

        res.json({

            answer: text

        });

    }

    catch (error) {

        console.log(error);

        res.json({

            answer: "Error generating response."

        });

    }

});

// ======================
// Start Server
// ======================

app.listen(5000, () => {

    console.log("=================================");
    console.log("Server Running on Port 5000");
    console.log("Offline RAG using Ollama");
    console.log("=================================");

});