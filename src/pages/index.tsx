import React, { useEffect } from 'react';
import { AnimationDefinition, motion, useAnimation } from 'framer-motion';

type BubblePosition = {
  x: number;
  y: number;
};

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

  const appearAnimation: AnimationDefinition = {
    opacity: 1,
    y,
    transition: {
      duration: 0.25,
      ease: 'easeInOut',
    },
  };

  function getRandomFloatingDuration() {
    // Generate a random float duration between 2 and 4 seconds for each bubble
    return Math.random() * (4 - 2) + 2;
  }

  const floatAnimation: AnimationDefinition = {
    y: [y, y + 20, y],
    transition: {
      duration: getRandomFloatingDuration(),
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'reverse',
    },
  };

  const colors = [
    'crimson',
    'lightblue',
    'green',
    'lightyellow',
    'lightpurple',
    'orange',
    'pink',
  ];
  const texts = ['.NET CORE', 'AZURE', 'angular', 'GATSBY JS', 'IO'];

  const colorIndex = index % colors.length;
  const selectedColor = colors[colorIndex];

  async function animationSequence() {
    await controls.start(appearAnimation);
    controls.start(floatAnimation);
  }

  useEffect(() => {
    animationSequence();
  }, [controls, y]);

  return (
    <motion.div
      initial={{ opacity: 0, y: y + 300 }}
      animate={controls}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        textTransform: 'uppercase',
        padding: '20px',
        minWidth: '40px',
        maxWidth: '100px',
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: '50%',
        backgroundColor: 'lightyellow',
      }}
    >
      {texts[index]}
    </motion.div>
  );
};

const CONTAINER_PADDING_X = 600;

const TextBubbles = ({ numBubbles }: any) => {
  function getRandomPosition() {
    const bubbleDiameter = 80;
    const spaceAroundBubble = 40;

    const maxX =
      2500 - bubbleDiameter - 2 * (spaceAroundBubble + CONTAINER_PADDING_X);
    const maxY = 300 - bubbleDiameter - 2 * spaceAroundBubble;

    const x = Math.random() * maxX + spaceAroundBubble + CONTAINER_PADDING_X;
    const y = Math.random() * maxY + spaceAroundBubble;

    return { x, y };
  }

  function checkCollision(
    position: { x: number; y: number },
    otherPositions: { x: number; y: number }[],
    padding: number
  ): boolean {
    const bubbleDiameter = 80;
    const bubbleRadius = bubbleDiameter / 2;
    const totalRadiusWithPadding = bubbleRadius + padding;

    const isCollision = (otherPosition: { x: number; y: number }): boolean => {
      const deltaX = position.x - otherPosition.x;
      const deltaY = position.y - otherPosition.y;
      const distance = Math.hypot(deltaX, deltaY);

      return distance < 2 * totalRadiusWithPadding;
    };

    return otherPositions.some(isCollision);
  }

  function getBubblePositions(): BubblePosition[] {
    const positions: BubblePosition[] = [];
    const padding = 20;

    for (let i = 0; i < numBubbles; i++) {
      let newPosition;
      do {
        newPosition = getRandomPosition();
      } while (checkCollision(newPosition, positions, padding));

      positions.push(newPosition);
    }

    return positions;
  }

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '500px',
        padding: `0 ${CONTAINER_PADDING_X}px`,
        background: '#ccc',
      }}
    >
      {getBubblePositions().map((position, index) => (
        <TextBubble key={index} x={position.x} y={position.y} index={index} />
      ))}
    </div>
  );
};

const App = () => {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        position: 'relative',
      }}
    >
      <TextBubbles numBubbles={5} />
    </div>
  );
};

export default App;
