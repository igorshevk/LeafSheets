// Imports

import React from 'react';

import {Section} from '../../../layouts';

// Styles

const bgImgStyle = {
  height: '100%',
  left: '50%',
  maxWidth: 'max(100vw, 1440px)',
  position: 'absolute',
  top: '0',
  width: '100%',
  transform: 'translateX(-50%)',
  zIndex: 5,
};

// Confetti

const Confetti = () => {
  return (
    <Section bg="rgb(67, 227, 174)" minHeight={700} position="relative" overflow="hidden">
      <video style={bgImgStyle} autoPlay="autoplay" loop="loop">
        <source src="/price-confetti.mp4" type="video/mp4" />
      </video>
    </Section>
  );
};

export default Confetti;
