import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function AvatarCustomization() {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for Ready Player Me avatar creation events
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.source === 'readyplayerme') {
        const { eventName, data } = event.data;
        
        if (eventName === 'v1.avatar.exported') {
          console.log('Avatar created successfully:', data.url);
          // TODO: Save avatar URL to user profile
          // For now, just log it
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="border-primary/20 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Avatar Customization
            </h1>
            <p className="text-muted-foreground mt-1">
              Create your personalized 3D avatar
            </p>
          </div>
        </div>

        {/* Ready Player Me Builder */}
        <div className="rounded-[20px] overflow-hidden border-2 border-primary/20 bg-card shadow-lg shadow-primary/10">
          <iframe
            src="https://moodmoji.readyplayer.me/avatar?frameApi"
            allow="camera *; microphone *; clipboard-write"
            style={{
              width: '100%',
              height: '650px',
              border: 'none',
              display: 'block',
            }}
            title="Ready Player Me Avatar Builder"
          />
        </div>

        {/* Info Card */}
        <div className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-2 text-primary">How to use</h3>
          <ol className="space-y-2 text-muted-foreground">
            <li>1. Customize your avatar using the builder above</li>
            <li>2. Click "Next" when you're done</li>
            <li>3. Your avatar will be saved automatically</li>
            <li>4. Return to the dashboard to see your new avatar in action</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
