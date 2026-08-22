import { useEffect, useMemo } from "react";

export default function HtmlStatsParser({ rawStats, formData, updateField }: any) {
  // 1. Extraction sécurisée des données SANS utiliser de Hooks dans des boucles
  const parsedData = useMemo(() => {
    if (!rawStats) return { skills: [], advantages: [], disadvantages: [], instincts: [], rawParts: [] };
    
    const parts = rawStats.split('<br><br>');
    const skills: string[] = [];
    const advantages: {name: string, desc: string}[] = [];
    const disadvantages: {name: string, desc: string}[] = [];
    const instincts: {name: string, desc: string}[] = [];

    parts.forEach((part: string) => {
      if (part.includes('<b>Compétence de Débutant bonus')) {
        const match = part.match(/<b>Compétence de Débutant bonus\s*:\s*<\/b>(.*)/s);
        if (match) {
          const skillsStr = match[1].split('(')[0].trim();
          skills.push(...skillsStr.split(/ou/i).map(s => s.trim()));
        }
      }
      if (part.includes('<b>Avantage')) {
        const match = part.match(/<b>Avantage(?:\s+|&nbsp;|&#160;|\u2013|-)*([^\:]+)\s*:\s*<\/b>(.*)/s);
        if (match) advantages.push({ name: match[1].trim().replace(/^[-–—]\s*/, ''), desc: match[2] });
      }
      if (part.includes('<b>Désavantage')) {
        const match = part.match(/<b>Désavantage(?:\s+|&nbsp;|&#160;|\u2013|-)*([^\:]+)\s*:\s*<\/b>(.*)/s);
        if (match) disadvantages.push({ name: match[1].trim().replace(/^[-–—]\s*/, ''), desc: match[2] });
      }
      if (part.includes("<b>Capacité d'Instinct")) {
        const match = part.match(/<b>Capacité d'Instinct(?:\s+|&nbsp;|&#160;|\u2013|-)*([^\:]+)\s*:\s*<\/b>(.*)/s);
        if (match) instincts.push({ name: match[1].trim().replace(/^[-–—]\s*/, ''), desc: match[2] });
      }
    });

    return { skills, advantages, disadvantages, instincts, rawParts: parts };
  }, [rawStats]);

  // 2. Application propre des valeurs par défaut au montage
  useEffect(() => {
    if (parsedData.skills.length > 0 && (!formData.origin_bonus_skill || formData.origin_bonus_skill === "none")) {
      updateField("origin_bonus_skill", parsedData.skills[0]);
    }
    if (parsedData.instincts.length > 0 && (!formData.instinct_capacite || formData.instinct_capacite === "none")) {
      updateField("instinct_capacite", parsedData.instincts[0].name);
    }
  }, [rawStats]);

  if (!rawStats) return null;

  return (
    <div className="gods:text-sm">
      
      {/* ── Compétence de Débutant ── */}
      {parsedData.skills.length > 0 && (
        <div className="gods:mt-6 gods:bg-card/40 gods:border gods:border-border gods:rounded-md gods:p-4">
          <strong className="gods:text-primary gods:font-[family-name:var(--font-display)] gods:tracking-wide">Compétence de Débutant bonus :</strong>
          <div className="gods:flex gods:gap-4 gods:mt-3">
            {parsedData.skills.map(skill => (
              <label key={skill} className="gods:flex gods:items-center gods:gap-2 gods:cursor-pointer gods:group">
                <div className={`gods:w-4 gods:h-4 gods:rounded-full gods:border ${formData.origin_bonus_skill === skill ? "gods:border-primary gods:bg-primary" : "gods:border-foreground/30 group-hover:gods:border-primary/50"}`} />
                <input type="radio" name="origin_bonus_skill" value={skill} checked={formData.origin_bonus_skill === skill} onChange={(e) => updateField("origin_bonus_skill", e.target.value)} className="gods:hidden" />
                <span className="gods:text-foreground/90">{skill}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── Avantages ── */}
      {parsedData.advantages.length > 0 && (
        <div className="gods:mt-6 gods:mb-3">
          <strong className="gods:text-[#2A6B52] gods:font-[family-name:var(--font-display)] gods:tracking-wide">Avantage (Un maximum) :</strong>
          <label className="gods:flex gods:items-center gods:gap-3 gods:mt-3 gods:cursor-pointer gods:group gods:bg-card/20 gods:p-3 gods:rounded-md gods:border gods:border-border hover:gods:bg-card/40">
            <div className={`gods:w-4 gods:h-4 gods:rounded-full gods:border ${formData.origin_advantage === "none" ? "gods:border-[#2A6B52] gods:bg-[#2A6B52]" : "gods:border-foreground/30 group-hover:gods:border-[#2A6B52]/50"}`} />
            <input type="radio" name="origin_advantage" value="none" checked={formData.origin_advantage === "none"} onChange={() => updateField("origin_advantage", "none")} className="gods:hidden" />
            <i className="gods:text-foreground/50">Aucun Avantage</i>
          </label>
          {parsedData.advantages.map(adv => (
            <label key={`adv-${adv.name}`} className="gods:flex gods:items-start gods:gap-3 gods:mt-2 gods:cursor-pointer gods:group gods:bg-card/20 gods:p-3 gods:rounded-md gods:border gods:border-border hover:gods:bg-card/40 gods:transition-colors">
              <div className={`gods:shrink-0 gods:mt-0.5 gods:w-4 gods:h-4 gods:rounded-full gods:border ${formData.origin_advantage === adv.name ? "gods:border-[#2A6B52] gods:bg-[#2A6B52]" : "gods:border-foreground/30 group-hover:gods:border-[#2A6B52]/50"}`} />
              <input type="radio" name="origin_advantage" value={adv.name} checked={formData.origin_advantage === adv.name} onChange={(e) => updateField("origin_advantage", e.target.value)} className="gods:hidden" />
              <span className="gods:text-foreground/80"><b className="gods:text-foreground">{adv.name} :</b> {adv.desc.replace(/<[^>]*>?/gm, '')}</span>
            </label>
          ))}
        </div>
      )}

      {/* ── Désavantages ── */}
      {parsedData.disadvantages.length > 0 && (
        <div className="gods:mt-6 gods:mb-3">
          <strong className="gods:text-destructive gods:font-[family-name:var(--font-display)] gods:tracking-wide">Désavantage (Un maximum) :</strong>
          <label className="gods:flex gods:items-center gods:gap-3 gods:mt-3 gods:cursor-pointer gods:group gods:bg-card/20 gods:p-3 gods:rounded-md gods:border gods:border-border hover:gods:bg-card/40">
            <div className={`gods:w-4 gods:h-4 gods:rounded-full gods:border ${formData.origin_disadvantage === "none" ? "gods:border-destructive gods:bg-destructive" : "gods:border-foreground/30 group-hover:gods:border-destructive/50"}`} />
            <input type="radio" name="origin_disadvantage" value="none" checked={formData.origin_disadvantage === "none"} onChange={() => updateField("origin_disadvantage", "none")} className="gods:hidden" />
            <i className="gods:text-foreground/50">Aucun Désavantage</i>
          </label>
          {parsedData.disadvantages.map(dis => (
            <label key={`dis-${dis.name}`} className="gods:flex gods:items-start gods:gap-3 gods:mt-2 gods:cursor-pointer gods:group gods:bg-card/20 gods:p-3 gods:rounded-md gods:border gods:border-border hover:gods:bg-card/40 gods:transition-colors">
              <div className={`gods:shrink-0 gods:mt-0.5 gods:w-4 gods:h-4 gods:rounded-full gods:border ${formData.origin_disadvantage === dis.name ? "gods:border-destructive gods:bg-destructive" : "gods:border-foreground/30 group-hover:gods:border-destructive/50"}`} />
              <input type="radio" name="origin_disadvantage" value={dis.name} checked={formData.origin_disadvantage === dis.name} onChange={(e) => updateField("origin_disadvantage", e.target.value)} className="gods:hidden" />
              <span className="gods:text-foreground/80"><b className="gods:text-foreground">{dis.name} :</b> {dis.desc.replace(/<[^>]*>?/gm, '')}</span>
            </label>
          ))}
        </div>
      )}

      {/* ── Capacités d'Instinct ── */}
      {parsedData.instincts.length > 0 && (
        <div className="gods:mt-6 gods:mb-3">
          <strong className="gods:text-primary gods:font-[family-name:var(--font-display)] gods:tracking-wide">Capacité d'Instinct :</strong>
          {parsedData.instincts.map(inst => (
            <label key={`inst-${inst.name}`} className="gods:flex gods:items-start gods:gap-3 gods:mt-3 gods:cursor-pointer gods:group gods:bg-card/20 gods:p-3 gods:rounded-md gods:border gods:border-border hover:gods:bg-card/40 gods:transition-colors">
              <div className={`gods:shrink-0 gods:mt-0.5 gods:w-4 gods:h-4 gods:rounded-full gods:border ${formData.instinct_capacite === inst.name ? "gods:border-primary gods:bg-primary" : "gods:border-foreground/30 group-hover:gods:border-primary/50"}`} />
              <input type="radio" name="instinct_capacite" value={inst.name} checked={formData.instinct_capacite === inst.name} onChange={(e) => updateField("instinct_capacite", e.target.value)} className="gods:hidden" />
              <span className="gods:text-foreground/80"><b className="gods:text-foreground">{inst.name} :</b> {inst.desc.replace(/<[^>]*>?/gm, '')}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}