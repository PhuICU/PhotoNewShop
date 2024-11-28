import React, { useState, useEffect } from "react";
import {
  TextField,
  IconButton,
  Stack,
  FormControl,
  Button,
  InputAdornment,
  createSvgIcon,
  Radio,
  RadioGroup,
  FormControlLabel,
  TablePagination,
  FormLabel,
} from "@mui/material";
import { Pagination, Modal, Form } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { grey } from "@mui/material/colors";
import { duration, styled } from "@mui/material/styles";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  createVip,
  getActiveVipPackages,
  deleteVipById,
  updateVip,
} from "../../api/vipApi";

function DashboardVip() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    packageName: "",
    price: 0,
    duration: "",
    features: [],
    description: "",
    discount: {
      discountPercentage: 0,
      discountAmount: 0,
      conditions: "",
      startDate: "",
      endDate: "",
    },
    currency: "VND",
    priviLeges: {
      postingLimit: {
        totalPost: 0,
        durationPerPost: 0,
      },
      commentPrivileges: {
        canComment: false,
        commentLimit: 0,
      },
      trendingPrivileges: {
        canTrend: false,
        trendingLimit: 0,
      },
    },
    specialBenefits: [],
  });

  const [removeId, setRemoveId] = useState("");
  const [update, setUpdateId] = useState({
    packageName: "",
    price: 0,
    duration: "",
    features: [],
    description: "",
    discount: {
      discountPercentage: 0,
      discountAmount: 0,
      conditions: "",
      startDate: "",
      endDate: "",
    },
    currency: "VND",
    priviLeges: {
      postingLimit: {
        totalPost: 0,
        durationPerPost: 0,
      },
      commentPrivileges: {
        canComment: false,
        commentLimit: 0,
      },
      trendingPrivileges: {
        canTrend: false,
        trendingLimit: 0,
      },
    },
    specialBenefits: [],
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

  const handleChangeUpdateData = (e) => {
    const { name, value } = e.target;
    setUpdateId((prevUpdate) => ({ ...prevUpdate, [name]: value }));
  };

  const handleChangeUpdateDiscountData = (e) => {
    const { name, value } = e.target;
    setUpdateId((prevUpdate) => ({
      ...prevUpdate,
      discount: { ...prevUpdate.discount, [name]: value },
    }));
  };

  const handleChangeUpdateFeatureData = (e) => {
    const value = e.target.value.split(",");
    setUpdateId((prevUpdate) => ({ ...prevUpdate, features: value }));
  };

  const handleChangeUpdatePostData = (e) => {
    const { name, value } = e.target;
    setUpdateId((prevUpdate) => ({
      ...prevUpdate,
      priviLeges: {
        ...prevUpdate.priviLeges,
        postingLimit: {
          ...prevUpdate.priviLeges.postingLimit,
          [name]: value,
        },
      },
    }));
  };

  const handleChangeUpdateCommentData = (e) => {
    const { name, value } = e.target;
    setUpdateId((prevUpdate) => ({
      ...prevUpdate,
      priviLeges: {
        ...prevUpdate.priviLeges,
        commentPrivileges: {
          ...prevUpdate.priviLeges.commentPrivileges,
          [name]: value,
        },
      },
    }));
  };

  const handleChangeUpdateTrendData = (e) => {
    const { name, value } = e.target;
    setUpdateId((prevUpdate) => ({
      ...prevUpdate,
      priviLeges: {
        ...prevUpdate.priviLeges,
        trendingPrivileges: {
          ...prevUpdate.priviLeges.trendingPrivileges,
          [name]: value,
        },
      },
    }));
  };

  const updateId = (item) => {
    setUpdateId(item);
  };

  const ColorButton2 = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[400]),
    fontSize: "10px",
    backgroundColor: grey[400],
    "&:hover": {
      backgroundColor: grey[700],
    },
  }));

  const AddVip = async () => {
    try {
      const response = await createVip(formData);
      console.log(response);
      alert("Thêm thành công");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteVipById(removeId);
      console.log(response);
      setData((prevData) => prevData.filter((item) => item._id !== removeId));
      alert("Xóa thành công");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const {
        packageName,
        price,
        duration,
        features,
        description,
        discount,
        currency,
        priviLeges,
      } = update;
      const response = await updateVip(update._id, {
        packageName,
        price,
        duration,
        features,
        description,
        discount,
        currency,
        priviLeges,
        specialBenefits: priviLeges,
      });
      console.log(response);
      alert("Cập nhật thành công");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchActiveVipPackages = async () => {
      try {
        const response = await getActiveVipPackages();
        setData(response.data.data);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchActiveVipPackages();
  }, []);

  const handlePostLimit = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      priviLeges: {
        ...prevData.priviLeges,
        postingLimit: { ...prevData.priviLeges.postingLimit, [name]: value },
      },
    }));
  };

  const handleCommentPrivileges = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      priviLeges: {
        ...prevData.priviLeges,
        commentPrivileges: {
          ...prevData.priviLeges.commentPrivileges,
          [name]: value,
        },
      },
    }));
  };

  const handleTrendingPrivileges = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      priviLeges: {
        ...prevData.priviLeges,
        trendingPrivileges: {
          ...prevData.priviLeges.trendingPrivileges,
          [name]: value,
        },
      },
    }));
  };

  const handleFeatureChange = (e) => {
    const value = e.target.value.split(",");
    setFormData((prevData) => ({ ...prevData, features: value }));
  };

  const handleDiscountChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      discount: { ...prevData.discount, [name]: value },
    }));
  };

  console.log(formData);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  formData.discount.discountAmount =
    formData.price * (formData.discount.discountPercentage / 100);

  update.discount.discountAmount =
    update.price * (update.discount.discountPercentage / 100);

  const durationArr = [
    { value: "1 week", label: "1 tuần" },
    { value: "1 month", label: "1 tháng" },
    { value: "1 year", label: "1 năm" },
  ];
  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between container">
        <h5>QUẢN LÝ GÓI VIP</h5>

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
          <PlusIcon fontSize="90" /> Thêm mới gói vip
        </Button>
        &nbsp;
        {/* <Button variant="outlined">Lọc</Button> */}
      </div>
      <div className="mt-4">
        <table className="table">
          <thead>
            <tr>
              <td>Tên gói vip</td>
              <td>Thời lượng</td>
              <td>Giá</td>
              <td>Giảm giá</td>
              <td>Mô tả</td>

              <td>Thao tác</td>
            </tr>
          </thead>
          {console.log(data)}
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>{item.packageName}</td>
                  <td>
                    {
                      durationArr?.find(
                        (duration) => duration.value === item.duration
                      )?.label
                    }
                  </td>

                  <td>
                    {formatPrice(item.price)} {item.currency}
                    <br />
                    <span className="text-muted">
                      (Giảm còn:{" "}
                      {formatPrice(
                        item.price -
                          item.price * (item.discount.discountPercentage / 100)
                      )}{" "}
                      {item.currency})
                    </span>
                  </td>
                  <td>
                    {item.discount.discountPercentage > 0
                      ? item.discount.discountPercentage
                      : 0}
                    %
                  </td>
                  <td
                    style={{
                      //ngang 300px 2 dòng 3 chấm
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      width: "200px",

                      height: "82px",
                    }}
                  >
                    {item.description}
                  </td>
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
                        onClick={() => updateId(item)}
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
      <Modal visible={open} onOk={AddVip} onCancel={handleClose} width={690}>
        <Form>
          <div>
            <h3>Thông tin gói vip</h3>
            <div>
              <p className="mt-4 fs-6">Tên gói vip</p>{" "}
              <Form.Item>
                <TextField
                  label="Tên gói vip"
                  variant="outlined"
                  fullWidth
                  name="packageName"
                  size="small"
                  onChange={handleChange}
                />
              </Form.Item>
            </div>
            <div>
              <p className="mt-4 fs-6">Mô tả</p>{" "}
              <Form.Item>
                <TextField
                  label="Mô tả"
                  variant="outlined"
                  fullWidth
                  name="description"
                  size="small"
                  onChange={handleChange}
                />{" "}
              </Form.Item>
            </div>
            <div className="row">
              <div className="col-9">
                {" "}
                <p className=" fs-6">Giá</p>
                <Form.Item>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    label="Giá gói"
                    variant="outlined"
                    name="price"
                    sx={{ width: 420 }}
                    onChange={handleChange}
                  />
                </Form.Item>
              </div>
              <div className="col-3">
                <p className=" fs-6">Đơn vị</p>
                <Form.Item>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name="currency"
                    onClick={handleChange}
                  >
                    <option value="VND">VND</option>
                    <option value="USD">USD</option>
                  </select>
                </Form.Item>
              </div>
              <div className="mt-4">
                <p>
                  Giá tổng:
                  <span>
                    {" "}
                    {formatPrice(formData.price)} {formData.currency}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <p className=" fs-6">Thời lượng</p>{" "}
              <Form.Item>
                <TextField
                  label="Thời gian"
                  variant="outlined"
                  fullWidth
                  name="duration"
                  size="small"
                  onChange={handleChange}
                />
              </Form.Item>
            </div>
          </div>

          <hr />
          <div>
            <h3>Quyền bình luận</h3>
            <div>
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">
                  Được phép bình luận (Bấm chọn)
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="false"
                  name="canComment"
                  onClick={handleCommentPrivileges}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Có"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="Không"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <div>
              <p className="mt-4 fs-6">Số lượt bình luận</p>
              <Form.Item>
                <TextField
                  size="small"
                  id="outlined-basic"
                  label="Số lượt bình luận"
                  variant="outlined"
                  fullWidth
                  name="commentLimit"
                  onChange={handleCommentPrivileges}
                />
              </Form.Item>
            </div>
          </div>
          <hr />
          <div>
            <h3>Quyền đăng bài</h3>
            <div className="mt-4">
              <p className="mt-4 fs-6">Số lượt đăng bài</p>
              <Form.Item>
                <TextField
                  size="small"
                  id="outlined-basic"
                  label="Số lượt đăng bài"
                  variant="outlined"
                  name="totalPost"
                  fullWidth
                  onChange={handlePostLimit}
                />
              </Form.Item>
            </div>
            <div className="mt-4">
              <p className="mt-4 fs-6">Thời gian đăng bài</p>
              <Form.Item>
                <TextField
                  size="small"
                  id="outlined-basic"
                  label="Thời gian đăng bài"
                  variant="outlined"
                  fullWidth
                  name="durationPerPost"
                  onChange={handlePostLimit}
                />
              </Form.Item>
            </div>
          </div>
          <hr />
          <div>
            <h3>Quyền trending</h3>
            <div>
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">
                  Được phép trending (Bấm chọn)
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="false"
                  name="canTrend"
                  onClick={handleTrendingPrivileges}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Có"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="Không"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <div>
              <p className="mt-4 fs-6">Số lượt trending</p>
              <Form.Item>
                <TextField
                  size="small"
                  id="outlined-basic"
                  label="Số lượt trending"
                  variant="outlined"
                  fullWidth
                  name="trendingLimit"
                  onChange={handleTrendingPrivileges}
                />
              </Form.Item>
            </div>
          </div>
          <hr />
          <div>
            <h3>Ưu đãi đặc biệt</h3>
            <div>
              <p className="mt-4 fs-6">Phần trăm giảm giá</p>
              <Form.Item>
                <TextField
                  size="small"
                  id="outlined-basic"
                  label="Phần trăm giảm giá: %"
                  variant="outlined"
                  fullWidth
                  name="discountPercentage"
                  onChange={handleDiscountChange}
                />
              </Form.Item>
            </div>
            <div className="d-flex justify-content-between container">
              <p className="mt-4 fs-6">
                Số tiền giảm giá:
                <span>
                  {" "}
                  {formatPrice(formData.discount.discountAmount)}{" "}
                  {formData.currency}
                </span>
              </p>
              <p className="mt-4 fs-6">
                Giảm {formData.discount.discountPercentage}% giá gói vip
              </p>
            </div>
            <div>
              <p className="mt-4 fs-6">Ngày bắt đầu</p>
              <Form.Item>
                <TextField
                  size="small"
                  id="outlined-basic"
                  label="Ngày bắt đầu"
                  variant="outlined"
                  fullWidth
                  name="startDate"
                  onChange={handleDiscountChange}
                />
              </Form.Item>

              <p className="mt-4 fs-6">Ngày kết thúc</p>
              <Form.Item>
                <TextField
                  size="small"
                  id="outlined-basic"
                  label="Ngày kết thúc"
                  variant="outlined"
                  fullWidth
                  name="endDate"
                  onChange={handleDiscountChange}
                />
              </Form.Item>
            </div>
          </div>
          <hr />
          <div>
            <h3>Tính năng của gói</h3>
            <div>
              <p className="mt-4 fs-6">Tính năng</p>
              <Form.Item>
                <TextField
                  size="small"
                  id="outlined-basic"
                  label="Tính năng"
                  variant="outlined"
                  fullWidth
                  name="features"
                  onChange={handleFeatureChange}
                />
              </Form.Item>
            </div>
          </div>
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
        <h5 className="">Xóa gói vip</h5>
        <p>
          Bạn có chắc muốn xóa gói này? Gói vip đã xóa không thể khôi phục lại.
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
                Xóa gói vip
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
                Xóa
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
                Cập nhật gói vip
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
                <div>
                  <p className="mt-4 fs-6">Tên gói vip</p>{" "}
                  <Form.Item>
                    <TextField
                      label="Tên gói vip"
                      variant="outlined"
                      fullWidth
                      name="packageName"
                      size="small"
                      value={update.packageName}
                      onChange={handleChangeUpdateData}
                    />
                  </Form.Item>
                </div>
                <div>
                  <p className="mt-4 fs-6">Mô tả</p>{" "}
                  <Form.Item>
                    <TextField
                      label="Mô tả"
                      variant="outlined"
                      fullWidth
                      name="description"
                      size="small"
                      value={update.description}
                      onChange={handleChangeUpdateData}
                    />{" "}
                  </Form.Item>
                </div>

                <div>
                  <div className="row">
                    <div className="col-9">
                      {" "}
                      <p className=" fs-6">Giá</p>
                      <Form.Item>
                        <TextField
                          size="small"
                          id="outlined-basic"
                          label="Giá gói"
                          variant="outlined"
                          name="price"
                          sx={{ width: 320 }}
                          value={update.price}
                          onChange={handleChangeUpdateData}
                        />
                      </Form.Item>
                    </div>
                    <div className="col-3">
                      <p className=" fs-6">Đơn vị</p>
                      <Form.Item>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          name="currency"
                          onClick={handleChangeUpdateData}
                        >
                          <option value="VND">VND</option>
                          <option value="USD">USD</option>
                        </select>
                      </Form.Item>
                    </div>{" "}
                    <div>
                      <p className=" fs-6">Giảm giá</p>
                      <Form.Item>
                        <TextField
                          size="small"
                          id="outlined-basic"
                          label="Giảm giá: %"
                          variant="outlined"
                          fullWidth
                          name="discountPercentage"
                          value={update.discount.discountPercentage}
                          onChange={handleChangeUpdateDiscountData}
                        />
                      </Form.Item>
                    </div>
                    <div className="mt-4">
                      <p>
                        Giá tổng:
                        <span>
                          {" "}
                          {formatPrice(
                            update.price -
                              update.price *
                                (update.discount.discountPercentage / 100)
                          )}{" "}
                          {update.currency}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <hr />
                <div>
                  <p className=" fs-6">Thời lượng</p>{" "}
                  <Form.Item>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      name="duration"
                      onClick={handleChangeUpdateData}
                    >
                      <option value={update.duration}>
                        {
                          durationArr?.find(
                            (item) => item.value === update.duration
                          )?.label
                        }
                      </option>
                      <option value="1 week">1 tuần</option>
                      <option value="1 month">1 tháng</option>
                      <option value="1 year">1 năm</option>
                    </select>
                  </Form.Item>
                </div>

                <div>
                  <p className=" fs-6">Tính năng</p>{" "}
                  <Form.Item>
                    <TextField
                      label="Tính năng"
                      variant="outlined"
                      fullWidth
                      name="features"
                      size="small"
                      value={update.features}
                      onChange={handleChangeUpdateFeatureData}
                    />
                  </Form.Item>
                </div>
                <div>
                  <div>
                    <h3>Quyền bình luận</h3>
                    <div>
                      <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">
                          Được phép bình luận (Bấm chọn)
                        </FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue="false"
                          name="canComment"
                          value={update.priviLeges.commentPrivileges.canComment}
                          onClick={handleChangeUpdateCommentData}
                        >
                          <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label="Có"
                          />
                          <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label="Không"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                    <div>
                      <p className="mt-4 fs-6">Số lượt bình luận</p>
                      <Form.Item>
                        <TextField
                          size="small"
                          id="outlined-basic"
                          label="Số lượt bình luận"
                          variant="outlined"
                          fullWidth
                          name="commentLimit"
                          value={
                            update.priviLeges.commentPrivileges.commentLimit
                          }
                          onChange={handleChangeUpdateCommentData}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <hr />
                  <div>
                    <h3>Quyền đăng bài</h3>
                    <div className="mt-4">
                      <p className="mt-4 fs-6">Số lượt đăng bài</p>
                      <Form.Item>
                        <TextField
                          size="small"
                          id="outlined-basic"
                          label="Số lượt đăng bài"
                          variant="outlined"
                          name="totalPost"
                          fullWidth
                          value={update.priviLeges.postingLimit.totalPost}
                          onChange={handleChangeUpdatePostData}
                        />
                      </Form.Item>
                    </div>
                    <div className="mt-4">
                      <p className="mt-4 fs-6">Thời gian đăng bài</p>
                      <Form.Item>
                        <TextField
                          size="small"
                          id="outlined-basic"
                          label="Thời gian đăng bài"
                          variant="outlined"
                          fullWidth
                          name="durationPerPost"
                          value={update.priviLeges.postingLimit.durationPerPost}
                          onChange={handleChangeUpdatePostData}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <hr />
                  <div>
                    <h3>Quyền trending</h3>
                    <div>
                      <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">
                          Được phép trending (Bấm chọn)
                        </FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue="false"
                          name="canTrend"
                          value={update.priviLeges.trendingPrivileges.canTrend}
                          onClick={handleChangeUpdateTrendData}
                        >
                          <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label="Có"
                          />
                          <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label="Không"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                    <div>
                      <p className="mt-4 fs-6">Số lượt trending</p>
                      <Form.Item>
                        <TextField
                          size="small"
                          id="outlined-basic"
                          label="Số lượt trending"
                          variant="outlined"
                          fullWidth
                          name="trendingLimit"
                          value={
                            update.priviLeges.trendingPrivileges.trendingLimit
                          }
                          onChange={handleChangeUpdateTrendData}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
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

export default DashboardVip;
