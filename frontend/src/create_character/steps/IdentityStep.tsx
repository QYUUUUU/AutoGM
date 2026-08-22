import { Upload } from "lucide-react";
import HtmlStatsParser from "../utils/HtmlStatsParser";

export default function IdentityStep({ formData, updateField, originData, signData }: any) {
  const isFemme = formData.genre === 'femme';
  const avatars = Array.from({ length: isFemme ? 15 : 16 }, (_, i) => `/images/characters/${formData.genre}/${formData.genre}-${i + 1}.jpg`);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        updateField("imageData", evt.target?.result);
        updateField("avatar_preset", "");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="gods:space-y-8 gods:animate-in gods:fade-in gods:duration-500">
      
      {/* SECTION 1: Bases */}
      <section className="gods:grid gods:grid-cols-3 gods:gap-4">
        <div>
          <label className="gods:block gods:text-xs gods:tracking-[0.2em] gods:uppercase gods:text-foreground/50 gods:font-[family-name:var(--font-display)] gods:mb-2">Nom du personnage</label>
          <input type="text" value={formData.nom} onChange={e => updateField("nom", e.target.value)} 
            className="gods:w-full gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:px-4 gods:py-2.5 gods:text-foreground focus:gods:border-primary/50 gods:outline-none" placeholder="Ex: Arkos" />
        </div>
        <div>
          <label className="gods:block gods:text-xs gods:tracking-[0.2em] gods:uppercase gods:text-foreground/50 gods:font-[family-name:var(--font-display)] gods:mb-2">Âge</label>
          <input type="number" value={formData.age} onChange={e => updateField("age", e.target.value)} 
            className="gods:w-full gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:px-4 gods:py-2.5 gods:text-foreground focus:gods:border-primary/50 gods:outline-none" placeholder="Âge" />
        </div>
        <div>
          <label className="gods:block gods:text-xs gods:tracking-[0.2em] gods:uppercase gods:text-foreground/50 gods:font-[family-name:var(--font-display)] gods:mb-2">Genre</label>
          <select value={formData.genre} onChange={e => { updateField("genre", e.target.value); updateField("avatar_preset", `/images/characters/${e.target.value}/${e.target.value}-1.jpg`); }}
            className="gods:w-full gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:px-4 gods:py-2.5 gods:text-foreground focus:gods:border-primary/50 gods:outline-none">
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
          </select>
        </div>
      </section>

      {/* SECTION 2: Avatar */}
      <section className="gods:bg-card/20 gods:border gods:border-border gods:rounded-lg gods:p-6">
        <label className="gods:block gods:text-xs gods:tracking-[0.2em] gods:uppercase gods:text-foreground/50 gods:font-[family-name:var(--font-display)] gods:mb-4">Portrait</label>
        <div className="gods:flex gods:gap-8">
          <div className="gods:w-32 gods:shrink-0 gods:flex gods:flex-col gods:items-center gods:gap-4">
            <img src={formData.imageData || formData.avatar_preset} alt="Avatar" className="gods:w-32 gods:h-32 gods:object-cover gods:rounded-lg gods:border gods:border-border gods:shadow-md" />
            <label className="gods:w-full gods:cursor-pointer gods:flex gods:items-center gods:justify-center gods:gap-2 gods:px-3 gods:py-2 gods:bg-card gods:border gods:border-border hover:gods:border-primary/50 gods:text-foreground gods:rounded-md gods:text-xs gods:transition-colors">
              <Upload size={14} /> Importer
              <input type="file" accept="image/*" onChange={handleFileUpload} className="gods:hidden" />
            </label>
          </div>
          <div className="gods:flex-1 gods:flex gods:flex-wrap gods:gap-2 gods:content-start">
            {avatars.map(path => (
              <img key={path} src={path} alt="Preset" onClick={() => { updateField("avatar_preset", path); updateField("imageData", ""); }}
                className={`gods:w-12 gods:h-12 gods:object-cover gods:rounded gods:cursor-pointer gods:transition-all hover:gods:opacity-100 ${formData.avatar_preset === path && !formData.imageData ? "gods:border-2 gods:border-primary gods:scale-110 gods:opacity-100 gods:shadow-md" : "gods:border gods:border-transparent gods:opacity-50"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Signe & Origine */}
      <section className="gods:grid gods:grid-cols-2 gods:gap-6">
        {/* Signe */}
        <div className="gods:bg-card/20 gods:border gods:border-border gods:rounded-lg gods:p-6 gods:flex gods:flex-col">
          <label className="gods:block gods:text-xs gods:tracking-[0.2em] gods:uppercase gods:text-foreground/50 gods:font-[family-name:var(--font-display)] gods:mb-3">Signe Astrologique</label>
          <select value={formData.signeastro} onChange={e => updateField("signeastro", e.target.value)}
            className="gods:w-full gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:px-4 gods:py-2.5 gods:text-foreground focus:gods:border-primary/50 gods:outline-none gods:mb-6">
            {Object.keys(signData || {}).map(k => <option key={k} value={k}>{signData[k].title}</option>)}
          </select>
          {signData[formData.signeastro] && (
            <div className="gods:bg-card/40 gods:rounded-md gods:p-4 gods:border gods:border-border/50 gods:flex-1">
              <p className="gods:text-sm gods:text-warning gods:mb-2 gods:font-bold">Bonus : +1D en {signData[formData.signeastro].stat}</p>
              <p className="gods:text-sm gods:text-foreground/70 gods:leading-relaxed">{signData[formData.signeastro].text}</p>
            </div>
          )}
        </div>

        {/* Origine */}
        <div className="gods:bg-card/20 gods:border gods:border-border gods:rounded-lg gods:p-6">
          <label className="gods:block gods:text-xs gods:tracking-[0.2em] gods:uppercase gods:text-foreground/50 gods:font-[family-name:var(--font-display)] gods:mb-3">Origine</label>
          <select value={formData.origine} onChange={e => updateField("origine", e.target.value)}
            className="gods:w-full gods:bg-input-background gods:border gods:border-border gods:rounded-md gods:px-4 gods:py-2.5 gods:text-foreground focus:gods:border-primary/50 gods:outline-none gods:mb-6">
            {Object.keys(originData || {}).map(k => <option key={k} value={k}>{originData[k].title}</option>)}
          </select>
          
          {originData[formData.origine] && (
            <div className="gods:flex gods:gap-6">
              {/* Colonne de la bannière : 25% de l'espace (w-1/4) */}
              {originData[formData.origine].banner && (
                <div className="gods:w-1/4 gods:shrink-0">
                  <img 
                    src={originData[formData.origine].banner} 
                    alt="Bannière" 
                    className="gods:w-full gods:h-auto gods:object-contain gods:rounded-md gods:opacity-85" 
                  />
                </div>
              )}
              {/* Colonne du texte et des statistiques : 75% de l'espace restants */}
              <div className="gods:flex-1 gods:text-sm gods:text-foreground/70 gods:leading-relaxed">
                <p className="gods:mb-4" dangerouslySetInnerHTML={{ __html: originData[formData.origine].text }}></p>
                <HtmlStatsParser rawStats={originData[formData.origine].stats} formData={formData} updateField={updateField} />
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}