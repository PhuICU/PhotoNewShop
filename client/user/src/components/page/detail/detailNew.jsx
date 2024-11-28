import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
} from "@mui/material";

import { useParams, Link } from "react-router-dom";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import { useQuery } from "@tanstack/react-query";
import useQueryParams from "../../../hook/useQueryParam";

import { getNewsById, getNews } from "../../../api/newsApi";

import instance from "../../../api/instanApi";

function DetailNew() {
  const [news, setNews] = useState({
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

  const [dataNews, setDataNews] = useState([]);

  const { id } = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getNewsById(id);
        console.log(response);
        setNews(response.data.data);
      } catch (error) {
        console.log("Failed to fetch data: ", error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getNews();
        setDataNews(response.data.data);
      } catch (error) {
        console.log("Failed to fetch data: ", error);
      }
    };
    fetchData();
  }, []);

  const query = useQueryParams();

  const { data, isLoading } = useQuery({
    queryKey: ["photo-news", query],
    queryFn: async () => await instance.get(`/photo-news`),
  });

  const post = data?.data?.data?.items;

  const visibleItems = post?.slice(currentIndex, currentIndex + itemsPerPage);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerPage < post.length ? prevIndex + itemsPerPage : 0
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - itemsPerPage >= 0
        ? prevIndex - itemsPerPage
        : post.length - itemsPerPage
    );
  };

  const formatPrice = (price) => {
    if (price >= 100000000) {
      return (price / 1000000000).toFixed(1) + " tỷ";
    } else {
      return (price / 1000000).toFixed(1) + " triệu";
    }
  };

  return (
    <div className="container">
      {isLoading && <p>Loading...</p>}
      <div className="mt-4">
        <Typography variant="h3">{news.title}</Typography>
      </div>
      <div className="mt-4">
        <Typography variant="caption">
          Cập nhật lần cuối vào{" "}
          {new Date(news.updated_at).toLocaleDateString() +
            " " +
            new Date(news.updated_at).toLocaleTimeString()}
        </Typography>
        <div className="mt-4">
          <Typography variant="subtitle2">{news.description}</Typography>
        </div>
      </div>
      <div className="row">
        <div className="col-9">
          {news.content.map((item, index) => (
            <div key={index} className="mt-4">
              <Typography className="mt-4" variant="h4">
                {item.sub_title}
              </Typography>
              <Typography className="mt-4" variant="body2">
                {item.sub_content}
              </Typography>
              <div className="mt-4">
                {item.images.map((image, index) => (
                  <Card key={index}>
                    <CardMedia
                      component="img"
                      height="540"
                      image={image.url}
                      alt="green iguana"
                    />
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="col-3">
          <div
            style={{
              position: "sticky",
              top: "0",
              backgroundColor: "white",
              height: "50px",
              padding: "10px",
              paddingTop: "15px",
              paddingLeft: "50px",
            }}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrCiAoAF6lv7xexsUuJ_jKSW43peg2Rqhpf5XkJAWC2jeGcufQHbYMPgGa0y8MWc2aEOU&usqp=CAU"
              alt=""
              width={250}
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="mt-4">
        <div className="d-flex justify-content-between">
          <div>
            <Typography variant="h5">Bất động sản liên quan</Typography>
          </div>
          <div className=" mt-3">
            <Button color="primary" onClick={handlePrev}>
              <LeftOutlined />
            </Button>
            <Button color="primary" onClick={handleNext}>
              <RightOutlined />
            </Button>
          </div>
        </div>

        <div className="d-flex justify-content-around">
          {visibleItems?.map((item, index) => (
            <Link to={`/post/${item._id}`} className="nav-link" key={item._id}>
              <Card
                sx={{
                  margin: "10px",
                  padding: "10px",
                  boxShadow: "0 4px 6px 0 rgba(0, 0, 0, 0.1)",
                  borderRadius: "10px",
                  cursor: "pointer",
                  width: "250px",
                  height: "300px",
                }}
              >
                <div className="container-fluid">
                  <div>
                    <img
                      src={item.images[0].url}
                      alt="image"
                      style={{
                        width: "200px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="mt-4">
                    <Typography
                      gutterBottom
                      variant="body2"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                      component="div"
                    >
                      {item.title}
                    </Typography>
                    <div className="d-flex justify-content-between">
                      <Typography variant="body2" className="text-danger">
                        {item.area.value} {item.area.unit}
                      </Typography>
                      <Typography variant="body2" className="text-danger">
                        {formatPrice(item.price.value * item.area.value)}
                      </Typography>
                    </div>

                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontSize: "0.8rem" }}
                    ></Typography>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <hr />
      <div>
        <Typography variant="h5">Tin tức khác</Typography>
        <div className="row">
          {dataNews.map((item, index) => (
            <Link to={`/new/${item._id}`} className="nav-link">
              <Card className="row mt-4" key={index}>
                <div className=" container-fluid col-4">
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.content[0].images[0]?.url}
                    alt="green iguana"
                  />
                </div>

                <div className="col-8">
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                  <CardActions></CardActions>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DetailNew;
