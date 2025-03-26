'use client'

import { useState, useEffect, useRef } from "react";

export default function Clicker() {
    const [clicks, setClicks] = useState(0);
    const [autoClickers, setAutoClickers] = useState(0);
    const [clickMult, setClickMult] = useState(1);
    const [clicksPerSecond, setClicksPerSecond] = useState(0); // CPS state

    const clickCountInIntervalRef = useRef(0); // Ref to store click count in the current interval

    // Calculate the price of items
    const autoClickerPrice = Math.floor(10 * Math.pow(1.15, autoClickers));
    const clickMultPrice = Math.floor(100 * Math.pow(1.50, clickMult));


    // Load saved progress from localStorage when the component mounts
    useEffect(() => {
        const savedClicks = localStorage.getItem("clicks");
        const savedAutoClickers = localStorage.getItem("autoClickers");
        const savedMult = localStorage.getItem("clickMult");

        if (savedClicks) setClicks(parseInt(savedClicks));
        if (savedAutoClickers) setAutoClickers(parseInt(savedAutoClickers));
        if (savedMult) setClickMult(parseFloat(savedMult));
    }, []);

    // Save progress whenever clicks or autoClickers change
    useEffect(() => {
      localStorage.setItem("clicks", clicks.toString());
      localStorage.setItem("autoClickers", autoClickers.toString());
      localStorage.setItem("clickMult", clickMult.toString());
    }, [clicks, autoClickers, clickMult]);

    // Update clicks automatically by autoClickers every second
    useEffect(() => {
      const interval = setInterval(() => {
        setClicks((prev) => prev + autoClickers);
      }, 1000);
      return () => clearInterval(interval);
    }, [autoClickers]);

    // Update CPS every second
    useEffect(() => {
      const interval = setInterval(() => {
          setClicksPerSecond(clickCountInIntervalRef.current); // Update CPS from the ref
          clickCountInIntervalRef.current = 0; // Reset click count after updating CPS
      }, 1000);

      return () => clearInterval(interval); // Cleanup the interval
  }, []);
    
    //    Main Function
    // Handle user click and update CPS
    const handleClick = () => {
      setClicks((prevClicks) => prevClicks + (1 * clickMult));
      clickCountInIntervalRef.current += 1; // Increment ref count for CPS
    };

    // Handle buying an auto-clicker
    const buyAutoClicker = () => {
      if (clicks >= autoClickerPrice) {
        setClicks(clicks - autoClickerPrice);
        setAutoClickers(autoClickers + 1);
      }
    };

    const buyClickMultiplier = () => { 
      if (clicks >= clickMultPrice) {
        setClicks(clicks - clickMultPrice);
        setClickMult(clickMult + 0.25);
      }
    };

    //    Other Widgets
    // Reset clicks and auto-clickers
    const reset = () => {
      if (confirm("Are you sure you want to reset?") == true) {
        setClicks(0);
        setAutoClickers(0);
        setClickMult(1);
        
        setClicksPerSecond(0); // Reset CPS when resetting
        clickCountInIntervalRef.current = 0; // Reset click count for CPS
      }
    };


    return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col items-center justify-center min-h-full">
        <p className="text-lg">Clicks: {clicks}</p>
        <button
          onClick={handleClick}
          className="p-4 bg-yellow-500 rounded-full text-white text-xl"
        >
            Clicker
        </button>
        <button
          onClick={buyAutoClicker}
          disabled={clicks < autoClickerPrice}
          className="p-2 bg-blue-500 text-white rounded disabled:opacity-50 mt-4"
        >
            Buy Auto Clicker ({autoClickerPrice} clicks)
        </button>
        <p>Auto Clickers: {autoClickers}</p>

        <button
          onClick={buyClickMultiplier}
          disabled={clicks < clickMultPrice}
          className="p-2 bg-blue-500 text-white rounded disabled:opacity-50 mt-4"
        >
            Buy Click Multiplier ({clickMultPrice} clicks)
        </button>
        <p>Curren Mult: {clickMult}x</p>
      </div>
      <button
        onClick={reset}
        className="p-2 bg-red-500 text-white rounded fixed bottom-4 right-4"
      >
        Reset
      </button>
      <div className="fixed bottom-4 left-4">
        <p>Clicks per second: {clicksPerSecond}</p>
      </div>
    </div>
  );
}
