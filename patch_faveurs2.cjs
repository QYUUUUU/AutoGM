const fs = require('fs');

const faveursObj = {
  "Faveurs de la Mort": {
    "Décret de mort (Accord)": "L’Élu peut pointer du doigt une personne qu’il voit dans un rayon de [Volonté de l’Élu x 5] mètres et la condamner à mort. S’il possède la compétence Occultisme au niveau Apprenti (ou dépense 1D d’Humanité), il lance 1d10 + Volonté + Occultisme en opposition avec la cible sur le tableau des Séquelles. Le nombre de réussites indique le nombre de blessures infligées (1 = Légère, 3 = Grave).",
    "Emprise de la mort (Rencontre)": "Un nombre de fois par jour égal à sa Volonté, l’Élu peut tenter de soumettre une créature morte-vivante qu’il voit (jet Volonté + Relationnel Difficile 7). S'il réussit, le cadavre animé passe sous son contrôle permanent.",
    "Flétrissement (Entente)": "Une fois par jour, l’Élu peut flétrir tous les végétaux dans un rayon de [Volonté x 10] mètres autour de lui. S’il a atteint l’Accord et que sa Jauge de Divinité est pleine, la terre elle-même sera stérile durant 1d10 ans.",
    "In carcerem (Accord)": "L’Élu peut emprisonner l’âme d’une personne qu’il vient de tuer personnellement dans l’un de ses yeux ou dans le propre corps de la victime. L'âme souffre atrocement et sera détruite au bout de 1d10 jours. L'élu bénéficie d'une compétence de la victime au niveau Confirmé. Utilisable [Volonté] fois/jour.",
    "Infertilité (Rencontre)": "Une fois par jour, l’Élu peut toucher une personne qui deviendra définitivement infertile. Sur un Élu, requiert l'Accord, Jauge Divinité pleine, et un jet opposé (Difficile 7, coûte 1D Humanité).",
    "Nécrognosie (Entente)": "En mangeant un morceau de chair de cadavre, l’Élu a accès à toutes les spécialisations du défunt durant [Volonté] heures (+1D bonus), voire une compétence au niveau Confirmé s'il a 5D en Divinité. 1 fois/jour.",
    "Putréfaction (Entente)": "Une fois par jour, au toucher (jet d'attaque), l'Élu inflige une terrible maladie de Virulence 8. La cible subit chaque jour deux Blessures Légères tant que non guérie.",
    "Sceau de la non-mort (Accord)": "L’Élu dépense 1D d’Humanité et marque un être vivant du sceau de la non-mort. S'il meurt, son âme est emprisonnée dans son corps et il continue à se mouvoir durant 10 jours (ou indéfiniment si Divinité pleine).",
    "Thanatomnésie (Rencontre)": "Un nombre de fois par jour égal à sa Connaissance, l’Élu peut choisir n’importe quelle compétence qu'il possède alors au niveau Expert le temps d’un seul et unique jet."
  },
  "Faveurs du Soleil (Mineures)": {
    "Déjà-vu (Rencontre)": "Une fois par jour, l’Élu peut annuler un jet et le refaire (sauf si capacité d'Éclat, rituel ou Divinité utilisés).",
    "L’œil exercé (Rencontre)": "L’Élu gagne un bonus de +1D sur ses jets de Perception.",
    "Nature véritable (Rencontre)": "L’Élu reconnaît automatiquement les contrefaçons (objets ou documents).",
    "Nul n’échappe à ses rayons (Entente)": "Une fois par jour, l’Élu sait quand une personne connue a été touchée par le soleil pour la dernière fois, sa direction et sa distance (difficulté variable selon la météo).",
    "Salutation au soleil (Entente)": "Une fois par jour, en méditant 10 min devant le lever du soleil, l’Élu regagne 1D de Divinité."
  },
  "Faveurs du Soleil (Majeures)": {
    "Aura éclatante (Accord)": "Une fois par jour, l’Élu brille (1 heure, [Volonté x 5] m). Malus de -2D aux créatures de la nuit attaquant l'Élu (ou subissent Blessures Légères si Divinité>=5D). Annule toute dissimulation.",
    "Aura impérieuse (Rencontre)": "Une fois par jour, durant [Volonté] tours. Inflige un malus de -1D aux assaillants. +1D sur les jets de Volonté de l'Élu.",
    "Il guide ma main (Accord)": "De jour, l’Élu remporte toutes les égalités d'esquive/parade contre lui. Si l'ennemi ne peut parer/esquiver, +1 dommage.",
    "Sincérité (Entente)": "Il est impossible de mentir ouvertement à l’Élu (mensonge par omission reste possible). L'Élu l'active et désactive à volonté.",
    "Sous sa protection (Accord)": "De jour, dépensez 1D d'Humanité pour ignorer une Blessure Grave reçue (+2D/supplémentaire). Utilisable 1 fois par tour.",
    "Sous son jugement (Accord)": "Comme Sincérité, mais un mensonge par omission inflige une Blessure Légère. Les menteurs surnaturels doivent réussir un jet Très Difficile (9) avec Handicap (I) ou subir la blessure.",
    "Souveraineté (Entente)": "(Prérequis : Aura impérieuse) +2D aux jets pour résister aux effets négatifs (manipulation/mensonge). Immunité peur/contrôle mental, vision totale dans le noir. Dure 10 min, 1/jour."
  },
  "Faveurs de la Terre (Mineures)": {
    "Aplomb (Entente)": "La Réserve de Sang-Froid augmente de +2D de façon permanente.",
    "Endurance de la Terre (Rencontre)": "L’Élu gagne un cercle de Blessure Légère supplémentaire.",
    "Impassibilité (Rencontre)": "Une fois par jour, l’Élu peut régénérer 2D dans sa Réserve de Sang-Froid.",
    "Résilience de la pierre (Entente)": "Le seuil de Blessures Légères de l’Élu augmente de 1.",
    "Sens de la terre (Rencontre)": "En dépensant 1D Sang-Froid, ressentez minéraux/métaux identiques dans une zone en réussissant un jet (Perception + Artisanat). Quantité et direction estimables."
  },
  "Faveurs de la Terre (Majeures)": {
    "Chair de granite (Accord)": "La peau possède un indice de protection 2 (ne se cumule pas aux armures). L'Élu peut dépenser 1D Humanité (IP 3) ou 1D Humanité+Divinité (IP 4).",
    "Emprunter à la terre (Rencontre)": "Une fois par jour, en contact avec le sol, passez 1 tour immobile pour rétrograder une Blessure (Légère, Grave à l'Accord, Mortelle si Divinité pleine).",
    "Éperon rocheux (Accord)": "([Volonté / 2] fois/j) Fait jaillir un pic sous un adversaire dans [Puissance x 2] m. Très difficile à esquiver (9). 9 dgts perforants. 1D Humanité pour 2ème cible.",
    "Façonner la pierre (Entente)": "L’Élu peut façonner la pierre brute comme de la glaise (+1D Artisanat sculpture). Possibilité de créer des armes de pierre.",
    "Immobilité de la pierre (Accord)": "1 fois/j. Transformé en pierre pdnt 1h max. Insensible au feu/poison/noyade/mort lente, incapable de bouger. Résistance pure = Volonté."
  },
  "Faveurs de la Vie (Mineures)": {
    "Adepte de la Vie (Rencontre)": "L’Élu gagne un bonus de +1D sur ses jets de Faune et de Flore.",
    "Diagnostique (Rencontre)": "Connaissance médicale exacte au toucher (blessures, seuils, poisons... ou grossesse).",
    "Égratignure (Rencontre)": "1 fois/jour, dépensez des dés d'Effort plutôt que subir la blessure (2D Effort = Légère. 4D Effort = Grave (Entente), 6D Effort = Mortelle (Accord)).",
    "Régénération volontaire (Entente)": "Guerison de plusieurs blessures après un repos long possible (via Effort/Sang-Froid). Autorise la repousse d'organes/membres amputés au fil des heures.",
    "Soin du corps et de l’esprit (Entente)": "Gagnez +1D Effort supp (ou +2D si Accord) en réussissant un jet de soin restaurant de l'Effort.",
    "Stabilisation (Rencontre)": "Soin d'urgence automatique en dépensant 1D d'Humanité.",
    "Toucher guérisseur (Rencontre)": "+1D bonus aux soins (+ relance si Entente, -1 difficulté si Accord)."
  },
  "Faveurs de la Vie (Majeures)": {
    "Anesthésie (Accord)": "1 fois/j. Ignorer malus de blessures (Nb tours = Volonté). Empêche sombrer inconscient pour Blessure Mortelle si 1 case libre.",
    "Bannir la blessure (Accord)": "1 fois/j, guérissez au toucher (pas soi-même) : Légère (gratuit), Grave (1D Humanité), Mortelle (si Divinité>=5D + 1D Humanité).",
    "Cercle de grâce (Accord)": "1 fois/j, 1D Humanité. Cercle sol 5m pdnt 4h : ceux à l'intérieur ne subissent aucun dommage des combats y ayant lieu.",
    "Fertilité (Entente)": "Au toucher (+ 1D Humanité), restaure la fertilité ou refait fleurir un champ dans [Volonté x 10] m.",
    "Immunité (Entente)": "Immunité totale aux poisons, venins, maladies et infections (non magiques).",
    "Pérennité (Accord)": "Cesse de vieillir (ou retrouve apparence jeune).",
    "Régénération d’autrui (Entente)": "Toucher pour repousser un membre/organe (1D Humanité + réusite Difficile 7). Prend qq jours.",
    "Rejet de la mort (Rencontre)": "1D Humanité pour se stabiliser automatiquement (même inconscient).",
    "Sacrifice (Accord)": "Explosion de vie ! Ressuscite tous les êtres récents dans [Volonté x 25] m. La vie et l'Éclat de l'Élu sont détruits à jamais.",
    "Toucher neutralisant (Entente)": "Élimine 2 pts Virgulence pour chaque réussite en jet de soin (+3 si Accord + Divinité>=5D).",
    "Végétalisation (Accord)": "1 fois/jour (1 dgt Léger + 1D Humanité) fait pousser des plantes en 1 mn dans [Volonté x 5] m."
  }
};

let htmlContent = `{% extends 'layouts/base.html.twig' %}

{% block stylesheets %}
    {{ parent() }}
    <link rel="stylesheet" href="/css/dashboard.css">
{% endblock %}

{% block body %}
<div class="bg-slideshow">
    <div class="bg-slide img1"></div>
    <div class="bg-slide img2"></div>
    <div class="bg-slide img3"></div>
    <div class="bg-slide img4"></div>
</div>

<div class="container mt-5 text-white p-4" style="background-color: rgba(0,0,0,0.8); border-radius: 10px; border: 1px solid rgba(255,215,0,0.3); position: relative; z-index: 1;">
    <h1 class="mb-4 text-center" style="font-family: 'Cinzel', serif; color: var(--god-gold); text-transform: uppercase;">Les Faveurs Divines</h1>
    
    <div class="mb-5 text-muted" style="font-size: 1.1rem; text-align: center; border-bottom: 1px solid rgba(255,215,0,0.2); padding-bottom: 20px;">
        <p>Les Dieux accordent des dons inestimables à leurs fidèles les plus dévoués et à leurs Élus.<br>
        Découvrez ici la liste des Faveurs accessibles, et liez-les à vos Âmes depuis cette page.</p>
    </div>

    `;

for (const [domaine, faveurs] of Object.entries(faveursObj)) {
    htmlContent += `<h3 class="mt-4 mb-3" style="color: #fff; font-family: 'Cinzel', serif;"><i class="fas fa-hand-holding-medical"></i> ${domaine}</h3>
    <div class="row">`;
    for (const [name, desc] of Object.entries(faveurs)) {
        htmlContent += `
        <div class="col-md-6 mb-3">
            <div class="card h-100" style="background-color: rgba(20,20,20,0.9); border: 1px solid rgba(255,215,0,0.4);">
                <div class="card-header d-flex justify-content-between align-items-center" style="background-color: rgba(255,215,0,0.1); border-bottom: 1px solid rgba(255,215,0,0.2); font-weight: bold; color: var(--god-gold);">
                    <span class="faveur-title">${name}</span>
                    <button class="btn btn-sm btn-outline-warning" onclick="openFaveurModal('${name.replace(/'/g, "\\'").replace(/"/g, "&quot;")}')">
                        <i class="fas fa-plus"></i> Accorder
                    </button>
                </div>
                <div class="card-body">
                    <p class="card-text text-light" style="font-size:0.95rem;">${desc}</p>
                </div>
            </div>
        </div>`;
    }
    htmlContent += `</div><br>`;
}

htmlContent += `
</div>

<!-- Modal for granting Faveur -->
<div class="modal fade" id="faveurModal" tabindex="-1" aria-labelledby="faveurModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content" style="background-color: rgba(20,20,20,0.95); border: 1px solid var(--god-gold);">
      <div class="modal-header" style="border-bottom: 1px solid rgba(255,215,0,0.2);">
        <h5 class="modal-title" id="faveurModalLabel" style="color: var(--god-gold); font-family: 'Cinzel', serif;">Accorder une Faveur</h5>
        <button type="button" class="close text-white" data-bs-dismiss="modal" aria-label="Close" onclick="closeFaveurModal()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body text-white">
        <p>Sélectionnez un Élu pour lui offrir la Faveur : <br><strong style="color:#ffdb58;"><span id="faveurNameDisplay"></span></strong></p>
        <select class="form-control mb-3" id="characterSelect" style="background-color: #222; color: #fff; border: 1px solid #555;">
          {% for char in characters %}
          <option value="{{ char.id_Character }}">{{ char.nom }}</option>
          {% endfor %}
        </select>
      </div>
      <div class="modal-footer" style="border-top: 1px solid rgba(255,215,0,0.2);">
        <button type="button" class="btn btn-secondary" onclick="closeFaveurModal()">Annuler</button>
        <button type="button" class="btn text-dark" style="background-color: var(--god-gold);" onclick="submitFaveur()"><i class="fas fa-hand-sparkles"></i> Accorder</button>
      </div>
    </div>
  </div>
</div>

<script>
    let selectedFaveurName = '';

    function openFaveurModal(faveurName) {
        selectedFaveurName = faveurName;
        document.getElementById('faveurNameDisplay').innerText = faveurName;
        $('#faveurModal').modal('show');
    }

    function closeFaveurModal() {
        $('#faveurModal').modal('hide');
    }

    function submitFaveur() {
        const characterId = document.getElementById('characterSelect').value;
        if (!characterId) {
            alert('Veuillez sélectionner un personnage.');
            return;
        }

        fetch('/eclats/faveurs/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ characterId: characterId, faveurName: selectedFaveurName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closeFaveurModal();
                alert("Faveur accordée avec succès ! Retrouvez-la dans les détails du personnage (Onglet Éclats ou Fiche).");
            } else {
                alert('Erreur lors de l\\'ajout de la Faveur : ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Une erreur est survenue.');
        });
    }
</script>
{% endblock %}
`;

fs.writeFileSync('app/views/faveurs.html.twig', htmlContent);
console.log('faveurs.html.twig created!');
