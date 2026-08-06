import { useState } from "react";

import "./style.css";

function App(){

    const [message,setMessage] = useState("");

    const [fileName,setFileName] = useState("");

    const [chat,setChat] = useState([

        {
            text:"Hello Hitesh 👋",
            sender:"bot"
        },

        {
            text:"Upload PDF/Image and ask questions from it.",
            sender:"bot"
        }

    ]);


    // Upload PDF

    // Upload PDF or Image

async function handleFile(e){

    const file = e.target.files[0];

    if(!file){
        return;
    }

    setFileName(file.name);

    const formData = new FormData();

    let url = "";

    // PDF Upload
    if(file.type === "application/pdf"){

        formData.append("pdf", file);

        url = "http://localhost:5000/upload";

    }

    // Image Upload
    else if(
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg"
    ){

        formData.append("image", file);

        url = "http://localhost:5000/uploadImage";

    }

    else{

        alert("Only PDF, PNG, JPG and JPEG files are allowed.");

        return;

    }

    try{

        const response = await fetch(

            url,

            {

                method:"POST",

                body:formData

            }

        );

        const data = await response.json();

        setChat((prev)=>[

            ...prev,

            {

                text:data.message,

                sender:"bot"

            }

        ]);

    }

    catch(error){

        console.log(error);

    }

}


    // Send Message

    async function sendMessage(){

        if(message===""){
            return;
        }

        let userMessage = {

            text:message,

            sender:"user"

        };


        let loadingMessage = {

            text:"typing....",

            sender:"bot"

        };


        setChat((prev)=>[

            ...prev,
            userMessage,
            loadingMessage

        ]);


        let currentMessage = message;

        setMessage("");


        try{

            const response = await fetch(

                "http://localhost:5000/chat",

                {

                    method:"POST",

                    headers:{

                        "Content-Type":"application/json"

                    },

                    body:JSON.stringify({

                        question:currentMessage

                    })

                }

            );


            const data = await response.json();


            let botMessage = {

                text:data.answer,

                sender:"bot"

            };


            setChat((prev)=>{

                let filteredChat = prev.filter(

                    (msg)=>msg.text!=="typing...."

                );

                return [...filteredChat,botMessage];

            });

        }

        catch(error){

            console.log(error);

        }

    }



    return(

        <div className="app-container">

            {/* Sidebar */}

            <div className="sidebar">

                <h2>AI PDF/document/image ChatBot</h2>

                <label className="upload-btn">

                    Upload PDF/Image

                    <input

                        type="file"

                        accept=".pdf,.png,.jpg,.jpeg"

                        hidden

                        onChange={handleFile}

                    />

                </label>


                {

                    fileName &&

                    <div className="file-box">

                        📄 {fileName}

                    </div>

                }

            </div>



            {/* Main Chat */}

            <div className="main-chat">

                {/* Header */}

                <div className="chat-header">

                    PDF Chat Section 

                </div>



                {/* Chat Messages */}

                <div className="chat-box">

                    {

                        chat.map((msg,index)=>(

                            <div

                                key={index}

                                className={

                                    msg.sender==="user"

                                    ? "user-message"

                                    : "bot-message"
                                }

                            >

                                {msg.text}

                            </div>

                        ))

                    }

                </div>



                {/* Input */}

                <div className="input-area">

                    <input

                        type="text"

                        placeholder="Ask anything from PDF..."

                        value={message}

                        onChange={(e)=>

                            setMessage(e.target.value)

                        }

                        onKeyDown={(e)=>{

                            if(e.key==="Enter"){

                                sendMessage();

                            }

                        }}

                    />



                    <button onClick={sendMessage}>

                        Send

                    </button>



                </div>

                <div>
                    <footer id="Footer">
                        Made By Hitesh Rathore✌️
                    </footer>
                </div>

            </div>

            

        </div>

    );

}

export default App;