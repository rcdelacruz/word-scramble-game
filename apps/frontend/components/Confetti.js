import { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from '../hooks/useWindowSize';

export default function Confetti({ active, duration = 3000, onComplete }) {
  const [isActive, setIsActive] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (active) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
        if (onComplete) onComplete();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [active, duration, onComplete]);

  if (!isActive) return null;

  return (
    <ReactConfetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={200}
      gravity={0.2}
      colors={['#6366f1', '#a855f7', '#0ea5e9', '#10b981', '#f59e0b']}
    />
  );
}
