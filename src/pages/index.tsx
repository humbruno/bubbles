import React, { ReactNode, useEffect } from 'react';
import { AnimationDefinition, motion, useAnimation } from 'framer-motion';

type BubblePosition = {
  x: number;
  y: number;
};

const texts = ['.NET CORE', 'AZURE', 'angular', 'GATSBY JS', 'IO'];
const BUBBLE_MAX_WIDTH = 100;
const BUBBLE_MIN_WIDTH = 80;

const BUBBLE_SIZES = {
  max: BUBBLE_MAX_WIDTH,
  min: BUBBLE_MIN_WIDTH,
};

const TextBubble = ({
  x,
  y,
  index,
  children,
}: {
  x: number;
  y: number;
  index: number;
  children?: ReactNode;
}) => {
  console.log('Individual bubble rendered');
  const controls = useAnimation();

  const appearAnimation: AnimationDefinition = {
    opacity: 1,
    y,
    transition: {
      duration: generateRandomDurationInSeconds({ min: 0.8, max: 1.5 }),
      ease: 'easeInOut',
    },
  };

  function generateRandomDurationInSeconds({
    min,
    max,
  }: {
    min: number;
    max: number;
  }): number {
    return Math.random() * (max - min) + min;
  }

  const floatAnimation: AnimationDefinition = {
    y: [y, y + 20, y],
    transition: {
      duration: generateRandomDurationInSeconds({ min: 2, max: 4 }),
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
    'purple',
    'orange',
    'pink',
  ];

  const colorIndex = index % colors.length;
  const selectedColor = colors[colorIndex];

  async function animationSequence() {
    await controls.start(appearAnimation);
    controls.start(floatAnimation);
  }

  useEffect(() => {
    animationSequence();
  }, [controls]);

  const minMax = Math.random() < 0.5 ? 'max' : 'min';

  const width = !children ? '30px' : `${BUBBLE_SIZES[minMax]}px`;
  const height = !children ? '30px' : width;
  const fontSize = width === `${BUBBLE_SIZES.max}px` ? '18px' : '14px';

  return (
    <motion.div
      initial={{ opacity: 0, y: y + 300 }}
      animate={controls}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        textTransform: 'uppercase',
        padding: !children ? '0' : '20px',
        width: width,
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: '50%',
        backgroundColor: selectedColor,
        fontSize: fontSize,
      }}
    >
      {children}
    </motion.div>
  );
};

const CONTAINER_PADDING_X = 600;

const TextBubbles = ({ numBubbles }: any) => {
  console.log('bubble container rendered');
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
    const bubbleRadius = BUBBLE_MAX_WIDTH / 2;
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
    const positions: BubblePosition[] = [
      { x: CONTAINER_PADDING_X - 80, y: 30 },
      { x: 2500 - CONTAINER_PADDING_X, y: 170 },
    ];
    const padding = 20;

    for (let i = 0; i < numBubbles; i++) {
      let newPosition;
      do {
        newPosition = getRandomPosition();
      } while (checkCollision(newPosition, positions, padding));

      positions.unshift(newPosition); // we want to add new bubbles to the start of the array so that they are the ones receiving the text on the render map
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
        <TextBubble key={index} x={position.x} y={position.y} index={index}>
          {texts[index]}
        </TextBubble>
      ))}
    </div>
  );
};

const App = () => {
  console.log('app rendered');
  return (
    <div
      style={{
        border: '1px solid #ccc',
        position: 'relative',
      }}
    >
      <TextBubbles numBubbles={texts.length} />
    </div>
  );
};

export default App;
