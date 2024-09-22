import { useCallback, useEffect, useRef, useState } from "react";

interface CaptchaProps {
  width?: number;
  height?: number;
  length?: number;
  fontSize?: number;
  bgColor?: string;
  textColor?: string | string[]; // Single color or array of colors
  noise?: boolean;
  noiseColor?: string;
  noiseDensity?: number; // Control the amount of noise
  lines?: boolean;
  lineColor?: string;
  lineWidth?: number;
  distortion?: boolean;
  distortionAmount?: number; // Control the amount of distortion
  onChange?: (captcha: string) => void;
  regenerate?: boolean; // Trigger regeneration when true
  charStyles?: { [key: number]: { size?: number; color?: string } }; // Individual styles for each character
}

const Captcha: React.FC<CaptchaProps> = ({
  width = 200,
  height = 40,
  length = 6,
  fontSize = 24,
  bgColor = "#ffffff",
  textColor = "#000000",
  noise = true,
  noiseColor = "#000000",
  noiseDensity = 0.05,
  lines = true,
  lineColor = "#222222",
  lineWidth = 1,
  distortion = true,
  distortionAmount = 4,
  charStyles = {},
  shouldCheckCaptcha = false,
  setShouldCheckCaptcha,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captchaText, setCaptchaText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const generateCaptcha = useCallback(() => {
    const charList = [];
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      charList.push(chars.charAt(Math.floor(Math.random() * chars.length)));
    }

    const newCharText = charList.join("");
    drawCaptcha(newCharText);
    // if (onChange) onChange(captchaText);

    setCaptchaText(newCharText);
  }, [length]);

  function drawCaptcha(text: string) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear previous content
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Draw distorted text with individual character styles
    text.split("").forEach((char, i) => {
      const x = (width / length) * i + fontSize / 2;
      const y = height / 2 + (Math.random() - 0.5) * 10;
      const angle = (Math.random() - 0.5) * 0.5; // Random angle for each letter
      const scale = 0.8 + Math.random() * 0.4; // Random scale for each letter
      const charStyle = charStyles[i] || {};
      const charFontSize = charStyle.size || fontSize;
      const charColor = Array.isArray(textColor)
        ? textColor[i % textColor.length]
        : textColor;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(scale, scale);
      ctx.font = `bold ${charFontSize}px sans-serif`;
      ctx.fillStyle = charStyle.color || charColor;
      ctx.fillText(char, 5, 5);
      ctx.restore();
    });

    // Add noise
    if (noise) {
      const noiseAmount = Math.floor(width * height * noiseDensity);
      for (let i = 0; i < noiseAmount; i++) {
        ctx.fillStyle = noiseColor;
        ctx.fillRect(
          Math.random() * width,
          Math.random() * height,
          Math.random() * 2,
          Math.random() * 2,
        );
      }
    }

    // Add lines
    if (lines) {
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.stroke();
      }
    }

    // Apply distortion
    if (distortion) {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const tempData = new Uint8ClampedArray(data.length);

      // Apply distortion
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;

          // Calculate distortion offsets
          const offsetX = Math.sin(y / 10) * distortionAmount;
          const offsetY = Math.cos(x / 10) * distortionAmount;

          // Calculate new coordinates
          const newX = Math.min(Math.max(x + offsetX, 0), width - 1);
          const newY = Math.min(Math.max(y + offsetY, 0), height - 1);

          const newIdx = (Math.floor(newY) * width + Math.floor(newX)) * 4;

          // Copy the pixel color from the distorted position
          tempData[idx] = data[newIdx];
          tempData[idx + 1] = data[newIdx + 1];
          tempData[idx + 2] = data[newIdx + 2];
          tempData[idx + 3] = data[newIdx + 3];
        }
      }

      // Put distorted image data back to canvas
      ctx.putImageData(new ImageData(tempData, width, height), 0, 0);
    }
  }

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  useEffect(() => {
    function checkCaptcha(text: string) {
      if (text.toLowerCase() === captchaText.toLowerCase()) {
        console.log("correct");
      } else {
        window.alert("incorrect");
      }
    }

    const inputText = inputRef.current?.value || "";
    
    if (shouldCheckCaptcha) {
      checkCaptcha(inputText);
      setShouldCheckCaptcha(false);
    }
  }, [shouldCheckCaptcha, captchaText, setShouldCheckCaptcha]);

  return (
    <div className="">
      <input
        ref={inputRef}
        type="text"
        name="captcha"
        placeholder="captcha"
        className="mb-4 block rounded border border-stone-500 p-1"
      />
      <div className="flex gap-2">
        <canvas ref={canvasRef} width={width} height={height}></canvas>
        <button
          type="button"
          className="rounded border border-blue-600 bg-blue-500 p-1 text-white hover:bg-blue-400 focus:bg-blue-600"
          onClick={generateCaptcha}
        >
          Refresh
        </button>
        {captchaText}
      </div>
    </div>
  );
};

export default Captcha;
