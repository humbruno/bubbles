import React, { useState, useEffect } from 'react';
import {
  AnimationDefinition,
  motion,
  useAnimation,
  Variants,
} from 'framer-motion';

const TextBubble = ({
  x,
  y,
  index,
}: {
  x: number;
  y: number;
  index: number;
}) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      y: [0, 10, 0],
      transition: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse',
      },
    });
  }, [controls]);

  return (
    <motion.div
      animate={controls}
      initial={{ opacity: 1, y: 100 }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        padding: '8px',
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: '50%',
        backgroundColor: 'lightblue',
      }}
    >
      Text Bubble {index + 1}
    </motion.div>
  );
};
