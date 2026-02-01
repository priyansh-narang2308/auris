import { useUsage } from "@/app/contexts/usage-context";
import { useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ChatMessage {
  id: number;
  content: string;
  isBot: boolean;
  timeStamp: Date;
}

interface UseChatCoreOptions {
  apiEndpoint: string;
  getRequestBody: (input: string) => any;
}

export function useChatCore({
  apiEndpoint,
  getRequestBody,
}: UseChatCoreOptions) {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { canChat, incrementChatUsage } = useUsage();

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) {
      return;
    }

    if (!canChat) {
      return;
    }

    setShowSuggestions(false);
    setIsLoading(true);

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      content: chatInput,
      isBot: false,
      timeStamp: new Date(),
    };

    // note:Take the prev mess as well
    setMessages([...messages, newMessage]);

    const currInput = chatInput;
    setChatInput("");

    try {
      const responsee = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(getRequestBody(currInput)),
      });

      const data = await responsee.json();

      if (responsee.ok) {
        await incrementChatUsage();

        const botMessage: ChatMessage = {
          id: messages.length + 2,
          content: data.answer || data.response,
          isBot: true,
          timeStamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        if (data.upgradeRequired) {
          const upgradeMessage: ChatMessage = {
            id: messages.length + 2,
            content: `${data.error} Visit the Pricing page to upgrade your plan and continue chatting!`,
            isBot: true,
            timeStamp: new Date(),
          };
          setMessages((prev) => [...prev, upgradeMessage]);
        } else {
          const errorMessage: ChatMessage = {
            id: messages.length + 2,
            content:
              data.error || "Sorry, I encountered an error. Please try again.",
            isBot: true,
            timeStamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      }
    } catch (error) {
      console.error("chat error:", error);
      const errorMessage: ChatMessage = {
        id: messages.length + 2,
        content:
          "Sorry, I could not connect to the server. please check your connection and try again.",
        isBot: true,
        timeStamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // To show the suggestions
  const handleSuggestionClick = (suggestion: string) => {
    if (!canChat) {
      return;
    }

    setChatInput(suggestion);
  };

  const handleInputChange = (value: string) => {
    setChatInput(value);
  };

  return {
    chatInput,
    setChatInput,
    messages,
    setMessages,
    showSuggestions,
    setShowSuggestions,
    isLoading,
    setIsLoading,
    handleSendMessage,
    handleSuggestionClick,
    handleInputChange,
    canChat,
  };
}
