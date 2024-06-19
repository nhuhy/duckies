import React, { useState } from 'react';
import duck from './img/ducks/front-duck.png'
import './App.css';
import "@fontsource/bebas-neue";

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

      // Add a new larger duck
      setDucks([...updatedDucks, { x: minX, y: minY, width: maxX - minX + 50, height: maxY - minY + 50 }]);
    } else {
      setDucks([...ducks, { x, y, width: 50, height: 50 }]);
    };
    if (newClickCount === 2) {
      setShowMergeMessage(true);
    }
  };

  const isCloseToDuck = (duck, x, y) => {
    const threshold = 50; // Adjust as needed, this determines the proximity threshold
    return (
      x >= duck.x - threshold &&
      x <= duck.x + duck.width + threshold &&
      y >= duck.y - threshold &&
      y <= duck.y + duck.height + threshold
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={duck} className="App-logo" alt="logo" />
        <h1>
          Duckies
        </h1>
      </header>
      <main className="App-body" onClick={handleBodyClick}>
        <div className="body-content">
          <p>Click on the screen to create a ducky. <br /></p>
          {ducks.map((duckPosition, index) => (
            <img
              key={index}
              src={duck}
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
