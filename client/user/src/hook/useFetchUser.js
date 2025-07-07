// hooks/useFetchUser.js
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "../api/authApi"; // path đúng theo project bạn
import useUserStore from "../components/store/useUserStore";
import Cookie from "js-cookie";

const fetchUser = async () => {
  const res = await getProfile();
  console.log("fetchUser", res.data.data); // Kiểm tra dữ liệu trả về
  return res.data.data; // hoặc res.data.data tùy theo API
};

export const useFetchUser = () => {
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);

  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUser,

    enabled: !!Cookie.get("access_token"), // Chỉ thực hiện khi có token
    onSuccess: (data) => {
      console.log("User data fetched successfully:", data);
      queryClient.setQueryData(["userProfile"], data); // Cập nhật cache
      setUser(data); // Cập nhật state user trong store
    },
    onError: (error) => {
      console.error("Error fetching user data:", error);
      // Xử lý lỗi nếu cần
    },
  });
};
