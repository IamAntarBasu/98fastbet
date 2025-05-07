import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

const Card = ({ card, isScratched, revealedImage, handleFlip }) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || isScratched) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const initCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.fillStyle = "rgba(200, 200, 200, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    initCanvas();
  }, [isScratched]);

  const startScratching = (e) => {
    if (isScratched) return;
    isDrawing.current = true;
    scratch(e);
  };

  const scratch = (e) => {
    if (!isDrawing.current || isScratched) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();

    checkScratchCompletion();
  };

  const checkScratchCompletion = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;

    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparentPixels++;
    }

    const totalPixels = canvas.width * canvas.height;
    if (transparentPixels / totalPixels > 0.3) {
      handleFlip();
      setIsFlipped(true); // Trigger flip effect
    }
  };

  return (
    <CardContainer
      animate={{ rotateY: isFlipped || revealedImage ? 180 : 0 }}
      transition={{ duration: 0.6 }}
    >
      {!revealedImage ? (
        <StyledCanvas
          ref={canvasRef}
          onMouseDown={startScratching}
          onMouseMove={scratch}
          onMouseUp={() => (isDrawing.current = false)}
          onMouseLeave={() => (isDrawing.current = false)}
        />
      ) : (
        <StyledImage src={`/${revealedImage}`} alt="card" />
      )}
    </CardContainer>
  );
};

export default Card;

const CardContainer = styled(motion.div)`
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
`;

const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  background-color: #d1d5db;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
`;
