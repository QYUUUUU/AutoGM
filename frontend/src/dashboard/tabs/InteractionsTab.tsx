import { useState, useRef, useEffect, FormEvent } from "react";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="gods:text-xs gods:tracking-widest gods:uppercase gods:text-primary gods:font-display">
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="gods:text-3xl gods:tracking-wider gods:uppercase gods:text-foreground gods:mt-2 gods:mb-8">
      {children}
    </h2>
  );
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
    <div className="gods:h-full gods:overflow-y-auto gods:p-6 gods:lg:p-12 gods:bg-background gods:relative gods:z-10">
      <div className="gods:max-w-4xl gods:mx-auto gods:h-full gods:flex gods:flex-col">
        <div className="gods:mb-6">
          <SectionLabel>Oracle</SectionLabel>
          <SectionTitle>Assistant des Règles</SectionTitle>
        </div>

        <div className="gods:flex-1 gods:overflow-y-auto gods:pr-4 gods:space-y-6 gods:mb-6">
          {messages.map((msg, i) => (
            <div key={i} className={`gods:flex ${msg.role === "user" ? "gods:justify-end" : "gods:justify-start"}`}>
              <div className={`gods:max-w-[80%] gods:rounded-lg gods:p-5 gods:border ${
                msg.role === "user" 
                  ? "gods:bg-primary/5 gods:border-primary/20 gods:text-foreground" 
                  : "gods:bg-card gods:border-border gods:text-foreground"
              }`}>
                <div 
                  className="gods:text-base gods:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, "<br>") }} 
                />
                <div className={`gods:text-xs gods:font-display gods:tracking-widest gods:uppercase gods:mt-3 ${msg.role === "user" ? "gods:text-primary gods:text-right" : "gods:text-muted-foreground"}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="gods:flex gods:justify-start">
              <div className="gods:bg-card gods:border gods:border-border gods:rounded-lg gods:p-5 gods:text-muted-foreground gods:flex gods:gap-1">
                <span className="gods:animate-bounce">.</span>
                <span className="gods:animate-bounce gods:delay-100">.</span>
                <span className="gods:animate-bounce gods:delay-200">.</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="gods:shrink-0">
          <div className="gods:flex gods:items-center gods:gap-3 gods:bg-card gods:border gods:border-border hover:gods:border-primary/40 gods:transition-colors gods:rounded-full gods:pr-2 gods:pl-6 gods:py-1.5 gods:shadow-sm">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Invoquez l'assistant..."
              className="gods:flex-1 gods:bg-transparent gods:border-none gods:outline-none gods:text-base gods:text-foreground gods:py-2 gods:placeholder:text-muted-foreground"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="gods:w-11 gods:h-11 gods:rounded-full gods:bg-primary gods:text-primary-foreground gods:flex gods:items-center gods:justify-center hover:gods:bg-primary/85 gods:disabled:opacity-50 gods:disabled:cursor-not-allowed gods:transition-all !gods:outline-none"
            >
              <Send size={18} className="gods:-ml-0.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}