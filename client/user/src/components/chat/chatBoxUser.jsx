import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Typography } from "@mui/material";
import { notification } from "antd";
import instance from "../../api/instanApi";

const ChatBoxUser = ({ user, info }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [message, setMessage] = useState({ text: "" });
  const messageEndRef = useRef(null); // Reference for the end of messages
  const queryClient = useQueryClient();

  if (!user) {
    user = "662e8d568054cc733b6ca0b2";
  }

  const createChatMutation = useMutation({
    mutationFn: (data) =>
      instance.post(`/chat/create`, {
        member: [data.firstId, data.secondId],
      }),
    onError: (error) => {
      console.error(
        "Error creating chat:",
        error.response?.data?.message || error.message
      );
    },
  });

  const createChat = async () => {
    if (chat && chat._id) return;
    createChatMutation.mutate(
      { firstId, secondId },
      {
        onSuccess: (data) => {
          console.log("Chat created:", data);
          queryClient.invalidateQueries(["chats"]);
        },
      }
    );
  };

  const [firstId, secondId] = [
    user ? user : "662e8d568054cc733b6ca0b2",
    info?.posted_by,
  ];
  console.log(firstId, secondId);
  const { data: chatData } = useQuery({
    queryKey: ["chats"],
    queryFn: () => instance.get(`/chat/all/${firstId}/${secondId}`),
  });
  const chat = chatData?.data?.data || {};

  const messageMutation = useMutation({
    mutationFn: (data) =>
      instance.post(`/messages/create`, {
        text: data.text,
        senderId: user,
        chatId: chat._id,
      }),
  });

  const handleSendMessage = (event) => {
    event.preventDefault();
    messageMutation.mutate(message, {
      onSuccess: () => {
        queryClient.invalidateQueries(["messages"]);
        setMessage({ ...message, text: "" });
      },
    });
  };

  const [idChat, setIdChat] = useState("654ba93cba62368b56847d72");
  console.log(idChat);
  const { data: data1, isLoading } = useQuery({
    queryKey: ["messages", idChat],
    queryFn: () => instance.get(`http://localhost:5010/messages/${idChat}`),
    enabled: !!idChat,
  });
  const dataMessage = data1?.data?.data || [];

  // Function to toggle chat box
  const toggleChat = () => {
    if (user) {
      setIsCollapsed(!isCollapsed);
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [dataMessage]);
  console.log(user);
  const error = () => {
    if (!user) {
      notification["error"]({
        message: "Thông báo",
        description: "Bạn cần đăng nhập để thực hiện chức năng này",
        duration: 2,
      });
    }
  };

  return (
    <div
      style={{
        height: "400px",

        width: "290px",
        overflowX: "hidden",
      }}
    >
      {chat && chat._id ? (
        <button
          className="btn btn-info btn-block"
          onClick={() => {
            error();
            toggleChat();
            setIdChat(chat._id);
          }}
          aria-expanded={isCollapsed}
          aria-controls="collapseExample"
          style={{ width: "270px" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <span>Nhắn tin</span>
            <i className={`fa fa-chevron-${isCollapsed ? "up" : "down"}`}></i>
          </div>
        </button>
      ) : (
        <button
          className="btn btn-info btn-block"
          onClick={() => {
            error();
            createChat();
            setIdChat(chat._id);
          }}
          aria-expanded={isCollapsed}
          aria-controls="collapseExample"
          style={{ width: "270px" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <span>Nhắn tin</span>
            <i className={`fa fa-chevron-${isCollapsed ? "up" : "down"}`}></i>
          </div>
        </button>
      )}
      {isCollapsed && (
        <div className="collapse mt-3 show" id="collapseExample">
          <div className="card" id="chat4">
            <div className="card-body">
              {isLoading && idChat ? (
                <div
                  style={{
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
              ) : (
                <div>
                  <div>
                    {dataMessage.length > 0 ? (
                      dataMessage.map((item, index) => (
                        <div key={index}>
                          {item.senderId === user ? (
                            <div className="d-flex justify-content-end">
                              <span
                                className="small p-2 ms-3 mb-1 rounded-3"
                                style={{
                                  borderRadius: "10px",
                                  backgroundColor: "#f0f0f0",
                                  width: "100px",
                                }}
                              >
                                {item.text}
                              </span>
                            </div>
                          ) : (
                            <div className="d-flex justify-content-start">
                              <img
                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                alt="avatar"
                                className="rounded-circle"
                                style={{ width: "20px", height: "20px" }}
                              />
                              <span
                                className="small p-2 ms-3 mb-1 rounded-3"
                                style={{
                                  borderRadius: "10px",
                                  backgroundColor: "#f0f0f0",
                                  width: "90px",
                                }}
                              >
                                {item.text}
                              </span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div>
                        <p>Hãy nhắn cho họ những tin đầu tiên</p>
                      </div>
                    )}
                    <Typography
                      variant="caption"
                      gutterBottom
                      sx={{ display: "block" }}
                      className="text-center text-muted"
                    >
                      {dataMessage.length > 0
                        ? moment(
                            dataMessage[dataMessage.length - 1]?.created_at
                          ).format("DD/MM/YYYY")
                        : null}
                    </Typography>
                    <div ref={messageEndRef} />{" "}
                    {/* Empty div to track end of messages */}
                  </div>
                </div>
              )}
            </div>
            <div className="d-flex justify-content-around">
              <div style={{ width: "76%" }}>
                <InputEmoji
                  fontFamily="nunito"
                  borderColor="rgba(0, 0, 0, 0.1)"
                  placeholder="Gửi tin nhắn"
                  cleanOnEnter
                  emojiSize={5}
                  value={message.text}
                  onChange={(text) => setMessage({ ...message, text: text })}
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
                  size="small"
                  onClick={handleSendMessage}
                >
                  <i className="fa fa-paper-plane" aria-hidden="true"></i>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBoxUser;
