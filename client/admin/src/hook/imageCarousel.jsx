import React from "react";
import { useCarousel } from "./Function";

const ImageCarousel = ({ images }) => {
  const { currentImage, goNext, goPrev } = useCarousel(images || []);

  if (!images || images.length === 0) return <div>No images</div>;

  return (
    <div className="d-flex flex-column align-items-center mt-4">
      <div
        style={{
          width: 560,
          height: 460,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={currentImage.url}
          alt="carousel"
          width={560}
          height={460}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
        <button
          onClick={goPrev}
          style={{
            position: "absolute",
            top: "50%",
            left: 10,
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            cursor: "pointer",
          }}
        >
          ‹
        </button>
        <button
          onClick={goNext}
          style={{
            position: "absolute",
            top: "50%",
            right: 10,
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            cursor: "pointer",
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;
