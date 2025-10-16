import { motion } from "framer-motion";
import { Smile, Frown, Heart, Zap, Coffee } from "lucide-react";

interface AvatarProps {
  mood?: string;
  isSpeaking?: boolean;
}

const moodEmojis = {
  happy: { icon: Smile, color: "text-yellow-400", glow: "shadow-yellow-400/50" },
  sad: { icon: Frown, color: "text-blue-400", glow: "shadow-blue-400/50" },
  excited: { icon: Zap, color: "text-accent", glow: "shadow-accent/50" },
  calm: { icon: Heart, color: "text-secondary", glow: "shadow-secondary/50" },
  neutral: { icon: Coffee, color: "text-primary", glow: "shadow-primary/50" },
};

const Avatar = ({ mood = "neutral", isSpeaking = false }: AvatarProps) => {
  const currentMood = moodEmojis[mood as keyof typeof moodEmojis] || moodEmojis.neutral;
  const Icon = currentMood.icon;

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="relative"
        animate={{
          scale: isSpeaking ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          repeat: isSpeaking ? Infinity : 0,
        }}
      >
        <div className={`w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-lg border-2 border-primary/30 flex items-center justify-center ${currentMood.glow} shadow-2xl`}>
          <motion.div
            animate={{
              rotate: isSpeaking ? [0, 5, -5, 0] : 0,
            }}
            transition={{
              duration: 0.5,
              repeat: isSpeaking ? Infinity : 0,
            }}
          >
            <Icon className={`w-24 h-24 ${currentMood.color}`} />
          </motion.div>
        </div>
        
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-full bg-primary/20 blur-2xl -z-10 animate-glow-pulse`} />
        
        {/* Speaking indicator */}
        {isSpeaking && (
          <motion.div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay,
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Feeling <span className={`font-semibold ${currentMood.color}`}>{mood}</span>
        </p>
      </div>
    </div>
  );
};

export default Avatar;