// hooks/useCarousel.js
import { useState, useCallback } from "react";

export const useCarousel = (images) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  return {
    currentImage: images[currentIndex],
    currentIndex,
    goNext,
    goPrev,
  };
};
