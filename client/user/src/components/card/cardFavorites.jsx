import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllFavoritePosts, unFavorite } from "../../api/favoritesApi";
import { formatPrice } from "../../utils/Funtion";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Autocomplete,
  TextField,
} from "@mui/material";
import { Form, notification } from "antd";
import { Button, CardActions, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { pink } from "@mui/material/colors";

import "../../utils/Language/i18n"; // Import i18n for translations
import { useTranslation } from "react-i18next"; // Import useTranslation hook

function CardFavorites() {
  const [dataFavorites, setDataFavorites] = useState([]);
  const { t } = useTranslation(); // Initialize translation hook
  const handleUnFavorite = async (e, id) => {
    try {
      const res = await unFavorite(id);
      console.log(res);
      // alert("Bỏ thích thành công");
      notification["success"]({
        message: "Thông báo",
        description: "Bỏ thích thành công",
        duration: 2,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await getAllFavoritePosts();
        setDataFavorites(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="card-favorites">
      <div className="mt-4 container">
        <div className="container-fluid row">
          <div className="col fw-bold">
            {t("Tổng số tin đã thích")}: {dataFavorites.length}
          </div>
        </div>
        <div>
          {" "}
          {dataFavorites.length ? (
            dataFavorites.map((item, index) => (
              <Card sx={{ display: "flex", height: 250 }} key={index}>
                <CardMedia
                  component="img"
                  sx={{ width: 200 }}
                  image={item.images[0].url}
                  alt="Live from space album cover"
                />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <br />
                  <CardContent sx={{ flex: "1 0 auto", width: 1000 }}>
                    <Typography component="div" variant="h6">
                      {item.title}
                    </Typography>
                    <div className="row">
                      <Typography
                        className="col"
                        variant="subtitle1"
                        color="text.secondary"
                      >
                        {formatPrice(item.price.value)} {item.price.unit}
                      </Typography>
                    </div>
                    <br />
                    <Button variant="outlined" className=" text-dark ">
                      <Link to={`/post/${item._id}`} className="nav-link">
                        {" "}
                        {t("Xem chi tiết")}
                      </Link>
                    </Button>

                    <div className="row mt-4">
                      <div className="col-10 fw-ligh">
                        {new Date(item.create_at).toLocaleDateString()}
                      </div>
                      {}
                      <CardActions className="col-1">
                        <IconButton
                          aria-label="add to favorites"
                          onClick={(e) => handleUnFavorite(e, item._id)}
                        >
                          <FavoriteIcon
                            style={{
                              color: pink[500],
                            }}
                          />
                        </IconButton>
                      </CardActions>
                    </div>
                  </CardContent>
                </Box>
              </Card>
            ))
          ) : (
            <p className="mt-4">{t("Chưa có tin lưu")}</p>
          )}
          <br />
        </div>
      </div>
    </div>
  );
}

export default CardFavorites;
