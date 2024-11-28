import React, { useState } from "react";
import { Checkbox, Tag, Modal } from "antd";
import { Stack, Button } from "@mui/material";

import { useRecipientReport } from "../../hook/useRecipientReport";

function UserTable({ filteredItem }) {
  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => {
    setOpen1(true);
  };
  const handleClose1 = () => {
    setOpen1(false);
  };

  const onchange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  console.log(filteredItem);
  return (
    <tbody>
      {filteredItem.map((user) => (
        <tr key={user._id}>
          <td>
            <Checkbox onChange={onchange}>{user.full_name}</Checkbox>
          </td>
          <td>{user.email}</td>
          <td>{user.phone}</td>
          <td>
            {user.verify === "verified" ? (
              <Tag color="green">Đã kích hoạt</Tag>
            ) : user.verify === "unverified" ? (
              <Tag color="red">Chưa kích hoạt</Tag>
            ) : (
              <Tag color="blue">Đã khóa</Tag>
            )}
          </td>
          <td>
            <Stack alignItems="center" spacing={1}>
              <Button
                className="nav-link text-danger col"
                onClick={handleOpen1}
                aria-label="edit"
                variant="outlined"
                color="danger"
              >
                <i class="fa fa-user-times" aria-hidden="true"></i>
              </Button>
            </Stack>
          </td>
        </tr>
      ))}{" "}
      <Modal
        title="Khóa tài khoản"
        open={open1}
        onOk={handleClose1}
        onCancel={handleClose1}
        okText="Khóa"
        cancelText="Hủy"
        okButtonProps={{ color: "error" }}
      >
        <div>
          <h5>Bạn có chắc chắn muốn khóa tài khoản này?</h5>
          <p className="text-muted">
            Khi bạn khóa tài khoản, người dùng sẽ vĩnh viễn không thể đăng tin
            mới
          </p>
        </div>
      </Modal>
      ;
    </tbody>
  );
}

export default UserTable;
