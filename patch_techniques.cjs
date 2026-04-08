const fs = require('fs');

const html = fs.readFileSync('app/views/index.html.twig', 'utf8');

const replacement = `
                            <!-- TECHNIQUES DE COMBAT -->
                            <div class="row mb-4">
                                <div class="col-12">
                                    <div class="p-3 bg-dark border border-secondary rounded text-light h-100">
                                        <h5 class="text-info border-bottom border-secondary pb-2"><i class="fas fa-khanda"></i> Techniques de Combat débloquées</h5>
                                        <div class="pt-2">
                                            {% set t_charge = false %}
                                            {% set t_att_precise = false %}
                                            {% set t_att_surprise = false %}
                                            {% set t_celerite = false %}
                                            {% set t_deux_armes = false %}
                                            {% set t_coup_bas = false %}
                                            {% set t_finesse = false %}
                                            {% set t_frappe_lourde = false %}
                                            {% set t_parade = false %}
                                            {% set t_polyvalence = false %}
                                            {% set t_protection = false %}
                                            {% set t_saisie = false %}
                                            {% set t_tir_instinctif = false %}
                                            {% set t_tir_precis = false %}
                                            {% set t_volee = false %}

                                            {% set melee = favoriteCharacter.character.melee|default(0) %}
                                            {% set cac = favoriteCharacter.character.cac|default(0) %}
                                            {% set tir = favoriteCharacter.character.tir|default(0) %}
                                            {% set lancer = favoriteCharacter.character.lancer|default(0) %}
                                            {% set bouclier = favoriteCharacter.character.bouclier|default(0) %}
                                            {% set discretion = favoriteCharacter.character.discretion|default(0) %}
                                            
                                            {% set puissance = favoriteCharacter.character.puissance|default(1) %}
                                            {% set precision = favoriteCharacter.character.precision|default(1) %}
                                            {% set reflexes = favoriteCharacter.character.reflexes|default(1) %}

                                            {% if (melee >= 3) and (precision >= 3) %} {% set t_att_precise = true %} {% endif %}
                                            {% if (cac >= 3) and (discretion >= 3) %} {% set t_att_surprise = true %} {% endif %}
                                            {% if (melee >= 4 or tir >= 4) and (reflexes >= 4) %} {% set t_celerite = true %} {% endif %}
                                            {% if (melee >= 3 or cac >= 3) and (puissance >= 3) %} {% set t_charge = true %} {% endif %}
                                            {% if (melee >= 3) and (reflexes >= 3) %} {% set t_deux_armes = true %} {% endif %}
                                            {% if (melee >= 3 or cac >= 3) %} {% set t_coup_bas = true %} {% endif %}
                                            {% if (melee >= 3) %} {% set t_finesse = true %} {% endif %}
                                            {% if (melee >= 3 or cac >= 3) and (puissance >= 3) %} {% set t_frappe_lourde = true %} {% endif %}
                                            {% if (melee >= 3 or bouclier >= 3) and (reflexes >= 3) %} {% set t_parade = true %} {% endif %}
                                            {% if (melee >= 3 or cac >= 3 or tir >= 3 or lancer >= 3 or bouclier >= 3) %} {% set t_polyvalence = true %} {% endif %}
                                            {% if (bouclier >= 3) and (puissance >= 3) %} {% set t_protection = true %} {% endif %}
                                            {% if (cac >= 3) and (puissance >= 3) %} {% set t_saisie = true %} {% endif %}
                                            {% if (tir >= 3 or lancer >= 3) and (reflexes >= 3) %} {% set t_tir_instinctif = true %} {% endif %}
                                            {% if (tir >= 3 or lancer >= 3) and (precision >= 3) %} {% set t_tir_precis = true %} {% endif %}
                                            {% if (tir >= 4 or lancer >= 4) and (reflexes >= 4) %} {% set t_volee = true %} {% endif %}

                                            <div class="row">
                                            {% if t_att_precise %}
                                                <div class="col-md-6 mb-2"><strong>Attaque précise:</strong> +1D ou +1Dgt (surpris/pris à revers). <em>(Mêlée Exp, Pré 3D)</em></div>
                                            {% endif %}
                                            {% if t_att_surprise %}
                                                <div class="col-md-6 mb-2"><strong>Attaque surprise:</strong> +1D ou +1Dgt sur la première attaque (surpris/revers). <em>(CàC Exp, Discrétion Exp)</em></div>
                                            {% endif %}
                                            {% if t_celerite %}
                                                <div class="col-md-6 mb-2"><strong>Célérité:</strong> 2 attaques (dont 1 mineure), mais ni bonus surdomaine/aide. <em>(Mêlée/Tir Mtr, Réf 4D)</em></div>
                                            {% endif %}
                                            {% if t_charge %}
                                                <div class="col-md-6 mb-2"><strong>Charge:</strong> +1Dgt, -1D défense. <em>(Mêlée/CàC Exp, Pui 3D)</em></div>
                                            {% endif %}
                                            {% if t_deux_armes %}
                                                <div class="col-md-6 mb-2"><strong>Combat à deux armes:</strong> +1Dgt, relance 1 dé rater attaque/défense. <em>(Mêlée Exp, Réf 3D)</em></div>
                                            {% endif %}
                                            {% if t_coup_bas %}
                                                <div class="col-md-6 mb-2"><strong>Coup bas:</strong> Remplace type de dégâts si désavantageux. <em>(Mêlée/CàC Exp)</em></div>
                                            {% endif %}
                                            {% if t_finesse %}
                                                <div class="col-md-6 mb-2"><strong>Finesse:</strong> Remplace Pui par Pré pour Dgt de base. <em>(Mêlée Exp)</em></div>
                                            {% endif %}
                                            {% if t_frappe_lourde %}
                                                <div class="col-md-6 mb-2"><strong>Frappe lourde:</strong> -1D attaque, +2 Dgt. <em>(Mêlée/CàC Exp, Pui 3D)</em></div>
                                            {% endif %}
                                            {% if t_parade %}
                                                <div class="col-md-6 mb-2"><strong>Parade experte:</strong> +1D défense, -1D attaque. <em>(Mêlée/Bouclier Exp, Réf 3D)</em></div>
                                            {% endif %}
                                            {% if t_polyvalence %}
                                                <div class="col-md-6 mb-2"><strong>Polyvalence:</strong> Change le type de dégâts avec l\'arme actuelle. <em>(Toute comp. de combat Exp)</em></div>
                                            {% endif %}
                                            {% if t_protection %}
                                                <div class="col-md-6 mb-2"><strong>Protection protectrice:</strong> Remplace Dgt Pui par Bouclier ou encaisse Dgt. <em>(Bouclier Exp, Pui 3D)</em></div>
                                            {% endif %}
                                            {% if t_saisie %}
                                                <div class="col-md-6 mb-2"><strong>Saisie:</strong> 1 réussite Dgt = entraver la cible. <em>(CàC Exp, Pui 3D)</em></div>
                                            {% endif %}
                                            {% if t_tir_instinctif %}
                                                <div class="col-md-6 mb-2"><strong>Tir instinctif:</strong> Annule les malus de couvert. <em>(Tir/Lancer Exp, Réf 3D)</em></div>
                                            {% endif %}
                                            {% if t_tir_precis %}
                                                <div class="col-md-6 mb-2"><strong>Tir précis:</strong> +1D attaque, -1Dgt (tir ciblé) OU -1D attaque, +2Dgt. <em>(Tir/Lancer Exp, Pré 3D)</em></div>
                                            {% endif %}
                                            {% if t_volee %}
                                                <div class="col-md-6 mb-2"><strong>Volée:</strong> -1D attaque, 2 attaques au prix de 2 actions. <em>(Tir/Lancer Mtr, Réf 4D)</em></div>
                                            {% endif %}
                                            {% if not (t_att_precise or t_att_surprise or t_celerite or t_charge or t_deux_armes or t_coup_bas or t_finesse or t_frappe_lourde or t_parade or t_polyvalence or t_protection or t_saisie or t_tir_instinctif or t_tir_precis or t_volee) %}
                                                <div class="col-12 text-muted"><em>Aucune technique de combat débloquée pour le moment. Augmentez vos compétences de combat au niveau Expert (3) pour en obtenir.</em></div>
                                            {% endif %}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
`;

const startIndex = html.indexOf('<div class="row">\n                                <div class="col-md-6 mb-3">\n                                    <div class="p-3 bg-dark border border-secondary rounded text-light h-100">\n                                        <h5 class="text-light border-bottom border-secondary pb-2"><i class="fas fa-language"></i> Langues</h5>');

if (startIndex !== -1) {
    const newHtml = html.substring(0, startIndex) + replacement + html.substring(startIndex);
    fs.writeFileSync('app/views/index.html.twig', newHtml);
    console.log("Success with exact index!");
} else {
    console.log("Not found, falling back to regex:");
    const backupHtml = html.replace(
        /(<div class="row">\s*<div class="col-md-6 mb-3">\s*<div class="p-3 bg-dark[^>]*>\s*<h5[^>]*><i class="fas fa-language">)/,
        replacement + "\n                            $1"
    );
    if(backupHtml !== html) {
        fs.writeFileSync('app/views/index.html.twig', backupHtml);
        console.log("Success with Regex!");
    } else {
        console.log("Failed entirely.");
    }
}
