import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Palette } from "lucide-react";
import Avatar3D from "./Avatar3D";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AvatarCustomization {
  skinTone: string;
  eyeColor: string;
  hairStyle: string;
  hairColor: string;
  clothingColor: string;
}

const skinTones = [
  { name: "Light", value: "#f5d5b8" },
  { name: "Medium", value: "#d4a574" },
  { name: "Tan", value: "#c4905c" },
  { name: "Dark", value: "#8d5524" },
];

const eyeColors = [
  { name: "Blue", value: "#4a90e2" },
  { name: "Green", value: "#50c878" },
  { name: "Brown", value: "#8b4513" },
  { name: "Hazel", value: "#8e7618" },
];

const hairStyles = [
  { name: "Short", value: "short" },
  { name: "Long", value: "long" },
];

const hairColors = [
  { name: "Black", value: "#1a1a1a" },
  { name: "Brown", value: "#4a3728" },
  { name: "Blonde", value: "#faf0be" },
  { name: "Red", value: "#8b2e1f" },
  { name: "Purple", value: "#b794f6" },
  { name: "Blue", value: "#4fd1c5" },
];

const clothingColors = [
  { name: "Purple", value: "#b794f6" },
  { name: "Cyan", value: "#4fd1c5" },
  { name: "Pink", value: "#f687b3" },
  { name: "Blue", value: "#667eea" },
  { name: "Green", value: "#48bb78" },
];

interface AvatarCustomizerProps {
  currentCustomization?: AvatarCustomization;
  onSave?: (customization: AvatarCustomization) => void;
}

export default function AvatarCustomizer({ 
  currentCustomization,
  onSave 
}: AvatarCustomizerProps) {
  const [open, setOpen] = useState(false);
  const [customization, setCustomization] = useState<AvatarCustomization>({
    skinTone: "#f5d5b8",
    eyeColor: "#4a90e2",
    hairStyle: "short",
    hairColor: "#4a3728",
    clothingColor: "#667eea",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (currentCustomization) {
      setCustomization(currentCustomization);
    }
  }, [currentCustomization]);

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save customization",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ avatar_customization: customization as any })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success! 🎨",
        description: "Your avatar has been customized",
      });
      
      onSave?.(customization);
      setOpen(false);
    } catch (error) {
      console.error("Error saving customization:", error);
      toast({
        title: "Error",
        description: "Failed to save customization",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full border-primary/20 hover:bg-primary/10"
        >
          <Palette className="w-4 h-4 mr-2" />
          Customize Avatar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Customize Your Companion
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Preview */}
          <div className="space-y-4">
            <Label className="text-lg">Preview</Label>
            <div className="h-96 rounded-xl border border-primary/20 bg-background/50 backdrop-blur-xl overflow-hidden">
              <Avatar3D 
                mood="happy" 
                isSpeaking={false}
                customization={customization}
              />
            </div>
          </div>

          {/* Customization Options */}
          <div className="space-y-6">
            {/* Skin Tone */}
            <div className="space-y-3">
              <Label className="text-base">Skin Tone</Label>
              <RadioGroup 
                value={customization.skinTone}
                onValueChange={(value) => setCustomization(prev => ({ ...prev, skinTone: value }))}
              >
                <div className="grid grid-cols-2 gap-2">
                  {skinTones.map((tone) => (
                    <div key={tone.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={tone.value} id={`skin-${tone.value}`} />
                      <Label htmlFor={`skin-${tone.value}`} className="flex items-center gap-2 cursor-pointer">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-primary/20" 
                          style={{ backgroundColor: tone.value }}
                        />
                        {tone.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Eye Color */}
            <div className="space-y-3">
              <Label className="text-base">Eye Color</Label>
              <RadioGroup 
                value={customization.eyeColor}
                onValueChange={(value) => setCustomization(prev => ({ ...prev, eyeColor: value }))}
              >
                <div className="grid grid-cols-2 gap-2">
                  {eyeColors.map((color) => (
                    <div key={color.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={color.value} id={`eye-${color.value}`} />
                      <Label htmlFor={`eye-${color.value}`} className="flex items-center gap-2 cursor-pointer">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-primary/20" 
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Hair Style */}
            <div className="space-y-3">
              <Label className="text-base">Hair Style</Label>
              <RadioGroup 
                value={customization.hairStyle}
                onValueChange={(value) => setCustomization(prev => ({ ...prev, hairStyle: value }))}
              >
                <div className="flex gap-4">
                  {hairStyles.map((style) => (
                    <div key={style.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={style.value} id={`hair-style-${style.value}`} />
                      <Label htmlFor={`hair-style-${style.value}`} className="cursor-pointer">
                        {style.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Hair Color */}
            <div className="space-y-3">
              <Label className="text-base">Hair Color</Label>
              <RadioGroup 
                value={customization.hairColor}
                onValueChange={(value) => setCustomization(prev => ({ ...prev, hairColor: value }))}
              >
                <div className="grid grid-cols-2 gap-2">
                  {hairColors.map((color) => (
                    <div key={color.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={color.value} id={`hair-${color.value}`} />
                      <Label htmlFor={`hair-${color.value}`} className="flex items-center gap-2 cursor-pointer">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-primary/20" 
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Clothing Color */}
            <div className="space-y-3">
              <Label className="text-base">Clothing Color</Label>
              <RadioGroup 
                value={customization.clothingColor}
                onValueChange={(value) => setCustomization(prev => ({ ...prev, clothingColor: value }))}
              >
                <div className="grid grid-cols-2 gap-2">
                  {clothingColors.map((color) => (
                    <div key={color.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={color.value} id={`clothing-${color.value}`} />
                      <Label htmlFor={`clothing-${color.value}`} className="flex items-center gap-2 cursor-pointer">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-primary/20" 
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <Button 
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/30"
            >
              Save Customization
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
