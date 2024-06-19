import React, { useState, useEffect } from 'react';
import './App.css';
import "@fontsource/bebas-neue";

// Importing duck images
import duck from './img/ducks/front-duck.png';
import duckSit from './img/ducks/front-duck-sit.png';
import leftDuck from './img/ducks/left-duck.png';
import leftDuckSit from './img/ducks/left-duck-sit.png';
import rightDuck from './img/ducks/right-duck.png';
import rightDuckSit from './img/ducks/right-duck-sit.png';

import heroDuck from './img/ducks/hero-front-duck.png';
import heroDuckSit from './img/ducks/hero-front-duck-sit.png';
import heroLeftDuck from './img/ducks/hero-left-duck.png';
import heroLeftDuckSit from './img/ducks/hero-left-duck-sit.png';
import heroRightDuck from './img/ducks/hero-right-duck.png';
import heroRightDuckSit from './img/ducks/hero-right-duck-sit.png';

import fireDuck from './img/ducks/fire-front-duck.png';
import fireDuckSit from './img/ducks/fire-front-duck-sit.png';
import fireLeftDuck from './img/ducks/fire-left-duck.png';
import fireLeftDuckSit from './img/ducks/fire-left-duck-sit.png';
import fireRightDuck from './img/ducks/fire-right-duck.png';
import fireRightDuckSit from './img/ducks/fire-right-duck-sit.png';

import blueDuck from './img/ducks/blue-front-duck.png';
import blueDuckSit from './img/ducks/blue-front-duck-sit.png';
import blueLeftDuck from './img/ducks/blue-left-duck.png';
import blueLeftDuckSit from './img/ducks/blue-left-duck-sit.png';
import blueRightDuck from './img/ducks/blue-right-duck.png';
import blueRightDuckSit from './img/ducks/blue-right-duck-sit.png';

const duckImages = [
  { front: duck, sit: duckSit, left: leftDuck, leftSit: leftDuckSit, right: rightDuck, rightSit: rightDuckSit },
  { front: heroDuck, sit: heroDuckSit, left: heroLeftDuck, leftSit: heroLeftDuckSit, right: heroRightDuck, rightSit: heroRightDuckSit },
  { front: fireDuck, sit: fireDuckSit, left: fireLeftDuck, leftSit: fireLeftDuckSit, right: fireRightDuck, rightSit: fireRightDuckSit },
  { front: blueDuck, sit: blueDuckSit, left: blueLeftDuck, leftSit: blueLeftDuckSit, right: blueRightDuck, rightSit: blueRightDuckSit }
  // Add other duck image sets similarly...
];

function App() {
  const [ducks, setDucks] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [showMergeMessage, setShowMergeMessage] = useState(false);

  const handleBodyClick = (e) => {
    const bodyRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bodyRect.left - 25;
    const y = e.clientY - bodyRect.top - 25;

    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    const closeDucks = ducks.filter(duck => isCloseToDuck(duck, x, y));
    if (closeDucks.length > 0) {
      // Calculate the bounding box to cover all close ducks
      let minX = x;
      let maxX = x;
      let minY = y;
      let maxY = y;
  
      closeDucks.forEach(duck => {
        if (duck.x < minX) minX = duck.x;
        if (duck.x > maxX) maxX = duck.x;
        if (duck.y < minY) minY = duck.y;
        if (duck.y > maxY) maxY = duck.y;
      });
  
      // Remove close ducks
      const updatedDucks = ducks.filter(duck => !isCloseToDuck(duck, x, y));
  
      // Add a new larger duck with a randomly selected type
      const newDuckType = closeDucks[0].type;
      const newDuck = { x: minX, y: minY, width: maxX - minX + 50, height: maxY - minY + 50, type: newDuckType };
  
      // Update the ducks state
      setDucks([...updatedDucks, newDuck]);
  
      // Immediately update the currentImage of the merged duck
      setDucks(prevDucks => {
        const updatedIndex = prevDucks.findIndex(d => d === newDuck);
        if (updatedIndex !== -1) {
          const { front, sit, left, right } = newDuck.type;
          const newFront = sit; // Assuming sit is the next state after front
          const updatedDucksCopy = [...prevDucks];
          updatedDucksCopy[updatedIndex] = { ...newDuck, currentImage: newFront };
          return updatedDucksCopy;
        }
        return prevDucks;
      });
  
    } else {
      // Add a new duck with a randomly selected type
      const randomDuckType = duckImages[Math.floor(Math.random() * duckImages.length)];
      setDucks([...ducks, { x, y, width: 50, height: 50, type: randomDuckType, currentImage: randomDuckType.front }]);
    }
  

    if (newClickCount === 2) {
      setShowMergeMessage(true);
    }
  };

  const isCloseToDuck = (duck, x, y) => {
    const threshold = 50;
    return (
      x >= duck.x - threshold &&
      x <= duck.x + duck.width + threshold &&
      y >= duck.y - threshold &&
      y <= duck.y + duck.height + threshold
    );
  };

  const changeImage = () => {
    setDucks(prevDucks =>
      prevDucks.map(duck => {
        const { front, sit, left, leftSit, right, rightSit } = duck.type;
        let newFront;

        if (duck.currentImage === front) {
          newFront = sit;
        } else if (duck.currentImage === sit) {
          newFront = left;
        } else if (duck.currentImage === left) {
          newFront = leftSit;
        } else if (duck.currentImage === leftSit) {
          newFront = right;
        } else if (duck.currentImage === right) {
          newFront = rightSit;
        }
        else {
          newFront = front;
        }

        return { ...duck, currentImage: newFront };
      })
    );
  };

  useEffect(() => {
    const intervalId = setInterval(changeImage, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={duck} className="App-logo" alt="logo" />
        <h1>Duckies</h1>
      </header>
      <main className="App-body" onClick={handleBodyClick}>
        <div className="body-content">
          <p>Click on the screen to create a ducky. <br /></p>
          {ducks.map((duckPosition, index) => (
            <img
              key={index}
              src={duckPosition.currentImage}
              alt="duck"
              className="duck"
              style={{
                left: duckPosition.x + 'px',
                top: duckPosition.y + 'px',
                width: duckPosition.width + 'px',
                height: duckPosition.height + 'px'
              }}
            />
          ))}
        </div>
        {showMergeMessage && (
          <div className="merge-message">
            <p>You can merge ducks by placing them close together. Enjoy making different size ducks!</p>
          </div>
        )}
      </main>
      <footer className="App-footer">
        <a
          className="App-link"
          href="https://personal-web-lovat-kappa.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Creator
        </a>
      </footer>
    </div>
  );
}

export default App;
