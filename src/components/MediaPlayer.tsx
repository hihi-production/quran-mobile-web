import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, X, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface MediaPlayerProps {
  surahName: string;
  arabicName: string;
  audioUrl?: string;
  onClose: () => void;
}

const MediaPlayer = ({ surahName, arabicName, audioUrl, onClose }: MediaPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([0]);
  const [volume, setVolume] = useState([80]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Create audio element
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    // Set volume
    audio.volume = volume[0] / 100;
    
    // Event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress([0]);
      setCurrentTime(0);
    });
    
    // Clean up
    return () => {
      audio.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      audio.remove();
    };
  }, [audioUrl]);

  // Update volume when slider changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      audioRef.current.play();
      animationRef.current = requestAnimationFrame(updateProgress);
    }
    
    setIsPlaying(!isPlaying);
  };

  const updateProgress = () => {
    if (!audioRef.current) return;
    
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    
    setCurrentTime(currentTime);
    setProgress([Math.floor((currentTime / duration) * 100)]);
    
    animationRef.current = requestAnimationFrame(updateProgress);
  };

  const handleProgressChange = (value: number[]) => {
    if (!audioRef.current || !duration) return;
    
    const newTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(value);
    setCurrentTime(newTime);
  };

  // Format time in mm:ss
  const formatTime = (time: number) => {
    if (!time) return "0:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-white/20 rounded-t-xl">
      <CardContent className="p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={progress}
            onValueChange={(value) => handleProgressChange(value)}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Player Content */}
        <div className="flex items-center gap-4">
          {/* Surah Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{surahName}</h3>
            <p className="text-sm text-muted-foreground truncate" dir="rtl">{arabicName}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="default" 
              size="sm" 
              className="h-10 w-10 p-0 rounded-full"
              onClick={handlePlayPause}
              disabled={!audioUrl}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume & Close */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-16"
              />
            </div>
            
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaPlayer;