import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import instance from "../../api/instanApi";
// import formatPrice from "../../utils/Funtion";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
} from "@mui/material";
import { notification } from "antd";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { pink } from "@mui/material/colors";
import { formatPrice } from "../../utils/Funtion";

function CardPhotoNew(item) {
  const queryClient = useQueryClient();
  const { data: favoritesData } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => instance.get(`http://localhost:5010/favorites/user`),
  });
  const likeMutation = useMutation({
    mutationFn: (data) =>
      instance.post("http://localhost:5010/favorites/create", {
        post_id: data,
      }),
  });
  const unlikeMutation = useMutation({
    mutationFn: (data) => instance.delete(`/favorites/delete/${data}`),
  });

  const favoritesPostIds = favoritesData?.data?.data?.post_ids || [];
  const handleUnFavorite = async (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    unlikeMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["favorites"]);
      },
    });
  };

  const handleFavorite = (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    likeMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["favorites"]);
      },
      onError: () => {
        // alert("Bạn cần đăng nhập để thực hiện chức năng này");
        notification["error"]({
          message: "Thông báo",
          description: "Bạn cần đăng nhập để thực hiện chức năng này",
          duration: 2,
        });
      },
    });
  };

  return (
    <div className="card-photo-new ">
      <Link
        to={`/post/${item._id}`}
        className="link-offset-2 link-underline link-underline-opacity-0 "
      >
        <Card className="mt-4 card-photo">
          <CardMedia component="img" height="140" image={item.images[0].url} />
          <CardContent style={{ width: "100%", height: "150px" }}>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                height: "100px",
              }}
            >
              {item.title}
            </Typography>
            <div className="row">
              <Typography
                variant="body2"
                color="text.secondary"
                className="text-danger col-7"
              >
                {formatPrice(item.price.value)}
                <span> </span>
                {item.price.unit}
              </Typography>
            </div>
          </CardContent>
          <CardActions>
            {favoritesPostIds.includes(item._id) ? (
              <IconButton
                aria-label="add to favorites"
                onClick={(e) => handleUnFavorite(e, item._id)}
              >
                <FavoriteIcon style={{ color: pink[500] }} />
              </IconButton>
            ) : (
              <IconButton
                aria-label="add to favorites"
                onClick={(e) => handleFavorite(e, item._id)}
              >
                <FavoriteIcon />
              </IconButton>
            )}
          </CardActions>
        </Card>
      </Link>
    </div>
  );
}

export default CardPhotoNew;
