import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import './FloatingHearts.css';

const FloatingHearts = () => {
  // Create an array of hearts with random positions and delays
  const hearts = Array.from({ length: 30 }).map(() => ({
    id: uuidv4(),
    left: Math.random() * 100 + 'vw',
    animationDuration: Math.random() * 3 + 2 + 's',
    animationDelay: Math.random() * 2 + 's',
  }));

  return (
    <div className="hearts-container">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="heart"
          style={{
            left: heart.left,
            animationDuration: heart.animationDuration,
            animationDelay: heart.animationDelay,
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;