return (
  <div className="flex flex-col h-full bg-card/50 backdrop-blur-xl rounded-2xl border border-primary/20 overflow-hidden shadow-2xl shadow-primary/10">
    {/* Header */}
    <div className="p-4 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10">
      <h3 className="font-semibold text-lg">Chat with MoodEmoji</h3>
    </div>

    {/* 👇 3D Avatar section */}
    <div className="flex items-center justify-center bg-background/50 border-b border-primary/20">
      <div className="w-full h-64">
        <Avatar3D />
      </div>
    </div>

    {/* Chat messages */}
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.role === "user"
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-card border border-primary/20"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-card border border-primary/20 p-3 rounded-2xl flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>

    {/* Input area */}
    <div className="p-4 border-t border-primary/20 bg-card/80">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border-primary/20 focus:border-primary bg-background/50"
          disabled={loading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/30"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  </div>
);
