import React, { useState, useEffect } from "react";
import {
  TextField,
  IconButton,
  Stack,
  FormControl,
  Button,
  InputAdornment,
  TablePagination,
  createSvgIcon,
} from "@mui/material";
import { Pagination, Modal, Form } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  createProperty,
  getProperties,
  deleteOne,
  editProperty,
} from "../../api/propertiesApi";

function DashboardType() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [removeId, setRemoveId] = useState("");
  const [update, setUpdateId] = useState({
    _id: "",
    name: "",
    description: "",
  });
  const [page, setPage] = useState(0); // Pagination page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  function handleClick() {
    console.log("Clear search");
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  const PlusIcon = createSvgIcon(
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

  const itemRender = (_, type, originalElement) => {
    if (type === "prev") {
      return (
        <Button>
          <ArrowLeftOutlined />
          Trang trước
        </Button>
      );
    }
    if (type === "next") {
      return (
        <Button>
          Trang sau
          <ArrowRightOutlined />
        </Button>
      );
    }
    return originalElement;
  };

  const handleData = (e) => {
    const { name, value } = e.target;
    setUpdateId((prevUpdate) => ({ ...prevUpdate, [name]: value }));
  };

  const updateId = (_id, name, description) => {
    setUpdateId({ _id, name, description });
  };

  const ColorButton2 = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[400]),
    fontSize: "10px",
    backgroundColor: grey[400],
    "&:hover": {
      backgroundColor: grey[700],
    },
  }));

  const AddProperties = async () => {
    try {
      const response = await createProperty(formData);
      console.log(response);
      alert("Thêm thành công");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteOne(removeId);
      console.log(response);
      setData((prevData) => prevData.filter((item) => item._id !== removeId));
      alert("Xóa thành công");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const { _id, name, description } = update;
      const response = await editProperty(_id, { name, description });
      console.log(response);
      alert("Cập nhật thành công");
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getPropertiesData = async () => {
      try {
        const response = await getProperties();
        setData(response.data.data);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    getPropertiesData();
  }, []);

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between container">
        <h5>QUẢN LÝ LOẠI HÌNH</h5>

        <div>
          <ColorButton2 variant="contained">
            Tải xuống tài khoản PDF
          </ColorButton2>
        </div>
      </div>
      <div className="mt-4">
        <FormControl className="search">
          <TextField
            placeholder="Tìm kiếm"
            size="small"
            variant="outlined"
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment
                  position="end"
                  style={{ display: "none" }}
                  onClick={handleClick}
                >
                  <ClearIcon />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        &nbsp;
        <Button variant="outlined" onClick={handleOpen}>
          <PlusIcon fontSize="90" /> Thêm mới loại hình
        </Button>
        &nbsp;
        <Button variant="outlined">Lọc</Button>
      </div>
      <div className="mt-4">
        <table className="table">
          <thead>
            <tr>
              <td>ID</td>
              <td>Tên loại hình</td>
              <td>Thao tác</td>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>{item._id}</td>
                  <td>{item.name}</td>
                  <td>
                    <Stack spacing={2} direction="row">
                      <IconButton
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={() => setRemoveId(item._id)}
                      >
                        <DeleteOutlineOutlinedIcon fontSize="inherit" />
                      </IconButton>

                      <IconButton
                        className="nav-link text-dark col"
                        size="small"
                        aria-label="edit"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal1"
                        onClick={() =>
                          updateId(item._id, item.name, item.description)
                        }
                      >
                        <EditOutlinedIcon fontSize="inherit" />
                      </IconButton>
                    </Stack>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-center">
        {" "}
        <TablePagination
          component="div"
          count={data.length}
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
      <Modal visible={open} onOk={AddProperties} onCancel={handleClose}>
        <h3>Thêm loại hình bất động sản</h3>
        <Form>
          <TextField
            label="Tên loại hình"
            variant="outlined"
            fullWidth
            margin="normal"
            name="name"
            onChange={handleChange}
          />
          <TextField
            label="Mô tả"
            variant="outlined"
            fullWidth
            margin="normal"
            name="description"
            onChange={handleChange}
          />
        </Form>
      </Modal>
      <Modal
        open={open1}
        onOk={handleClose1}
        onCancel={handleClose1}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ variant: "outlined", danger: true }}
      >
        <IconButton variant="outlined" color="error">
          <DeleteOutlineOutlinedIcon />
        </IconButton>
        <br />
        <h5 className="">Xóa loại hình</h5>
        <p>
          Bạn có chắc muốn xóa loại hình này? Loại hình đã xóa không thể khôi
          phục lại.
        </p>
      </Modal>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Xóa loại hình
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">Bạn có chắc muốn xóa vĩnh viễn?</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Xóa sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModal1"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Cập nhật loại hình
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Form>
                <input
                  type="text"
                  placeholder="Tên loại hình"
                  className="form-control"
                  name="name"
                  value={update.name}
                  onChange={handleData}
                />
                <input
                  type="text"
                  placeholder="Mô tả"
                  name="description"
                  className="form-control mt-4"
                  value={update.description}
                  onChange={handleData}
                />
              </Form>
            </div>
            <div className="modal-footer">
              <button type="button" data-bs-dismiss="modal">
                Hủy
              </button>
              <button type="button" onClick={handleUpdate}>
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardType;
