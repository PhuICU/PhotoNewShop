import { useEffect, useState } from "react";

import { getUserById } from "../api/authApi";

export const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);

  const recipientId = chat?.member?.find((m) => m !== user);

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return null;
      const response = await getUserById(recipientId);
      if (response.error) {
        console.error(response.error);
      }
      setRecipientUser(response.data.data);
    };

    getUser();
  }, [recipientId]);

  return { recipientUser };
};
