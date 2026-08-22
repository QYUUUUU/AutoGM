import { useState, useRef, useEffect, FormEvent } from "react";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
}

export default function InteractionsTab({ character }: { character: any }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Bonjour, posez-moi vos questions sur les règles du jeu GODS !", time: getCurrentTime() }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  }

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || input.length > 1200 || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage, time: getCurrentTime() }]);
    setIsLoading(true);

    try {
      const res = await fetch("/backend/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: userMessage, 
          conversationId: character.conversationId || null 
        }),
      });
      
      if (!res.ok) throw new Error("Erreur serveur");
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: "assistant", content: data.output, time: getCurrentTime() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Désolé, une erreur s'est produite lors de la communication avec l'assistant.", time: getCurrentTime() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gods:h-full gods:flex gods:flex-col gods:bg-background">
      <div className="gods:px-4 gods:py-3 gods:border-b gods:border-border">
        {/* Base layer applies font-display automatically to h2 */}
        <h2 className="gods:text-xl gods:tracking-wider gods:text-foreground">
          Assistant des Règles
        </h2>
      </div>

      <div className="gods:flex-1 gods:overflow-y-auto gods:p-4 gods:space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`gods:flex ${msg.role === "user" ? "gods:justify-end" : "gods:justify-start"}`}>
            <div className={`gods:max-w-[75%] gods:rounded-lg gods:p-3 ${
              msg.role === "user" 
                ? "gods:bg-primary/20 gods:border gods:border-primary/30 gods:text-foreground" 
                : "gods:bg-card gods:border gods:border-border gods:text-foreground"
            }`}>
              <div 
                className="gods:text-base gods:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, "<br>") }} 
              />
              <div className={`gods:text-xs gods:tracking-widest gods:uppercase gods:mt-2 ${msg.role === "user" ? "gods:text-primary gods:text-right" : "gods:text-muted-foreground"}`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="gods:flex gods:justify-start">
            <div className="gods:bg-card gods:border gods:border-border gods:rounded-lg gods:p-3 gods:text-muted-foreground gods:flex gods:gap-1">
              <span className="gods:animate-bounce">.</span>
              <span className="gods:animate-bounce gods:delay-100">.</span>
              <span className="gods:animate-bounce gods:delay-200">.</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="gods:p-4 gods:border-t gods:border-border">
        <div className="gods:flex gods:items-center gods:gap-2 gods:bg-input-background gods:border gods:border-border gods:rounded-full gods:pr-2 gods:pl-4 gods:py-1">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Posez vos questions sur les règles..."
            className="gods:flex-1 gods:bg-transparent gods:border-none gods:outline-none gods:text-base gods:text-foreground gods:py-2 gods:placeholder:text-muted-foreground"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="gods:w-10 gods:h-10 gods:rounded-full gods:bg-primary gods:text-primary-foreground gods:flex gods:items-center gods:justify-center gods:hover:bg-primary/85 gods:disabled:opacity-50 gods:disabled:cursor-not-allowed gods:transition-colors"
          >
            <Send size={16} className="gods:-ml-0.5" />
          </button>
        </div>
      </form>
    </div>
  );
}