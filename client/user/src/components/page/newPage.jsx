import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Pagination,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getNews } from "../../api/newsApi";

function NewPage() {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredPost, setHoveredPost] = useState({
    content: [
      {
        images: [
          {
            url: "",
          },
        ],
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getNews();
        setNews(response.data.data);
      } catch (error) {
        console.log("Failed to fetch data: ", error);
      }
    };
    fetchData();
  }, []);

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentNews = news.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <div className="mt-4">
        <h2 className="text-center">Tin tức mới nhất</h2>
        <Typography
          sx={{
            display: "inline-block",
            verticalAlign: "middle",
          }}
          className="text-center"
        >
          Thông tin mới, đầy đủ, hấp dẫn về thị trường nhiếp ảnh Việt Nam thông
          qua dữ liệu lớn về giá, giao dịch, nguồn cung - cầu và khảo sát thực
          tế của đội ngũ phóng viên, biên tập.
        </Typography>
      </div>
      <div className="row container mt-4">
        <div className="col-7 d-flex justify-content-end">
          {/* Placeholder image */}
          <img
            src={
              isHovered === true
                ? hoveredPost?.content[0]?.images[0]?.url
                : "https://rukminim2.flixcart.com/image/850/1000/ksm49e80/art-set/g/p/d/newspaper-for-crafting-project-or-paper-bag-and-other-1kg-original-imag65eegtxkt7nb.jpeg?q=90&crop=false"
            }
            style={{
              width: "658px",
              height: "257px",
              borderRadius: "10px",
            }}
            className="container"
            alt="news image"
          />
        </div>
        <div className="col-5">
          {currentNews.length > 0 ? (
            currentNews.slice(2, 6).map((item) => (
              <Link
                to={`/new/${item._id}`}
                key={item._id}
                className="row nav-link"
              >
                <div
                  onMouseEnter={() => {
                    setIsHovered(true);
                    setHoveredPost(item);
                  }}
                  onMouseLeave={() => {
                    setIsHovered(false);
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "#9e9e9e",
                    }}
                  >
                    <span>
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </Typography>
                  <div>
                    <Typography variant="h6">{item.title}</Typography>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div>
              <h4>Không có tin tức nào</h4>
            </div>
          )}
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-8">
          {currentNews.length > 0 ? (
            currentNews.map((item) => (
              <Link key={item._id} to={`/new/${item._id}`} className="nav-link">
                <Card className="mt-4  row">
                  <CardMedia className="col-4">
                    <img
                      src={item.content[0].images[0]?.url}
                      alt=""
                      style={{
                        width: "200px",
                        height: "200px",
                      }}
                    />
                  </CardMedia>
                  <CardContent className="col-7">
                    <Typography gutterBottom variant="h6" component="div">
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                      variant="body2"
                      color="text.secondary"
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div>
              <h4>Không có tin tức nào</h4>
            </div>
          )}
        </div>
        <div className="col-2 mt-4 container">
          <div
            style={{
              position: "sticky",
              top: "0",
              backgroundColor: "white",
              height: "50px",
              padding: "10px",
              paddingTop: "15px",
            }}
          >
            <img
              src="https://treobangron.com.vn/wp-content/uploads/2022/09/banner-bat-dong-san-28.jpg"
              alt="news image"
              width={250}
            />
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 d-flex justify-content-center">
        <Pagination
          count={Math.ceil(news.length / postsPerPage)}
          page={currentPage}
          onChange={(event, value) => paginate(value)}
          color="primary"
        />
      </div>
    </div>
  );
}

export default NewPage;
