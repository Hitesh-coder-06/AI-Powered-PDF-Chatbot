import { useState } from "react";

import "./Style.css";

import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import Footer from "./components/Footer";

// Backend URL
// Local: http://localhost:5000
// Online: VITE_API_URL from Render
const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";


function App() {

    const [message, setMessage] = useState("");

    const [fileName, setFileName] = useState("");

    const [chat, setChat] = useState([
        {
            text: "Hello Hitesh 👋",
            sender: "bot"
        },
        {
            text: "Upload PDF/Image and ask questions from it.",
            sender: "bot"
        }
    ]);


    // =========================
    // Upload PDF / Image
    // =========================

    async function handleFile(e) {

        const file = e.target.files[0];

        if (!file) {
            return;
        }

        setFileName(file.name);

        const formData = new FormData();

        let url = "";


        // PDF

        if (file.type === "application/pdf") {

            formData.append("pdf", file);

            url = `${API_URL}/upload`;

        }


        // Image

        else if (
            file.type === "image/png" ||
            file.type === "image/jpeg" ||
            file.type === "image/jpg"
        ) {

            formData.append("image", file);

            url = `${API_URL}/uploadImage`;

        }


        // Invalid file

        else {

            alert(
                "Only PDF, PNG, JPG and JPEG files are allowed."
            );

            return;

        }


        try {

            const response = await fetch(
                url,
                {
                    method: "POST",
                    body: formData
                }
            );


            const data = await response.json();


            setChat((prev) => [
                ...prev,
                {
                    text: data.message,
                    sender: "bot"
                }
            ]);

        }

        catch (error) {

            console.log("Upload Error:", error);

            setChat((prev) => [
                ...prev,
                {
                    text: "Error uploading file.",
                    sender: "bot"
                }
            ]);

        }

    }


    // =========================
    // Send Message
    // =========================

    async function sendMessage() {

        if (message.trim() === "") {
            return;
        }


        const currentMessage = message;


        const userMessage = {
            text: currentMessage,
            sender: "user"
        };


        const loadingMessage = {
            text: "typing....",
            sender: "bot"
        };


        setChat((prev) => [
            ...prev,
            userMessage,
            loadingMessage
        ]);


        setMessage("");


        try {

            const response = await fetch(
                `${API_URL}/chat`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        question: currentMessage
                    })
                }
            );


            const data = await response.json();


            const botMessage = {
                text: data.answer,
                sender: "bot"
            };


            setChat((prev) => {

                const filteredChat = prev.filter(
                    (msg) => msg.text !== "typing...."
                );


                return [
                    ...filteredChat,
                    botMessage
                ];

            });

        }

        catch (error) {

            console.log("Chat Error:", error);


            setChat((prev) => {

                const filteredChat = prev.filter(
                    (msg) => msg.text !== "typing...."
                );


                return [
                    ...filteredChat,
                    {
                        text: "Unable to connect to backend.",
                        sender: "bot"
                    }
                ];

            });

        }

    }


    return (

        <div className="app-container">


            {/* ======================
                Sidebar
            ====================== */}

            <Sidebar
                fileName={fileName}
                handleFile={handleFile}
            />


            {/* ======================
                Main Chat
            ====================== */}

            <div className="main-chat">


                {/* Header */}

                <ChatHeader />


                {/* Messages */}

                <ChatMessages
                    chat={chat}
                />


                {/* Input */}

                <ChatInput
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                />


                {/* Footer */}

                <Footer />


            </div>

        </div>

    );

}


export default App;