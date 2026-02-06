import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import "./ProposalPage.css";

const ProposalPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dataParam = searchParams.get("data");

  const [proposalData, setProposalData] = useState(null);
  const [yesStage, setYesStage] = useState(0);
  const [noBtnPosition, setNoBtnPosition] = useState({ position: "relative" });
  const [yesScale, setYesScale] = useState(1);

  const yesBtnRef = useRef(null);
  const noBtnRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!dataParam) {
      navigate("/generate");
      return;
    }
    try {
      // Decode Base64 and then handle UTF-8 characters properly
      const decodedString = decodeURIComponent(escape(atob(dataParam)));
      const parsedData = JSON.parse(decodedString);
      setProposalData({
        name: parsedData.n,
        startImage: parsedData.si,
        endImage: parsedData.ei,
        finalMessage: parsedData.fm,
      });
    } catch (error) {
      console.error("Decoding error:", error);
      navigate("/generate");
    }
  }, [dataParam, navigate]);

  const triggerFireworks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 2000,
      });
    }, 250);
  };

  const handleNoInteraction = (e) => {
    e.preventDefault();
    setYesScale((prev) => Math.min(prev + 0.15, 2.5));

    // 1. Get current positions
    const noRect = noBtnRef.current.getBoundingClientRect();
    const yesRect = yesBtnRef.current.getBoundingClientRect();
    const vWidth = window.innerWidth;
    const vHeight = window.innerHeight;

    // 2. Define "Small Move" distance
    const moveDist = 150;

    // 3. Calculate a new position by shifting slightly
    // We use a small random offset combined with a directional shift
    let newLeft = noRect.left + (Math.random() > 0.5 ? moveDist : -moveDist);
    let newTop = noRect.top + (Math.random() > 0.5 ? moveDist : -moveDist);

    // 4. Boundary Clamping (Don't let it leave the screen)
    const padding = 20;
    if (newLeft < padding) newLeft = padding + 50;
    if (newLeft + noRect.width > vWidth - padding)
      newLeft = vWidth - noRect.width - padding - 50;
    if (newTop < padding) newTop = padding + 50;
    if (newTop + noRect.height > vHeight - padding)
      newTop = vHeight - noRect.height - padding - 50;

    // 5. Collision Avoidance (Don't let it go under/over the Yes button)
    // If the new position overlaps with the Yes button area + 40px buffer
    const buffer = 40;
    const overlapX =
      newLeft < yesRect.right + buffer &&
      newLeft + noRect.width > yesRect.left - buffer;
    const overlapY =
      newTop < yesRect.bottom + buffer &&
      newTop + noRect.height > yesRect.top - buffer;

    if (overlapX && overlapY) {
      // If it's going to hit the Yes button, push it significantly away to the side
      newLeft =
        newLeft < yesRect.left
          ? yesRect.left - noRect.width - 100
          : yesRect.right + 100;
      newTop =
        newTop < yesRect.top
          ? yesRect.top - noRect.height - 100
          : yesRect.bottom + 100;
    }

    setNoBtnPosition({
      position: "fixed",
      left: `${newLeft}px`,
      top: `${newTop}px`,
      zIndex: "999",
      transition: "all 0.2s ease-out", // Small transition for "smooth flee"
    });
  };

  const handleYesClick = () => {
    if (yesStage < 4) {
      setYesStage(yesStage + 1);
      setNoBtnPosition({ position: "relative" }); // Reset position for next stage
    }
  };

  useEffect(() => {
    if (yesStage === 4) triggerFireworks();
  }, [yesStage]);

  if (!proposalData) return <div className="loading">Loading...</div>;

  const isSuccess = yesStage === 4;

  return (
    <div className="proposal-container" ref={containerRef}>
      <div className="overlay-texture"></div>
      <div className={`glass-card ${isSuccess ? "success-layout" : ""}`}>
        <div className="image-container">
          <img
            src={isSuccess ? proposalData.endImage : proposalData.startImage}
            alt="Valentine"
            className="feature-image"
          />
        </div>

        {!isSuccess ? (
          <div className="content-area">
            <h1 className="main-title">
              {yesStage === 0 ? (
                <span>
                  {proposalData.name},<br />
                  Will you be my Valentine?
                </span>
              ) : (
                <span className="warning-text">Are you sure? 🥺</span>
              )}
            </h1>

            <div className="button-group">
              <button
                ref={yesBtnRef}
                className="btn btn-yes"
                onClick={handleYesClick}
                style={{
                  transform: `scale(${yesScale})`,
                  position: "relative",
                  zIndex: 10,
                }}
              >
                {["Yes", "Are you Sure?", "Really Sure?", "Last chance!"][
                  yesStage
                ] || "Yes"}
              </button>

              <button
                ref={noBtnRef}
                className="btn btn-no"
                style={noBtnPosition}
                onMouseEnter={handleNoInteraction}
                onClick={handleNoInteraction}
              >
                No
              </button>
            </div>
          </div>
        ) : (
          <div className="success-area">
            <h1 className="success-title">{proposalData.finalMessage}</h1>
            <p className="sub-text">❤️ I knew you'd say yes 😉 ! ❤️</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalPage;
