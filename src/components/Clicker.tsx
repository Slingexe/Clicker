'use client'

import { useState, useEffect } from "react";

export default function Clicker() {
    const [clicks, setClicks] = useState(0);
    const [autoClickers, setAutoClickers] = useState(0);

    // Load saved progress from localStorage when the component mounts
    useEffect(() => {
        const savedClicks = localStorage.getItem("clicks");
        const savedAutoClickers = localStorage.getItem("autoClickers");

        if (savedClicks) setClicks(parseInt(savedClicks));
        if (savedAutoClickers) setAutoClickers(parseInt(savedAutoClickers));
    }, []);

    // Save progress whenever clicks or autoClickers change
    useEffect(() => {
      localStorage.setItem("clicks", clicks.toString());
      localStorage.setItem("autoClickers", autoClickers.toString());
    }, [clicks, autoClickers]);


    useEffect(() => {
      const interval = setInterval(() => {
        setClicks((prev) => prev + autoClickers);
      }, 1000);
      return () => clearInterval(interval);
    }, [autoClickers]);

    const handleClick = () => {
      setClicks(clicks + 1);
    };

    const buyAutoClicker = () => {
      if (clicks >= 10) {
        setClicks(clicks - 10);
        setAutoClickers(autoClickers + 1);
      }
    };

    return (
    <div className="flex flex-col items-center gap-4 p-6">
        <h1 className="text-2xl font-bold">Clicker</h1>
        <p className="text-lg">Clicks: {clicks}</p>
        <button
        onClick={handleClick}
        className="p-4 bg-yellow-500 rounded-full text-white text-xl"
        >
            Clicker
        </button>
        <button
        onClick={buyAutoClicker}
        disabled={clicks < 10}
        className="p-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
            Buy Auto Clicker (10 clicks)
        </button>
        <p>Auto Clickers: {autoClickers}</p>
    </div>
  );
}
