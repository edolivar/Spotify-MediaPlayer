import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

function draw(ctx, imageURL) {
  ctx.clearRect(0, 0, 380, 380);
  const newImage = new Image();
  newImage.src = imageURL;
  newImage.crossOrigin = "Anonymous";

  newImage.onload = () => {
    ctx.drawImage(newImage, 0, 0, 380, 380);
  };
}

const Canvas = ({ url, height, width }) => {
  const [cnter, setCount] = useState(0);

  const canvas = React.useRef();

  React.useEffect(() => {
    const context = canvas.current.getContext("2d", {
      willReadFrequently: true,
    });
    draw(context, url);
  }, [url]);
  return <canvas ref={canvas} height={height} width={width} />;
};

Canvas.propTypes = {
  url: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
};

const MemoCanvas = React.memo(Canvas);
export default MemoCanvas;
