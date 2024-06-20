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
    const x = e.clientX - bodyRect.left - 25; // Adjust this based on your duck image size
    const y = e.clientY - bodyRect.top - 25;  // Adjust this based on your duck image size

    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    const closeDucks = ducks.filter((duck) => isCloseToDuck(duck, x, y));
    if (closeDucks.length > 0) {
      // Calculate the bounding box to cover all close ducks
      let minX = x;
      let maxX = x;
      let minY = y;
      let maxY = y;

      closeDucks.forEach((duck) => {
        if (duck.x < minX) minX = duck.x;
        if (duck.x + duck.width > maxX) maxX = duck.x + duck.width;
        if (duck.y < minY) minY = duck.y;
        if (duck.y + duck.height > maxY) maxY = duck.y + duck.height;
      });

      // Remove close ducks
      const updatedDucks = ducks.filter((duck) => !isCloseToDuck(duck, x, y));
      let highestRarityType = closeDucks[0].type;
      let highestRarityWeight = duckImages.findIndex(img => img === highestRarityType); // Initial weight

      closeDucks.forEach(duck => {
        const duckTypeIndex = duckImages.findIndex(img => img === duck.type);
        if (duckTypeIndex > highestRarityWeight) {
          highestRarityType = duck.type;
          highestRarityWeight = duckTypeIndex;
        }
      }); const aspectRatio = closeDucks[0].width / closeDucks[0].height;
      const newWidth = maxX - minX + 50;
      const newHeight = newWidth / aspectRatio;
      const newDuck = { x: minX, y: minY, width: newWidth, height: newHeight, type: highestRarityType, currentImage: highestRarityType.sit };


      // Update the ducks state
      setDucks([...updatedDucks, newDuck]);

      // Immediately update the currentImage of the merged duck
      setDucks((prevDucks) => {
        const updatedIndex = prevDucks.findIndex((d) => d === newDuck);
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
      const randomDuckType = generateRandomDuckType();
      setDucks([
        ...ducks,
        { x, y, width: 50, height: 50, type: randomDuckType, currentImage: randomDuckType.front },
      ]);
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


  const generateRandomDuckType = () => {
    // Define rarity weights (adjust as needed)
    const weights = [8, 3, 2, 1]; // Example weights: first duck type is most common, last is rarest

    // Calculate total weight sum
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);

    // Generate random number within total weight range
    let randomNumber = Math.floor(Math.random() * totalWeight);

    // Determine which duck type corresponds to the random number
    let cumulativeWeight = 0;
    for (let i = 0; i < duckImages.length; i++) {
      cumulativeWeight += weights[i];
      if (randomNumber < cumulativeWeight) {
        return duckImages[i];
      }
    }
    // Fallback (should not happen if weights are correctly defined)
    return duckImages[0];
  };

  const changeImage = () => {
    setDucks((prevDucks) =>
      prevDucks.map((duck) => {
        const { front, sit, left, leftSit, right, rightSit } = duck.type;

        // Determine the next image based on current state
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
        } else {
          newFront = front;
        }

        return { ...duck, currentImage: newFront };
      })
    );
  };




  useEffect(() => {
    const intervalId = setInterval(changeImage, 1000);
    return () => clearInterval(intervalId);
  }, [showMergeMessage]); // Add showMergeMessage as a dependency to useEffect


  const clearDucks = (e) => {
    e.stopPropagation();
    console.log("Clearing ducks...");
    setDucks([]);
    console.log("Ducks state after clearing:", ducks); // Check ducks state after setting to []
    setClickCount(0);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={duck} className="App-logo" alt="logo" />
        <h1>Duckies</h1>
      </header>
      <main className="App-body" onClick={handleBodyClick}>
        <div className="body-content">
          <h4>Click on the screen to create a ducky. <br /></h4>
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
            <h4>You can create even larger ducks by clicking around existing ducks.</h4><h4> There are also some special duck types to discover. Enjoy making different size ducks!</h4>
          </div>
        )}
        <button className="clear-button" onClick={clearDucks}>Clear Ducks</button>
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
