
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";

interface StudyTimerProps {
  onTimeUpdate?: (seconds: number) => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({ onTimeUpdate }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => {
          const newSeconds = seconds + 1;
          onTimeUpdate?.(newSeconds);
          return newSeconds;
        });
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, onTimeUpdate]);

  const reset = () => {
    setSeconds(0);
    setIsActive(false);
    onTimeUpdate?.(0);
  };

  const toggle = () => {
    setIsActive(!isActive);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Clock className="h-5 w-5" />
          <span>Study Timer</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold font-mono text-blue-600">
            {formatTime(seconds)}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {isActive ? 'Studying...' : 'Ready to start'}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={toggle} 
            className="flex-1"
            variant={isActive ? "destructive" : "default"}
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
          
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
