import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Plus, Save } from "lucide-react";
import { motion } from "framer-motion";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  created_at: string;
  mood?: string;
}

const JournalPanel = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setEntries(data);
  };

  const saveEntry = async () => {
    if (!content.trim()) return;
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("journal_entries").insert({
        user_id: user.id,
        title: title || "Untitled Entry",
        content,
      });

      if (error) throw error;

      toast({
        title: "Entry saved! 📝",
        description: "Your journal entry has been saved.",
      });

      setTitle("");
      setContent("");
      setIsWriting(false);
      loadEntries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full border-primary/20 bg-card/50 backdrop-blur-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Journal
          </CardTitle>
          <Button
            size="sm"
            onClick={() => setIsWriting(!isWriting)}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Entry
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isWriting ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-4"
          >
            <Input
              placeholder="Entry title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-primary/20 focus:border-primary"
            />
            <Textarea
              placeholder="How are you feeling today? Write your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] border-primary/20 focus:border-primary resize-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={saveEntry}
                disabled={loading || !content.trim()}
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsWriting(false);
                  setTitle("");
                  setContent("");
                }}
                className="border-primary/20"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="p-4 space-y-3">
              {entries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No entries yet. Start journaling!</p>
                </div>
              ) : (
                entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-lg border border-primary/20 bg-background/50 hover:bg-background/80 transition-colors"
                  >
                    <h4 className="font-semibold mb-1">{entry.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {entry.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default JournalPanel;