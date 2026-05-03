"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MapPin, Route, Send, Sparkles, X } from "lucide-react";
import SilverMessageContent from "@/components/SilverMessageContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

type SilverApiResponse = {
  reply?: string;
  error?: string;
};

type SilverChatPanelProps = {
  open: boolean;
  onClose: () => void;
};

const SUGGESTIONS = [
  "Plan a 3-day NBA road trip",
  "Find arenas near me",
  "Best West Coast arena route",
];

const STARTER_MESSAGE: Message = {
  id: "starter-assistant",
  role: "assistant",
  content:
    "Hey, I’m Silver. Ask me to plan an NBA road trip, find nearby arenas, or compare teams and venues.",
};

export default function SilverChatPanel({
  open,
  onClose,
}: SilverChatPanelProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([STARTER_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messageIdRef = useRef(0);

  const suggestionChips = useMemo(() => SUGGESTIONS, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timeoutId = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 180);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timeoutId);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  const sendMessage = async (rawMessage: string) => {
    const message = rawMessage.trim();

    if (!message || isLoading) {
      return;
    }

    messageIdRef.current += 1;
    const userId = messageIdRef.current;

    const userMessage: Message = {
      id: `user-${userId}`,
      role: "user",
      content: message,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");

    setIsLoading(true);

    try {
      const response = await fetch("/api/silver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = (await response.json()) as SilverApiResponse;

      messageIdRef.current += 1;
      const assistantId = messageIdRef.current;

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${assistantId}`,
          role: "assistant",
          content:
            data.reply ||
            data.error ||
            "Silver AI could not generate a response.",
        },
      ]);
    } catch {
      messageIdRef.current += 1;
      const assistantId = messageIdRef.current;

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${assistantId}`,
          role: "assistant",
          content:
            "Silver AI could not reach the server. Check your connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    await sendMessage(input);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close Silver AI chat"
            className="fixed inset-0 z-[84] bg-black/60 backdrop-blur-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.section
            aria-label="Silver AI chat panel"
            className="fixed inset-x-0 bottom-0 z-[85] mx-auto flex h-[66vh] max-h-[760px] w-full max-w-6xl flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,12,20,0.98)_0%,rgba(6,10,18,0.98)_100%)] shadow-[0_-32px_120px_rgba(0,0,0,0.6)]"
            initial={{ y: "100%", opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.9 }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
          >
            <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-white/12" />

            <header className="border-b border-white/8 px-5 pb-4 pt-4 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
                      <Bot className="h-5 w-5 text-cyan-300" aria-hidden="true" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold tracking-tight text-white">
                          Silver AI
                        </h2>
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
                          Online
                        </span>
                      </div>
                      <p className="mt-1 max-w-2xl text-sm text-zinc-400">
                        Plan NBA road trips, compare arenas, and find games near
                        you.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 rounded-xl border border-white/8 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6"
            >
              <div className="flex flex-wrap gap-2">
                {suggestionChips.map((suggestion, index) => {
                  const icons = [Route, MapPin, Sparkles] as const;
                  const Icon = icons[index] ?? Sparkles;

                  return (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        void sendMessage(suggestion);
                      }}
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-white"
                    >
                      <Icon className="h-3.5 w-3.5 text-cyan-300" />
                      <span>{suggestion}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[88%] rounded-2xl border px-4 py-3 text-sm leading-6 shadow-lg sm:max-w-[75%]",
                        message.role === "user"
                          ? "border-cyan-400/20 bg-[linear-gradient(135deg,rgba(34,211,238,0.18)_0%,rgba(59,130,246,0.2)_100%)] text-white shadow-cyan-900/20"
                          : "border-white/8 bg-white/[0.04] text-zinc-100 shadow-black/20"
                      )}
                    >
                      {message.role === "assistant" ? (
                        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300/85">
                          <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                          Silver
                        </div>
                      ) : null}
                      {message.role === "assistant" ? (
                        <SilverMessageContent content={message.content} />
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading ? (
                  <div className="flex justify-start">
                    <div className="max-w-[88%] rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-zinc-100 shadow-lg shadow-black/20 sm:max-w-[75%]">
                      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300/85">
                        <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                        Silver
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300/80" />
                        <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300/60 [animation-delay:120ms]" />
                        <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300/40 [animation-delay:240ms]" />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="border-t border-white/8 bg-black/15 px-5 pb-5 pt-4 sm:px-6">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-2 shadow-inner shadow-black/10">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Silver about NBA trips, arenas, games…"
                  disabled={isLoading}
                  className="h-12 flex-1 rounded-xl border-0 bg-transparent px-3 text-white placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                />

                <Button
                  type="button"
                  onClick={() => {
                    void handleSubmit();
                  }}
                  disabled={!input.trim() || isLoading}
                  className="h-12 rounded-xl bg-[linear-gradient(135deg,#8b5cf6_0%,#2563eb_50%,#06b6d4_100%)] px-4 text-white shadow-[0_10px_30px_rgba(37,99,235,0.28)] hover:opacity-95"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">
                    {isLoading ? "Sending..." : "Send"}
                  </span>
                </Button>
              </div>
            </div>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}
