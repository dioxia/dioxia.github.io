/**
 * 
 * src/canvas/Canvas.js
 * 
 */

import React, { useEffect, useRef } from "react";

export const GameCanvas = ({ gameState, multiplier }) => {
  const canvasRef = useRef(null);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });

  // 1. Handle Canvas Resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) return;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      sizeRef.current = { width, height, dpr };
    };

    updateSize();

    const observer = new ResizeObserver(() => updateSize());
    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    return () => observer.disconnect();
  }, []);

  // 2. High-Frequency Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width, height, dpr } = sizeRef.current;

    if (width === 0 || height === 0) return;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const paddingLeft = 55;
    const paddingBottom = 40;
    const paddingTop = 30;
    const paddingRight = 30;

    const graphWidth = width - paddingLeft - paddingRight;
    const graphHeight = height - paddingBottom - paddingTop;

    const startX = paddingLeft;
    const startY = height - paddingBottom;

    const maxScale = Math.max(2.0, multiplier * 1.15);

    // Grid & Y-Axis Multiplier Labels
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#64748b";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "right";

    const ySteps = 4;
    for (let i = 0; i <= ySteps; i++) {
      const y = startY - (i / ySteps) * graphHeight;

      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(width - paddingRight, y);
      ctx.stroke();

      const stepVal = 1 + (i / ySteps) * (maxScale - 1);
      ctx.fillText(`${stepVal.toFixed(1)}x`, startX - 10, y + 4);
    }

    // Rising Curve
    const progressY = Math.min(1, (multiplier - 1) / (maxScale - 1));
    const progressX = Math.min(1, Math.log2(multiplier) / Math.log2(maxScale));

    const endX = startX + progressX * graphWidth;
    const endY = startY - progressY * graphHeight;

    const controlX = startX + (endX - startX) * 0.7;
    const controlY = startY;

    const isCrashed = gameState === "CRASHED";
    const strokeColor = isCrashed ? "#ef4444" : "#22c55e";

    if (gameState === "RUNNING" || gameState === "CRASHED") {
      const gradient = ctx.createLinearGradient(0, endY, 0, startY);
      gradient.addColorStop(0, isCrashed ? "rgba(239, 68, 68, 0.35)" : "rgba(34, 197, 94, 0.35)");
      gradient.addColorStop(1, "rgba(15, 23, 42, 0.0)");

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(controlX, controlY, endX, endY);
      ctx.lineTo(endX, startY);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(controlX, controlY, endX, endY);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(endX, endY, 6, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }, [gameState, multiplier]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />;
};
