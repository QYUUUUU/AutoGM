import { ScrollText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Panel } from "./ui";

interface Props {
  entries: string[];
}

interface RollResult {
  id: number;
  character: string;
  initial: string;
  color: string;
  characteristic: string | null;
  timestamp: string;
  rawHtml: string;
  avatarUrl: string;
}

// Composant de repli pour l'avatar en cas de lien brisé ou manquant
function AvatarImage({ src, fallback, color, className }: { src: string; fallback: string; color: string; className: string }) {
  const [error, setError] = useState(false);
  
  if (error || !src) {
    return (
      <div 
        className={`gods:flex gods:items-center gods:justify-center gods:text-xs gods:font-bold gods:shrink-0 gods:font-[family-name:var(--font-display)] ${className}`}
        style={{ backgroundColor: color, color: "#F6F2EC" }}
      >
        {fallback}
      </div>
    );
  }
  return <img src={src} alt="Avatar" onError={() => setError(true)} className={`gods:object-cover gods:object-top gods:shrink-0 ${className}`} />;
}

export function CombatLog({ entries }: Props) {
  return (
    <Panel
      title="Activité"
      icon={<ScrollText size={14} />}
      className="gods:h-[100%]"
    >
      <div className="gods:h-[200px] gods:overflow-y-auto gods:space-y-1 gods:pr-1">
        {entries.length ? (
          [...entries]
            .reverse()
            .map((entry, index) => (
              <div
                key={`${index}-${entry}`}
                className={
                  index === 0
                    ? "gods:rounded gods:bg-primary/[.06] gods:border gods:border-primary/10 gods:px-2 gods:py-1.5 gods:text-[15px] gods:text-foreground/80"
                    : "gods:px-2 gods:py-0.5 gods:text-[14px] gods:text-foreground/45"
                }
              >
                {entry}
              </div>
            ))
        ) : (
          <span className="gods:text-[10px] gods:text-foreground/25">
            Les jets et résolutions apparaîtront
            ici.
          </span>
        )}
      </div>
    </Panel>
  );
}

export function PlayerRollHistory({ groupeId }: { groupeId?: number | null }) {
  const [results, setResults] = useState<RollResult[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  const getAvatar = (char: any) => {
    if (char && char.avatar && char.avatar.trim() !== "") return char.avatar;
    const genrePath = char?.genre || "homme";
    return `/images/characters/${genrePath}/${genrePath}-1.jpg`;
  };

  const formatBackendRoll = (r: any): RollResult => {
    let rawContent = r.content || "";
    let color = "#9A7818";
    const metaMatch = rawContent.match(/<!--meta:(.*?)-->/);
    
    if (metaMatch) {
      try { color = JSON.parse(metaMatch[1]).color || color; } catch(e){}
      rawContent = rawContent.replace(metaMatch[0], '');
    }
    
    return {
      id: r.id,
      character: r.Character?.nom || "Inconnu",
      initial: (r.Character?.nom || "?").charAt(0).toUpperCase(),
      avatarUrl: getAvatar(r.Character),
      color,
      characteristic: (r.caracteristic && r.competence) ? `${r.caracteristic} / ${r.competence}` : null,
      timestamp: r.createdAt
        ? new Date(r.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
        : "—",
      rawHtml: rawContent
    };
  };

  // 1. Fetching de l'historique et écoute du flux SSE
  useEffect(() => {
    let evtSource: EventSource | null = null;
    
    const fetchHistory = async () => {
      const url = groupeId ? `/fetch/rolls?groupe_id=${groupeId}` : '/fetch/rolls';
      try {
        const res = await fetch(url, { method: 'PUT' });
        const data = await res.json();
        if (Array.isArray(data)) {
          setResults(data.map(formatBackendRoll));
        }
      } catch (e) {
        console.error("Erreur récupération historique des dés", e);
      }
    };

    const connectSSE = () => {
      const sseUrl = groupeId ? `/stream/rolls?groupe_id=${groupeId}` : '/stream/rolls';
      evtSource = new EventSource(sseUrl);
      
      evtSource.onmessage = (e) => {
        try {
          const newRolls = JSON.parse(e.data);
          setResults(prev => {
            const existingIds = new Set(prev.map(r => r.id));
            const unique = newRolls.filter((r: any) => !existingIds.has(r.id));
            return [...prev, ...unique.map(formatBackendRoll)];
          });
        } catch (err) {
          console.error("Erreur parsing SSE dés", err);
        }
      };
    };

    fetchHistory().then(connectSSE);

    return () => {
      if (evtSource) evtSource.close();
    };
  }, [groupeId]);

  // 2. Auto-scroll pour toujours voir le dernier jet
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [results]);

  return (
    <Panel
      title="Jets des joueurs"
      className="gods:h-full gods:min-h-0 gods:flex gods:flex-col"
      contentClassName="gods:min-h-0 gods:flex-1 gods:flex gods:flex-col"
    >
      <div className="dice-results gods:min-h-0 gods:flex-1 gods:flex gods:flex-col gods:overflow-hidden gods:border gods:border-border gods:rounded gods:bg-card/15">
        <div 
          ref={chatRef}
          className="body-card gods:min-h-0 gods:flex-1 gods:overflow-y-auto gods:p-3 gods:space-y-4"
        >
          {results.length === 0 && (
            <div className="gods:text-center gods:text-xs gods:text-foreground/40 gods:italic gods:mt-6">
              Aucun jet enregistré pour le moment.
            </div>
          )}
          
          {results.map((result) => (
            <div key={result.id} className="gods:flex gods:gap-2.5 gods:group">
              
              <AvatarImage
                src={result.avatarUrl}
                fallback={result.initial}
                color={result.color}
                className="gods:w-7 gods:h-7 gods:rounded-full gods:border"
              />

              <div className="gods:flex-1 gods:min-w-0">
                <div className="gods:flex gods:items-baseline gods:gap-2 gods:mb-0.5 gods:flex-wrap">
                  <span className="gods:font-[family-name:var(--font-display)] gods:text-sm gods:tracking-wide gods:text-foreground/90">
                    {result.character}
                  </span>
                  
                  {result.characteristic && (
                     <span className="gods:text-[10px] gods:text-primary/70 gods:font-medium">
                       ({result.characteristic})
                     </span>
                  )}
                  
                  <span className="gods:text-[10px] gods:text-foreground/40">
                    {result.timestamp}
                  </span>
                </div>

                <div 
                  className="gods:bg-card/60 gods:border gods:border-border/60 gods:rounded-md gods:px-2.5 gods:py-2 gods:inline-block gods:max-w-full gods:text-sm gods:text-foreground/80 gods:shadow-sm"
                  dangerouslySetInnerHTML={{
                    __html: (() => {
                      const html = result.rawHtml || "";
                      
                      // Isole et protège les 10 naturels sur les d10
                      const markedD10 = html.replace(
                        /(d10\s*:\s*)([^|<]*?)(?=\||<|$)/gi,
                        (_match, prefix, values) => {
                          return prefix + values.replace(/\b10\b/g, "__GOLD_D10_10__");
                        }
                      );
                      
                      // Rendu des chiffres basiques
                      const darkNumbers = markedD10.replace(
                        /\b\d+\b/g,
                        (number) => `<strong style="color: inherit; font-weight: 600;">${number}</strong>`
                      );
                      
                      // Restaure le doré pour les 10 sur les d10
                      return darkNumbers.replace(
                        /__GOLD_D10_10__/g,
                        '<strong style="color:#C9A227; font-weight: 700;">10</strong>'
                      );
                    })()
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}