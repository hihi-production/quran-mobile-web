import { useState } from "react";
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

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement actual audio play/pause logic
  };

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-white/20 rounded-t-xl">
      <CardContent className="p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={progress}
            onValueChange={setProgress}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0:00</span>
            <span>--:--</span>
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