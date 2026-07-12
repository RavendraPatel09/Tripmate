"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User as UserIcon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  id: "1",
  role: "assistant",
  content: "Hi! I'm TripMate's AI assistant. Tell me where you want to go, your budget, and how many days you have, and I'll generate a custom itinerary for you!\n\nFor example: 'I have ₹15,000 and 5 days. Suggest a trip from Bhopal.'",
};

const MOCK_RESPONSE: Message = {
  id: "mock",
  role: "assistant",
  content: "Based on your budget of ₹15,000 and 5 days from Bhopal, I highly recommend a trip to **Ujjain and Indore**.\n\n### Budget Breakdown\n- **Transport:** ₹1,500 (Bus/Train)\n- **Accommodation:** ₹5,000 (3-star hotels)\n- **Food:** ₹4,000 (Street food + decent cafes)\n- **Activities:** ₹2,500\n- **Emergency:** ₹2,000\n\n### Itinerary\n**Day 1:** Arrival in Ujjain. Visit Mahakaleshwar Temple and Ram Ghat.\n**Day 2:** Explore Kaal Bhairav and Sandipani Ashram. Evening bus to Indore.\n**Day 3:** Indore Food Tour! Sarafa Bazaar at night is a must.\n**Day 4:** Day trip to Mandu (ruined city with beautiful architecture).\n**Day 5:** Shopping at Rajwada and departure.\n\nWould you like me to book any hotels for this trip?",
};

export default function AIGeneratorPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Mock API delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { ...MOCK_RESPONSE, id: (Date.now() + 1).toString() }]);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/20 p-2 rounded-lg">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Trip Builder</h1>
          <p className="text-sm text-muted-foreground">Chat with your personal travel assistant.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border shadow-sm">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="flex flex-col gap-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <Avatar className="h-10 w-10 border shadow-sm">
                    {msg.role === "assistant" ? (
                      <>
                        <AvatarImage src="/bot-avatar.png" />
                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20} /></AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                        <AvatarFallback><UserIcon size={20} /></AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-3.5 whitespace-pre-wrap text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted rounded-tl-sm border"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 flex-row"
              >
                <Avatar className="h-10 w-10 border shadow-sm">
                  <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20} /></AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl rounded-tl-sm border px-5 py-4 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 bg-background border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your trip..."
              className="flex-1 rounded-full px-6 h-12 bg-muted/50 border-transparent focus-visible:ring-primary"
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="h-12 w-12 rounded-full shadow-md"
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <div className="mt-2 text-center text-xs text-muted-foreground">
            AI can make mistakes. Verify important information.
          </div>
        </div>
      </Card>
    </div>
  );
}
