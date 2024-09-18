// LottieAnimation.js
import React from "react";
import Lottie from "react-lottie";

const LottieAnimation = ({ src }) => (
  <Lottie
    options={{
      animationData: { src },
      loop: true,
      autoplay: true,
    }}
  />
);

export default LottieAnimation;
