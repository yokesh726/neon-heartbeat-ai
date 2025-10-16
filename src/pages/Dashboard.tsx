import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import Avatar from "@/components/Avatar";
import ChatInterface from "@/components/ChatInterface";
import MoodDashboard from "@/components/MoodDashboard";
import JournalPanel from "@/components/JournalPanel";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentMood, setCurrentMood] = useState("neutral");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleMoodDetected = (mood: string) => {
    setCurrentMood(mood);
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              MoodEmoji
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.email?.split("@")[0]}! 💜
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleSignOut}
            className="border-primary/20 hover:bg-primary/10"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar & Mood Dashboard */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-card/50 backdrop-blur-xl rounded-2xl border border-primary/20 p-6 shadow-2xl shadow-primary/10">
              <Avatar mood={currentMood} isSpeaking={isSpeaking} />
            </div>
            <MoodDashboard />
          </motion.div>

          {/* Center Column - Chat Interface */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="h-[700px]"
          >
            <ChatInterface onMoodDetected={handleMoodDetected} />
          </motion.div>

          {/* Right Column - Journal */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="h-[700px]"
          >
            <JournalPanel />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;