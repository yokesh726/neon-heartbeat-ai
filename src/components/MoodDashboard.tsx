import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Smile, Frown, Zap, Heart, Coffee } from "lucide-react";
import { motion } from "framer-motion";

interface MoodLog {
  mood: string;
  created_at: string;
}

const moodIcons: any = {
  happy: { icon: Smile, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  sad: { icon: Frown, color: "text-blue-400", bg: "bg-blue-400/10" },
  excited: { icon: Zap, color: "text-accent", bg: "bg-accent/10" },
  calm: { icon: Heart, color: "text-secondary", bg: "bg-secondary/10" },
  neutral: { icon: Coffee, color: "text-primary", bg: "bg-primary/10" },
};

const MoodDashboard = () => {
  const [currentMood, setCurrentMood] = useState<string>("neutral");
  const [moodHistory, setMoodHistory] = useState<MoodLog[]>([]);

  useEffect(() => {
    loadMoodData();
  }, []);

  const loadMoodData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("mood_logs")
      .select("mood, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data && data.length > 0) {
      setCurrentMood(data[0].mood);
      setMoodHistory(data);
    }
  };

  const getMoodStats = () => {
    const moodCount: any = {};
    moodHistory.forEach((log) => {
      moodCount[log.mood] = (moodCount[log.mood] || 0) + 1;
    });
    return Object.entries(moodCount).sort((a: any, b: any) => b[1] - a[1]);
  };

  const stats = getMoodStats();
  const currentMoodConfig = moodIcons[currentMood] || moodIcons.neutral;
  const Icon = currentMoodConfig.icon;

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-card/50 backdrop-blur-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="text-lg">Current Mood</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <motion.div
            key={currentMood}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className={`w-20 h-20 rounded-full ${currentMoodConfig.bg} flex items-center justify-center border border-primary/20`}>
              <Icon className={`w-10 h-10 ${currentMoodConfig.color}`} />
            </div>
            <p className={`text-xl font-semibold ${currentMoodConfig.color} capitalize`}>
              {currentMood}
            </p>
          </motion.div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-card/50 backdrop-blur-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="text-lg">Mood Trends</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {stats.map(([mood, count]: any, index) => {
              const moodConfig = moodIcons[mood] || moodIcons.neutral;
              const MoodIcon = moodConfig.icon;
              const percentage = (count / moodHistory.length) * 100;

              return (
                <motion.div
                  key={mood}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-8 h-8 rounded-full ${moodConfig.bg} flex items-center justify-center`}>
                    <MoodIcon className={`w-4 h-4 ${moodConfig.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm capitalize">{mood}</span>
                      <span className="text-sm text-muted-foreground">{Math.round(percentage)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${moodConfig.color.replace('text-', 'from-')}`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodDashboard;