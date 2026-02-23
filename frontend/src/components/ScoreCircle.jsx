import { useEffect, useState } from "react";

const ScoreCircle = ({ score = 0 }) => {
  const [progress, setProgress] = useState(0);

  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // 🎨 Dynamic Color Logic
  let progressColor = "#16a34a"; // default green

  if (score < 40) {
    progressColor = "#dc2626"; // red-600
  } else if (score < 60) {
    progressColor = "#f97316"; // orange-500
  }

  useEffect(() => {
    let start = 0;
    const duration = 900;
    const increment = score / (duration / 16);

    const animate = setInterval(() => {
      start += increment;
      if (start >= score) {
        start = score;
        clearInterval(animate);
      }
      setProgress(start);
    }, 16);

    return () => clearInterval(animate);
  }, [score]);

  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
        <p className="text-black/60 text-sm">Total Score</p>
      <div className="relative">
        
        <svg width={size} height={size}>
          {/* Background Circle */}
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />

          {/* Progress Circle */}
          <circle
            stroke={progressColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.3s ease" }}
            r={radius}
            cx={size / 2}
            cy={size / 2}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>

        {/* Score Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-2xl md:text-3xl font-bold"
            style={{ color: progressColor }}
          >
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <p className="text-black/60">
        {score < 40
          ? "Needs Improvement"
          : score < 60
          ? "Good Effort"
          : "Excellent Work"}
      </p>
    </div>
  );
};

export default ScoreCircle;
