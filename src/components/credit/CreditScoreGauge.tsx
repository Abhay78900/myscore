import React from 'react';
import { motion } from 'framer-motion';

interface CreditScoreGaugeProps {
  score: number;
  size?: number;
  showLabel?: boolean;
}

const CreditScoreGauge: React.FC<CreditScoreGaugeProps> = ({ score, size = 200, showLabel = true }) => {
  const maxScore = 900;
  const minScore = 300;
  const normalizedScore = Math.max(minScore, Math.min(maxScore, score));
  const percentage = ((normalizedScore - minScore) / (maxScore - minScore)) * 100;
  
  const getScoreColor = () => {
    if (score >= 750) return '#10b981'; // Excellent - green
    if (score >= 700) return '#0d9488'; // Very Good - teal
    if (score >= 650) return '#14b8a6'; // Good - teal light
    if (score >= 550) return '#f59e0b'; // Average - amber
    return '#ef4444'; // Poor - red
  };

  const getScoreCategory = () => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Very Good';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Average';
    return 'Poor';
  };

  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75; // 270 degree arc
  const center = size / 2;

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-[135deg]">
        {/* Background arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
        />
        {/* Score arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={getScoreColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="font-display text-4xl font-bold"
          style={{ color: getScoreColor() }}
        >
          {score}
        </motion.span>
        {showLabel && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm font-medium text-muted-foreground mt-1"
          >
            out of 900
          </motion.span>
        )}
      </div>
      
      {/* Category badge */}
      {showLabel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-3 px-4 py-1.5 rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: getScoreColor() }}
        >
          {getScoreCategory()}
        </motion.div>
      )}
    </div>
  );
};

export default CreditScoreGauge;
