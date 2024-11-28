import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import useQueryParams from "../../hook/useQueryParams";
import instance from "../../api/instanApi";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  FormControl,
  TextField,
  InputAdornment,
  Button,
  TablePagination,
  createSvgIcon,
} from "@mui/material";
import { styled } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Checkbox, Pagination, Modal, Form } from "antd";

import { deepOrange } from "@mui/material/colors";

import {
  getComments,
  deleteComment,
  updateComment,
} from "../../api/commentApi";
import { getAllUserVipDetails } from "../../api/vipApi";

function DashboardComment() {
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0); // Pagination page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  const [open, setOpen] = useState(false);
  const [removeComment, setRemoveComment] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setShowClearIcon(event.target.value ? "flex" : "none");
  };

  const handleClick = () => {
    setSearchTerm("");
    setShowClearIcon("none");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  const [showClearIcon, setShowClearIcon] = useState("none");

  const PlusIcon = createSvgIcon(
    // credit: plus icon from https://heroicons.com/
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>,
    "Plus"
  );

  const { search } = "search";

  useEffect(() => {
    getComments().then((res) => {
      setComments(res.data.data);
    });
    getAllUserVipDetails().then((res) => {
      setUsers(res.data.data);
    });
  }, []);

  const query = useQueryParams();

  const { data, isLoading } = useQuery({
    queryKey: ["photo-news", query],
    queryFn: async () => await instance.get(`/photo-news`),
  });

  const post = data?.data?.data?.items;

  console.log(removeComment);

  const handleDelete = async (id) => {
    await deleteComment(id);
    getComments().then((res) => {
      setComments(res.data.data);
    });
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between ">
        <div>
          <h5>DANH SÁCH BÌNH LUẬN TIN ĐĂNG</h5>
        </div>
        {/* <div>
          <Button type="primary">
            <PlusIcon fontSize="90" /> Thêm mới bài đăng
          </Button>
        </div> */}
      </div>
      <div className="mt-4">
        <FormControl className={search}>
          <TextField
            placeholder="Tìm kiếm"
            size="small"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment
                  position="end"
                  style={{ display: showClearIcon }}
                  onClick={handleClick}
                >
                  <ClearIcon />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </div>
      <div className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox>Khách hàng</Checkbox>
              </TableCell>

              <TableCell>Tiêu đề</TableCell>
              <TableCell>Nội dung</TableCell>

              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comments && comments.length > 0 ? (
              comments.map((comment) =>
                post?.find((post) => post._id === comment.post_id) ? (
                  <TableRow key={comment._id}>
                    <TableCell>
                      {
                        users.find((user) => user.user._id === comment.user_id)
                          ?.user.full_name
                      }
                    </TableCell>
                    <TableCell
                      sx={{
                        color: deepOrange[500],

                        width: "300px",
                      }}
                    >
                      <a
                        href={`http://localhost:5173/post/${comment.post_id}`}
                        className="nav-link"
                      >
                        {post?.find((post) => post._id === comment.post_id)
                          ? post?.find((post) => post._id === comment.post_id)
                              ?.title
                          : "Tin đã bị xóa"}
                      </a>
                    </TableCell>
                    <TableCell>{comment.content}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          handleOpen(), setRemoveComment(comment._id);
                        }}
                      >
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ) : null
              )
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="d-flex justify-content-center">
        <TablePagination
          component="div"
          count={comments.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count}`
          }
        />
      </div>
      <Modal
        title="Xác nhận"
        visible={open}
        onOk={() => handleDelete(removeComment)}
        onCancel={handleClose}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa bình luận này?</p>
      </Modal>
    </div>
  );
}

export default DashboardComment;
