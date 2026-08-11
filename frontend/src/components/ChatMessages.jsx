function ChatMessages({ chat }) {

    return (

        <div className="chat-box">

            {chat.map((msg, index) => (

                <div
                    key={index}
                    className={
                        msg.sender === "user"
                            ? "user-message"
                            : "bot-message"
                    }
                >

                    {msg.text}

                </div>

            ))}

        </div>

    );

}

export default ChatMessages;