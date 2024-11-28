import { useState, useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Pagination, Switch, Modal, Form, Input, Card } from "antd";
import {
  FormControl,
  InputAdornment,
  Button,
  Stack,
  IconButton,
  createSvgIcon,
  TextField,
  Typography,
} from "@mui/material";

import { styled } from "@mui/material/styles";

import { green, grey, red } from "@mui/material/colors";

import { InsertRowRightOutlined } from "@ant-design/icons";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  createNews,
  getNews,
  deleteNewsById,
  updateNewsById,
} from "../../api/newApi";
// import { uploadCloudinaryMultipleImages } from "../../utils/NewApi";
import { useForm } from "react-hook-form";
import instance from "../../api/instanApi";
import { useMutation } from "@tanstack/react-query";
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  content: z
    .array(
      z.object({
        sub_title: z.string().min(2, {
          message: "Sub Title must be at least 2 characters.",
        }),
        sub_content: z.string().min(10, {
          message: "Sub Content must be at least 10 characters.",
        }),
        images: z.array(z.instanceof(File)).optional(),
      })
    )
    .default([]),
});
function DashboardPost() {
  const [newsData, setNewsData] = useState({
    title: "",
    description: "",
    content: [],
  });

  const [editNew, setEditNew] = useState({
    title: "",
    description: "",
    content: [
      {
        sub_title: "",
        sub_content: "",
        images: [],
      },
    ],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showClearIcon, setShowClearIcon] = useState(false);

  const [news, setNews] = useState([]);
  const [removeId, setRemoveId] = useState("");
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: newsData,
  });
  console.log("Form add news errors: ", form.formState.errors);
  const addContentSection = () => {
    setNewsData({
      ...newsData,
      content: [
        ...newsData.content,
        { sub_title: "", sub_content: "", images: [] },
      ],
    });
  };
  const handleImageUpload = (sectionIndex, files) => {
    if (files && files.length > 0) {
      const updatedContent = [...newsData.content];
      updatedContent[sectionIndex].images = Array.from(files);

      setNewsData({
        ...newsData,
        content: updatedContent,
      });

      form.setValue(
        `content.${sectionIndex}.images`,
        updatedContent[sectionIndex].images
      );
    }
  };
  const uploadMulltipleImagesMutation = useMutation({
    mutationFn: async (formData) =>
      await instance.post("/upload/multiple-images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
  });
  const onSubmit = async (values) => {
    console.log("Submitting news:", values);
    try {
      for (const section of values.content) {
        if (section.images) {
          const formData = new FormData();
          section.images.forEach((image) => {
            formData.append("images", image);
          });
          // Replace with your actual API endpoint
          const response = await uploadMulltipleImagesMutation.mutateAsync(
            formData
          );
          section.images = response.data.data; // Update with uploaded image data
        }
      }
      // Now 'values' contains the full news data with image URLs from your backend
      await instance.post("/news/create", values);
      window.alert("News created successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading images:", error);
      // Handle errors appropriately (e.g., display error messages to the user)
    }
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setShowClearIcon(event.target.value ? "flex" : "none");
  };

  const handleClick = () => {
    setSearchTerm("");
    setShowClearIcon("none");
  };

  const filteredItems = news?.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    );
  });

  const { search } = "search";

  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
  };

  const VisuallyHiddenInput = (props) => {
    return (
      <input
        type="file"
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
        }}
        {...props}
      />
    );
  };

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

  const ColorButton1 = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(green[900]),
    fontSize: "10px",

    backgroundColor: green[900],
    "&:hover": {
      backgroundColor: green[700],
    },
  }));

  const ColorButton2 = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[400]),
    fontSize: "10px",
    backgroundColor: grey[400],
    "&:hover": {
      backgroundColor: grey[700],
    },
  }));

  const ColorButton3 = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(red[900]),
    fontSize: "10px",
    backgroundColor: red[900],
    "&:hover": {
      backgroundColor: red[700],
    },
  }));

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddNew((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setEditNew((prevUpdate) => ({ ...prevUpdate, [name]: value }));
  };

  const handleEditNew = async () => {
    try {
      const form = new FormData();
      files.forEach((file) => {
        form.append("images", file);
      });

      const image = await uploadCloudinaryMultipleImages(form);
      console.log("Image: ", image);

      const response = await updateNewsById(editNew._id, {
        title: editNew.title,
        description: editNew.description,
        content: editNew.content.map((item, index) => ({
          sub_title: item.sub_title,
          sub_content: item.sub_content,
          images: index === 0 ? image : item.images,
        })),
      });
      alert("Cập nhật bài viết thành công");
      window.location.reload();
      console.log(response);
    } catch (error) {
      console.error("Error updating news:", error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value, files: fileList } = e.target;

    if (fileList) {
      const newFiles = Array.from(fileList);
      setFiles(newFiles);

      const imagePreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImage(imagePreviews);
      setEditNew((prevState) => ({
        ...prevState,
        content: prevState.content.map((item, index) => ({
          ...item,
          images: index === 0 ? imagePreviews : item.images,
        })),
      }));
    } else {
      setEditNew((prevState) => ({
        ...prevState,
        content: prevState.content.map((item, index) => ({
          ...item,
          [name]: value,
        })),
      })); // chỉ thay đổi giá trị của sub_title và sub_content
    }
  };

  const removeNews = async () => {
    try {
      const response = await deleteNewsById(removeId);
      console.log("Remove news: ", response);
      alert("Xóa bài viết thành công");
    } catch (error) {
      console.error("Error removing news: ", error);
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getNews();
        setNews(response.data.data);
        console.log("News: ", response);
      } catch (error) {
        console.error("Error fetching news: ", error);
      }
    };

    fetchNews();
  }, []);

  // const handleContentChange = (e) => {
  //   const { name, value } = e.target;
  //   setAddNews((prev) => ({/-strong/-heart:>:o:-((:-h//     ...prev,
  //     content: {
  //       ...prev.content,
  //       [name]: value,
  //     },
  //   }));
  // };

  // const handleImageChange = (e) => {
  //   const file = Array.from(e.target.files);
  //   setFiles(file);
  //   console.log(file);
  //   const image = files.map((file) => URL.createObjectURL(file));
  //   setImage(image);
  //   console.log(image);

  //   setAddNews((prev) => ({
  //     ...prev,
  //     content: {
  //       ...prev.content,
  //       images: image,
  //     },
  //   }));

  //   setFiles((prevState) => [...prevState, ...files]);
  // };

  // const handleAddNews = async () => {
  //   try {
  //     const form = new FormData();
  //     files.forEach((file) => {
  //       form.append("image", file);
  //     });
  //     const image = await uploadCloudinaryMultipleImages(form);
  //     const response = await createNews({
  //       title: addNews.title,
  //       description: addNews.description,
  //       content: {
  //         sub_title: addNews.content.sub_title,
  //         sub_content: addNews.content.sub_content,
  //         images: image,
  //       },
  //     });
  //     console.log(response);
  //   } catch (error) {
  //     console.error("Error creating news:", error);
  //   }
  // };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between ">
        <h5>QUẢN LÝ DANH MỤC BÀI VIẾT</h5>

        <div>
          <ColorButton1 type="primary" onClick={handleOpen1}>
            <PlusIcon fontSize="90" /> Thêm mới bài viết
          </ColorButton1>
          &emsp;
          <ColorButton2 variant="contained">
            Tải xuống tài khoản PDF
          </ColorButton2>
        </div>
      </div>
      <div className="mt-4 d-flex justify-content-between ">
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
        <div>
          <Button variant="outlined">Lọc</Button>
        </div>
      </div>
      <div className="mt-4">
        <table className="table">
          <thead>
            <tr>
              <td>ID bài viết</td>
              <td>Tiêu đề</td>
              <td>Tác giả</td>
              <td>Nội dung bài viết</td>
              <td>Trạng thái</td>
              <td>Thao tác</td>
            </tr>
          </thead>
          {filteredItems && filteredItems.length > 0 ? (
            filteredItems?.map((item) => (
              <tbody key={item._id}>
                <td>
                  <Typography
                    sx={{
                      width: 200,
                    }}
                  >
                    {item._id}
                  </Typography>
                </td>
                <td>
                  <Typography
                    sx={{
                      // 3 dòng
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      width: 200,
                    }}
                  >
                    {item.title}
                  </Typography>
                </td>
                <td>{item.author}</td>
                <td>
                  <Typography
                    sx={{
                      // 3 dòng
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      width: 200,
                    }}
                  >
                    {item.description}
                  </Typography>
                </td>
                <td>
                  <Switch defaultChecked onChange={onChange} />
                </td>
                <td>
                  <Stack spacing={2} direction="row">
                    <IconButton
                      className=" nav-link text-dark col"
                      size="small"
                      aria-label="delete"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => setRemoveId(item._id)}
                      color="error"
                    >
                      <DeleteOutlineOutlinedIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      className="nav-link text-dark col"
                      size="small"
                      aria-label="edit"
                      data-bs-toggle="modal"
                      data-bs-target=".bd-example-modal-lg"
                      onClick={() => setEditNew(item)}
                    >
                      <EditOutlinedIcon fontSize="inherit" />
                    </IconButton>
                  </Stack>
                </td>
              </tbody>
            ))
          ) : (
            <tr>
              <td colSpan={6}>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "center",
                    color: "grey.500",
                  }}
                >
                  Không có bài viết nào
                </Typography>
              </td>
            </tr>
          )}
        </table>
      </div>
      <div className="d-flex justify-content-center"></div>
      <Modal
        visible={open}
        onOk={handleClose}
        onCancel={handleClose}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <div className="row">
          <div className="col-1">
            {" "}
            <IconButton>
              <InsertRowRightOutlined />
            </IconButton>
          </div>
          <div className="col-11">
            {" "}
            <p className="fw-bold">Thêm mới tin tức bất động sản</p>
          </div>
        </div>

        <hr />
        <Form
          name="time_related_controls"
          {...formItemLayout}
          onFinish={onFinish}
          style={{
            maxWidth: 600,
          }}
        >
          <Form.Item label="Tiêu đề">
            <Input placeholder="e.g.Linear"></Input>
          </Form.Item>
          <hr />
          <Form.Item label="Hình ảnh">
            <Card>
              <Button
                component="label"
                role={undefined}
                variant="text"
                tabIndex={-1}
              >
                Bấm để chọn ảnh tải lên
                <VisuallyHiddenInput type="file" />
              </Button>
              or drag and drop
            </Card>
          </Form.Item>
          <hr />
          <Form.Item label="Mô tả">
            <Input placeholder="Nhập mô tả bài viết"></Input>
          </Form.Item>
          <Form.Item label="Mô tả chi tiết">
            <Input placeholder="Nhập mô tả chi tiết"></Input>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={open1}
        onOk={form.handleSubmit(onSubmit)}
        onCancel={handleClose1}
        okText="Xác nhận"
        cancelText="Hủy"
        width={690}
      >
        <h5>Thêm tin tức</h5>
        <hr />
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <p>Tiêu đề </p>

              <Form.Item>
                <TextField
                  id="outlined-basic"
                  size="small"
                  sx={{ width: 640 }}
                  label="Tiêu đề"
                  variant="outlined"
                  name="title"
                  onChange={(e) => {
                    form.setValue("title", e.target.value);
                  }}
                />
              </Form.Item>
              {/* error message */}
              {form.formState.errors.title && (
                <p>{form.formState.errors.title.message}</p>
              )}
            </div>
            <div>
              <p>Mô tả </p>
              <Form.Item>
                <TextField
                  id="outlined-basic"
                  size="small"
                  sx={{ width: 640 }}
                  label="Mô tả"
                  variant="outlined"
                  name="description"
                  onChange={(e) => {
                    form.setValue("description", e.target.value);
                  }}
                />
              </Form.Item>
              {/* error message */}
              {form.formState.errors.description && (
                <p>{form.formState.errors.description.message}</p>
              )}
            </div>
            <h5>Nội dung tin tức</h5>
            {newsData.content.map((section, index) => (
              <div key={index}>
                <div>
                  <p>Nội dung phụ </p>
                  <Form.Item>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      sx={{ width: 640 }}
                      label="Nội dung phụ"
                      variant="outlined"
                      name={`content.${index}.sub_title`}
                      onChange={(e) => {
                        form.setValue(
                          `content.${index}.sub_title`,
                          e.target.value
                        );
                      }}
                    />
                  </Form.Item>
                </div>
                <div>
                  <p>Phụ đề</p>
                  <Form.Item>
                    <TextField
                      id="outlined-basic"
                      size="small"
                      sx={{ width: 640 }}
                      label="Phụ đề"
                      variant="outlined"
                      name="sub_content"
                      onChange={(e) => {
                        form.setValue(
                          `content.${index}.sub_content`,
                          e.target.value
                        );
                      }}
                    />
                  </Form.Item>
                </div>
                <div>
                  <p>Ảnh</p>
                  <Form.Item>
                    <Card>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => {
                          handleImageUpload(index, e.target.files);
                        }}
                        name={`content.${index}.images`}
                      />
                    </Card>
                  </Form.Item>
                </div>
              </div>
            ))}

            <Button onClick={addContentSection}>Thêm nội dung phụ</Button>
          </form>
        </Form>
      </Modal>
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Xóa tin tức
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">Bạn có chắc muốn xóa vĩnh viễn?</div>
            <div class="modal-footer">
              <ColorButton2 type="button" data-bs-dismiss="modal">
                Hủy
              </ColorButton2>
              <ColorButton3 type="button" onClick={removeNews}>
                Xóa sản phẩm
              </ColorButton3>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade bd-example-modal-lg"
        id="exampleModal1"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="row">
                <div className="col-1">
                  {" "}
                  <IconButton>
                    <InsertRowRightOutlined />
                  </IconButton>
                </div>
                <div className="col-11">
                  {" "}
                  <p className="fw-bold">Cập nhật bài viết </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <hr />
              <Form
                name="time_related_controls"
                {...formItemLayout}
                onFinish={onFinish}
                style={{
                  maxWidth: 600,
                }}
              >
                <Form.Item label="Tiêu đề">
                  <Input
                    value={editNew.title}
                    name="title"
                    onChange={handleChange1}
                  ></Input>
                </Form.Item>
                <hr />
                <Form.Item label="Hình ảnh">
                  <Card>
                    <Button
                      component="label"
                      role={undefined}
                      variant="text"
                      tabIndex={-1}
                    >
                      Bấm để chọn ảnh tải lên
                      <VisuallyHiddenInput type="file" />
                    </Button>
                    or drag and drop
                  </Card>
                </Form.Item>
                <hr />
                <Form.Item label="Mô tả">
                  <Input
                    name="description"
                    value={editNew.description}
                    onChange={handleChange1}
                  ></Input>
                </Form.Item>

                {editNew.content.map((item, index) => (
                  <div key={index}>
                    <div>
                      <p>Nội dung phụ </p>
                      <Form.Item>
                        <TextField
                          id="outlined-basic"
                          size="small"
                          sx={{ width: 640 }}
                          label="Nội dung phụ"
                          variant="outlined"
                          name="sub_title"
                          value={item.sub_title}
                          onChange={handleEditChange}
                        />
                      </Form.Item>
                    </div>
                    <div>
                      <p>Phụ đề</p>
                      <Form.Item>
                        <TextField
                          id="outlined-basic"
                          size="small"
                          sx={{ width: 640 }}
                          label="Phụ đề"
                          variant="outlined"
                          name="sub_content"
                          value={item.sub_content}
                          onChange={handleEditChange}
                        />
                      </Form.Item>
                    </div>
                    <div>
                      <p>Ảnh</p>
                      <Form.Item>
                        <Card>
                          <input
                            type="file"
                            multiple
                            onChange={handleEditChange}
                            name="image"
                          />
                        </Card>
                      </Form.Item>
                      <div></div>
                    </div>
                  </div>
                ))}
              </Form>
            </div>
            <div className="modal-footer">
              <button type="button" data-bs-dismiss="modal">
                Hủy
              </button>
              <button type="button" onClick={handleEditNew}>
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPost;
