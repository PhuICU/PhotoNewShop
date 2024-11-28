import React, { useState } from "react";

const OPENAI_API_KEY =
  "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";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi, how can I help you?", sender: "bot" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [Typing, setTyping] = useState(false);

  const handleSendMessage = async (text) => {
    if (Typing) return; // Prevent multiple rapid requests
    const newMessage = { text: text, sender: "user", direction: "outgoing" };
    setMessages((prev) => [...prev, newMessage]);
    setTyping(true);

    // Add a debounce delay
    setTimeout(() => processMessageBot([...messages, newMessage]), 500);
  };

  async function processMessageBot(chatMessages, retryCount = 0) {
    const apiMessages = chatMessages.map((messageObj) => {
      const role = messageObj.sender === "bot" ? "assistant" : "user";
      return { role: role, content: messageObj.text };
    });

    const systemMessage = {
      role: "system",
      content: "You are a helpful assistant.",
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify(apiRequestBody),
        }
      );

      if (response.status === 429) {
        if (retryCount < 5) {
          // Retry up to 5 times
          const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
          console.warn(
            `Rate limit exceeded. Retrying in ${delay / 1000} seconds...`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          return await processMessageBot(chatMessages, retryCount + 1);
        } else {
          throw new Error("Rate limit exceeded after multiple retries.");
        }
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = data.choices[0].message.content;
      setMessages([
        ...chatMessages,
        { text: botMessage, sender: "bot", direction: "incoming" },
      ]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setTyping(false);
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>Chatbot</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "400px",
          overflowY: "scroll",
          marginBottom: "20px",
        }}
      >
        {messages.map((message, index) => (
          <div key={index}>
            <p
              style={{
                background: message.sender === "bot" ? "#f0f0f0" : "#007bff",
                color: message.sender === "bot" ? "#000" : "#fff",
                padding: "10px",
                borderRadius: "10px",
                display: "inline-block",
                maxWidth: "80%",
                marginBottom: "10px",
              }}
            >
              {message.text}
            </p>
          </div>
        ))}
        {Typing && (
          <p
            style={{
              background: "#f0f0f0",
              color: "#000",
              padding: "10px",
              borderRadius: "10px",
              display: "inline-block",
              maxWidth: "80%",
              marginBottom: "10px",
            }}
          >
            Typing...
          </p>
        )}
      </div>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSendMessage(e.target.value);
            setUserInput("");
          }
        }}
        style={{ width: "100%", padding: "10px" }}
      />
      <button
        onClick={() => {
          handleSendMessage(userInput);
          setUserInput("");
        }}
        style={{ padding: "10px", width: "100%", marginTop: "10px" }}
      >
        Send
      </button>
    </div>
  );
};

export default Chatbot;
