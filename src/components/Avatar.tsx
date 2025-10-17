import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Avatar3D from "./Avatar3D";
import AvatarCustomizer from "./AvatarCustomizer";
import { supabase } from "@/integrations/supabase/client";

interface AvatarProps {
  mood?: string;
  isSpeaking?: boolean;
}

interface AvatarCustomization {
  skinTone: string;
  eyeColor: string;
  hairStyle: string;
  hairColor: string;
  clothingColor: string;
}

const Avatar = ({ mood = "neutral", isSpeaking = false }: AvatarProps) => {
  const [customization, setCustomization] = useState<AvatarCustomization | undefined>();

  useEffect(() => {
    loadCustomization();
  }, []);

  const loadCustomization = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_customization")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      if (data?.avatar_customization && typeof data.avatar_customization === 'object') {
        setCustomization(data.avatar_customization as unknown as AvatarCustomization);
      }
    } catch (error) {
      console.error("Error loading customization:", error);
    }
  };

  const handleCustomizationSave = (newCustomization: AvatarCustomization) => {
    setCustomization(newCustomization);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="relative w-full"
        animate={{
          scale: isSpeaking ? [1, 1.02, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          repeat: isSpeaking ? Infinity : 0,
        }}
      >
        <div className="w-full h-64 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-lg border-2 border-primary/30 shadow-2xl overflow-hidden">
          <Avatar3D 
            mood={mood} 
            isSpeaking={isSpeaking}
            customization={customization}
          />
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-2xl -z-10 animate-glow-pulse" />
        
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

      <div className="text-center space-y-3 w-full">
        <p className="text-sm text-muted-foreground">
          Feeling <span className="font-semibold text-primary">{mood}</span>
        </p>
        <AvatarCustomizer 
          currentCustomization={customization}
          onSave={handleCustomizationSave}
        />
      </div>
    </div>
  );
};

export default Avatar;