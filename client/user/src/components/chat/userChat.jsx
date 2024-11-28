import React, { useEffect, useState } from "react";
import { useFetchRecipientUser } from "../../hook/useRecipientUser";
import { timeSince } from "../../utils/Funtion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "../../api/instanApi";

const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const idChat = chat?._id ? chat._id : "6567809f6646459b214bebdd";
  const [message, setMessage] = useState({
    text: "",
    senderId: user,
    chatId: idChat,
  });

  const { data: data1, isLoading } = useQuery({
    queryKey: ["messages", idChat], // include 'id' in queryKey to refetch on change
    queryFn: () => instance.get(`/messages/${idChat}`),
    enabled: !!idChat, // ensures query only runs if 'id' has a valid value
  });

  const messages = data1?.data?.data || [];

  console.log(messages);

  return (
    <div>
      {recipientUser && (
        <div
          style={{
            border: "1px solid #f0f0f0",
            padding: "5px",
            borderRadius: "10px",
            marginBottom: "5px",
            cursor: "pointer",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
          className="card"
        >
          <div className="card-body">
            <ul className="list-unstyled mb-0">
              <li className="p-2 border-bottom bg-body-tertiary">
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-row">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp"
                      alt="avatar"
                      className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                      width="60"
                    />
                    <div className="pt-1">
                      <p className="fw-bold mb-0">{recipientUser.full_name}</p>
                      <p
                        className="small text-muted"
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          paddingTop: "5px",
                        }}
                      >
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            maxWidth: "130px",
                          }}
                        >
                          {" "}
                          {messages[messages.length - 1]?.senderId === user
                            ? "Bạn: "
                            : null}
                          {messages[messages.length - 1]?.text}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <p className="small text-muted mb-1">
                      {timeSince(messages[messages.length - 1]?.created_at)}
                    </p>
                    <span className="badge bg-danger float-end">1</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserChat;
