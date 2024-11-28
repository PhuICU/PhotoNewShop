import React, { useEffect, useRef, useState } from "react";
import { useFetchRecipientUser } from "../../hook/useRecipientUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { timeSince } from "../../utils/Funtion";
import InputEmoji from "react-input-emoji";
import { Button } from "@mui/material";
import instance from "../../api/instanApi";

const ChatBox = ({ chat, user, id }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);

  const [message, setMessage] = useState({
    text: "",
    senderId: user,
    chatId: "",
  });
  const messageRef = useRef(null);
  const queryClient = useQueryClient();

  message.chatId = id;

  const { data: data1, isLoading } = useQuery({
    queryKey: ["messages", id], // include 'id' in queryKey to refetch on change
    queryFn: () => instance.get(`/messages/${id}`),
    enabled: !!id, // ensures query only runs if 'id' has a valid value
  });

  const messages = data1?.data?.data || [];
  console.log(messages);

  const messageMutation = useMutation({
    mutationFn: (data) =>
      instance.post(`/messages/create`, {
        text: data.text,
        senderId: user,
        chatId: id,
      }),
  });

  const handleSendMessage = (event) => {
    if (message.text === "") return;
    event.preventDefault();
    messageMutation.mutate(message, {
      onSuccess: () => {
        queryClient.invalidateQueries(["messages"]);
        setMessage({ ...message, text: "" });
      },
    });
  };

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoading && id) {
    return (
      <div
        style={{
          height: "500px",
          overflowY: "scroll",
          padding: "1rem",
          borderRadius: "20px",
          backgroundColor: "#f0f0f0",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p
          className="text-center"
          style={{ paddingTop: "2rem", fontSize: "1.2rem" }}
        >
          Đang tải đoạn chat, xin hãy chờ..
        </p>
      </div>
    );
  }

  return (
    <div>
      <ul
        className="list-unstyled"
        ref={messageRef}
        style={{
          height: "500px",
          overflowY: "scroll",
          padding: "1rem",
          borderRadius: "20px",
          backgroundColor: "#f0f0f0",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {messages.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "#b0b0b0",
              fontSize: "1.2rem",
              marginTop: "2rem",
              paddingBottom: "300px",
            }}
          >
            Chưa có cuộc trò chuyện nào
          </p>
        ) : (
          messages.map((msg) => (
            <li
              key={msg._id}
              className={`d-flex mb-4 ${
                msg.senderId === user
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              {msg.senderId !== user && (
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
                  alt="avatar"
                  className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                  width="60"
                />
              )}
              <div
                className="card"
                style={{
                  backgroundColor: "#f0f0f0",
                  borderRadius: "20px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                  border: "none",
                  maxWidth: "70%",
                  padding: "0",
                  fontFamily: "nunito",
                  fontSize: "1rem",
                  width: "400px",
                }}
              >
                <div className="card-header d-flex justify-content-between p-3">
                  <p className="fw-bold mb-0">
                    {msg.senderId === user ? "Bạn" : recipientUser?.full_name}
                  </p>
                  <p className="text-muted small mb-0">
                    <i className="far fa-clock"></i> {timeSince(msg.created_at)}
                  </p>
                </div>
                <div className="card-body">
                  <p className="mb-0">{msg.text}</p>
                </div>
              </div>
            </li>
          ))
        )}
        {recipientUser && (
          <div className="d-flex justify-content-around">
            <div
              style={{
                width: "90%",
              }}
            >
              <InputEmoji
                fontFamily="nunito"
                borderColor="rgba(0, 0, 0, 0.1)"
                placeholder="Gửi tin nhắn"
                cleanOnEnter
                emojiSize={5}
                value={message.text}
                onChange={(text) => setMessage({ ...message, text })}
                onEnter={handleSendMessage}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "10%",
              }}
            >
              <Button
                style={{ borderRadius: "50%" }}
                onClick={handleSendMessage}
              >
                <i className="fa fa-paper-plane" aria-hidden="true"></i>
              </Button>
            </div>
          </div>
        )}
      </ul>
    </div>
  );
};

export default ChatBox;
