import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import instance from "../../api/instanApi";
import useScrollToTop from "../../hook/useScrollToTop";
import useQueryParams from "../../hook/useQueryParam";
import { useTranslation } from "react-i18next";
import "../../utils/Language/i18n";

import { Col, Row } from "antd";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import CardPhotoNew from "../card/cardPhotoNew";
import CarouselHomePage from "../carousel/carousel.homePage";
import FilterPost from "../filter/filterPost";

function HomePage() {
  const { t } = useTranslation();

  const query = useQueryParams();

  const { data, isLoading } = useQuery({
    queryKey: ["photo-news", query],
    queryFn: async () => await instance.get(`/photo-news`),
  });

  const post = data?.data?.data?.items;

  const [visibleCount, setVisibleCount] = useState(8);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };

  useScrollToTop();
  return (
    <div>
      <div>
        <FilterPost />
      </div>
      <div>
        <CarouselHomePage />
      </div>
      <div className="mt-4">
        <Divider textAlign="left">
          <h3>{t("Tin dành cho bạn")} </h3>
        </Divider>
        <div className="container">
          <Button type="outlined">
            <Link to={"/map-nearby"} className="nav-link">
              {" "}
              {t("Xem trên bản đồ")}{" "}
              <i className="fa fa-map-marker" aria-hidden="true"></i>
            </Link>
          </Button>
        </div>
        <div className="mt-4">
          <div className="container">
            <Row gutter={[16, 16]}>
              {post?.slice(0, visibleCount).map((item, index) => (
                <Col span={6} key={index}>
                  <CardPhotoNew {...item} />
                </Col>
              ))}
            </Row>
            {visibleCount < post?.length && (
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <Button
                  type="primary"
                  onClick={handleLoadMore}
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    color: "white",
                    border: "none",
                  }}
                >
                  {t("Xem thêm")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
