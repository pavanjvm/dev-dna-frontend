
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DailyUpdate } from "@/components/dev-dna-client";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

const parseDailyUpdates = (responseText: string, timestamp: string): DailyUpdate[] => {
    const updates: DailyUpdate[] = [];
    const dateMatch = responseText.match(/On (.*?20\d{2})/);
    const date = dateMatch ? new Date(dateMatch[1]).toISOString().split('T')[0] : new Date(timestamp).toISOString().split('T')[0];

    const sections = responseText.split(/\d+\.\s+\*\*/).slice(1);

    sections.forEach(section => {
        const nameMatch = section.match(/(.*?)\*\*:/);
        if (nameMatch) {
            const developerName = nameMatch[1].trim();
            const update = section.replace(/(.*?)\*\*:/, '').trim();
            updates.push({ developerName, update, date });
        }
    });

    return updates;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (messages.length) {
      setTimeout(() => {
        const scrollableViewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollableViewport) {
          scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
        }
      }, 100);
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: "pavan", message: input }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        let errorMessage = "Failed to get response from bot.";
        try {
            // Try to parse as JSON, backend might send structured error
            const parsedError = JSON.parse(errorData);
            errorMessage = parsedError.error || parsedError.message || errorData;
        } catch (e) {
            // If not JSON, use the raw text
            errorMessage = errorData;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (result.response && result.response.includes("daily updates")) {
          const dailyUpdates = parseDailyUpdates(result.response, result.timestamp);
          if (dailyUpdates.length > 0) {
              const event = new CustomEvent('dailyUpdatesReceived', { detail: dailyUpdates });
              window.dispatchEvent(event);
          }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.response,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessageText = error instanceof Error ? error.message : "Sorry, something went wrong.";
       toast({
        variant: "destructive",
        title: "Chatbot Error",
        description: errorMessageText,
      });
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${errorMessageText}`,
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="fixed bottom-8 right-8 rounded-full w-16 h-16 shadow-lg">
          <MessageSquare className="w-8 h-8" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bot />
            AI Assistant
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow my-4" ref={scrollAreaRef}>
          <div className="space-y-4 pr-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Ask me anything about your project!</p>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.sender === "bot" && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "p-3 rounded-lg max-w-[80%]",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
                 {message.sender === "user" && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                  <div className="p-3 rounded-lg bg-muted flex items-center">
                    <p className="text-sm text-muted-foreground">Thinking...</p>
                  </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-2 border-t pt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
