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
  const [isNoButtonFixed, setIsNoButtonFixed] = useState(false);

  const yesBtnRef = useRef(null);
  const noBtnRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!dataParam) {
      navigate("/generate");
      return;
    }
    try {
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

  const calculateGreenZones = (noRect, yesRect, vWidth, vHeight) => {
    const padding = 15;
    const buffer = 25;

    const safeZone = {
      left: padding,
      right: vWidth - noRect.width - padding,
      top: padding,
      bottom: vHeight - noRect.height - padding,
    };

    const redZone = {
      left: yesRect.left - buffer,
      right: yesRect.right + buffer,
      top: yesRect.top - buffer,
      bottom: yesRect.bottom + buffer,
    };

    const greenZones = [];

    // Left zone
    if (redZone.left - noRect.width > safeZone.left) {
      greenZones.push({
        left: safeZone.left,
        right: Math.min(redZone.left - noRect.width, safeZone.right),
        top: safeZone.top,
        bottom: safeZone.bottom,
      });
    }

    // Right zone
    if (redZone.right + noRect.width < safeZone.right) {
      greenZones.push({
        left: Math.max(redZone.right, safeZone.left),
        right: safeZone.right,
        top: safeZone.top,
        bottom: safeZone.bottom,
      });
    }

    // Top zone
    if (redZone.top - noRect.height > safeZone.top) {
      greenZones.push({
        left: safeZone.left,
        right: safeZone.right,
        top: safeZone.top,
        bottom: Math.min(redZone.top - noRect.height, safeZone.bottom),
      });
    }

    // Bottom zone
    if (redZone.bottom + noRect.height < safeZone.bottom) {
      greenZones.push({
        left: safeZone.left,
        right: safeZone.right,
        top: Math.max(redZone.bottom, safeZone.top),
        bottom: safeZone.bottom,
      });
    }

    return greenZones;
  };

  const getRandomPositionFromGreenZone = (greenZones) => {
    if (greenZones.length === 0) return null;

    const areas = greenZones.map((zone) => {
      const width = zone.right - zone.left;
      const height = zone.bottom - zone.top;
      return width * height;
    });

    const totalArea = areas.reduce((sum, area) => sum + area, 0);
    if (totalArea <= 0) return null;

    let randomArea = Math.random() * totalArea;
    let selectedZone = null;

    for (let i = 0; i < greenZones.length; i++) {
      randomArea -= areas[i];
      if (randomArea <= 0) {
        selectedZone = greenZones[i];
        break;
      }
    }

    if (!selectedZone) selectedZone = greenZones[greenZones.length - 1];

    const randomLeft =
      selectedZone.left +
      Math.random() * (selectedZone.right - selectedZone.left);
    const randomTop =
      selectedZone.top +
      Math.random() * (selectedZone.bottom - selectedZone.top);

    return { left: randomLeft, top: randomTop };
  };

  const handleNoInteraction = (e) => {
    e.preventDefault();
    setYesScale((prev) => Math.min(prev + 0.15, 2.5));

    if (!noBtnRef.current || !yesBtnRef.current) return;

    const noRect = noBtnRef.current.getBoundingClientRect();
    const yesRect = yesBtnRef.current.getBoundingClientRect();
    const vWidth = window.innerWidth;
    const vHeight = window.innerHeight;

    const greenZones = calculateGreenZones(noRect, yesRect, vWidth, vHeight);
    const newPosition = getRandomPositionFromGreenZone(greenZones);

    if (newPosition) {
      setIsNoButtonFixed(true);
      setNoBtnPosition({
        position: "fixed",
        left: `${newPosition.left}px`,
        top: `${newPosition.top}px`,
        zIndex: "9999",
        transition: "all 0.3s ease-out",
      });
    }
  };

  const handleYesClick = () => {
    if (yesStage < 4) {
      setYesStage(yesStage + 1);
      setNoBtnPosition({ position: "relative" });
      setYesScale(1);
      setIsNoButtonFixed(false);
    }
  };

  useEffect(() => {
    if (yesStage === 4) triggerFireworks();
  }, [yesStage]);

  if (!proposalData) return <div className="loading">Loading...</div>;

  const isSuccess = yesStage === 4;

  // Render No button component
  const NoButton = () => (
    <button
      ref={noBtnRef}
      className="btn btn-no"
      style={noBtnPosition}
      onMouseEnter={handleNoInteraction}
      onClick={handleNoInteraction}
      onTouchStart={handleNoInteraction}
    >
      No
    </button>
  );

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
                <span className="warning-text">Are you sure?</span>
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

              {!isNoButtonFixed && <NoButton />}
            </div>
          </div>
        ) : (
          <div className="success-area">
            <h1 className="success-title">{proposalData.finalMessage}</h1>
            <p className="sub-text">❤️ I knew you'd say yes 😉 ! ❤️</p>
          </div>
        )}
      </div>

      {isNoButtonFixed && !isSuccess && <NoButton />}
    </div>
  );
};

export default ProposalPage;
