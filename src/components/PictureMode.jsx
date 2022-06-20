import { createRef, useEffect, useState } from "react";
import Carousel from "react-gallery-carousel";
import "react-gallery-carousel/dist/index.css";
import useSocketIo from "../hooks/useSocketIo";

const PictureMode = () => {
  const socket = useSocketIo(localStorage.getItem("room"));
  const carouselRef = createRef();
  const [device, setDevice] = useState(localStorage.getItem("device"));
  const images = [1, 2, 3, 4, 5, 6, 7].map((number) => ({
    src: `/images/vloer${number}.jpg`,
  }));

  useEffect(() => {
    if (socket && device !== "config") {
      socket.on("picture change", (data) => {
        carouselRef.current.goToIndex(data.curIndex);
      });

      return () => {
        socket?.disconnect();
      };
    }
  }, [socket]);

  const handleImageChange = ({ curIndex, curIndexForDisplay }) => {
    console.log(curIndex, curIndexForDisplay);
    socket.emit("active", {
      status: "active",
    });
    socket.emit("picture change", { curIndex });
  };

  const carouselProps = {
    hasLeftButton: false,
    hasRightButton: false,
    hasMediaButton: false,
    hasSizeButton: false,
    hasThumbnails: false,
  };

  return (
    <div>
      <Carousel
        ref={carouselRef}
        images={images}
        style={{ height: "100vh", width: "100%" }}
        {...(device === "screen" && { ...carouselProps })}
        objectFit="contain"
        onIndexChange={device === "config" && handleImageChange}
      />
    </div>
  );
};

export default PictureMode;
