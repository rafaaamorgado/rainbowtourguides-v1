import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/lib/queryClient";
import type { Message, Conversation } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Send, Paperclip } from "lucide-react";

interface ChatThreadProps {
  conversationId: string;
}

export default function ChatThread({ conversationId }: ChatThreadProps) {
  const user = getUser();
  const [messageText, setMessageText] = useState("");

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["/api/conversations", conversationId, "messages"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      if (!user || !messageText.trim()) return;

      const response = await apiRequest("POST", `/api/conversations/${conversationId}/messages`, {
        senderId: user.id,
        text: messageText.trim(),
      });

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId, "messages"] });
      setMessageText("");
    },
  });

  const handleSend = () => {
    if (messageText.trim()) {
      sendMessageMutation.mutate();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-soft" data-testid="chat-thread">
      {/* Messages Area */}
      <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-neutral-50">
        {messages?.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <i className="fas fa-comments text-primary text-2xl"></i>
              </div>
              <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages?.map((msg) => {
            const isOwn = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`flex gap-3 ${isOwn ? "justify-end" : "justify-start"}`}>
                {/* Guide Avatar (left) */}
                {!isOwn && (
                  <img
                    src="https://i.pravatar.cc/40"
                    alt="Guide"
                    className="w-10 h-10 rounded-full border-2 border-border shrink-0"
                  />
                )}

                {/* Message Bubble */}
                <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                  <div
                    className={`rounded-2xl px-5 py-3 max-w-md shadow-soft ${
                      isOwn
                        ? "bg-primary text-white rounded-tr-sm"
                        : "bg-white border-2 border-border rounded-tl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 mx-2">
                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                  </span>
                </div>

                {/* User Avatar (right) */}
                {isOwn && (
                  <img
                    src={user?.avatarUrl || "https://i.pravatar.cc/40"}
                    alt="You"
                    className="w-10 h-10 rounded-full border-2 border-primary/20 shrink-0"
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Input Bar - Pill Shape */}
      <div className="border-t border-border p-4 bg-white">
        <div className="flex items-center gap-3">
          {/* Attachment Button */}
          <button
            className="w-10 h-10 shrink-0 rounded-full hover:bg-muted transition-brand flex items-center justify-center text-muted-foreground hover:text-foreground"
            aria-label="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Message Input - Pill Shaped */}
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full h-12 rounded-full px-5 pr-12 border-border bg-neutral-50"
              data-testid="textarea-message"
            />
          </div>

          {/* Send Button - Circular Icon */}
          <Button
            onClick={handleSend}
            disabled={!messageText.trim() || sendMessageMutation.isPending}
            className="w-12 h-12 shrink-0 rounded-full bg-primary hover:bg-primary/90 text-white p-0 shadow-soft transition-brand"
            data-testid="button-send-message"
          >
            {sendMessageMutation.isPending ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
