function generateExpressPNJ() {
    const profSelect = document.getElementById("expressProfil");
    const cultSelect = document.getElementById("expressCulture");
    const rating = parseInt(profSelect.value);
    const culture = cultSelect.value;
    
    let baseName = "PNJ ("+culture+" - "+rating+"d)";
    let react = rating - 1;
    let def = 6 + rating;
    let hp = 7 + rating;
    let arm = 0;
    
    if(rating >= 5) arm = 2;
    if(rating >= 7) arm = 4;
    if(rating >= 9) arm = 6;
    
    // Culture bonus
    if(culture === "Empire") { hp+=3; arm+=1; }
    if(culture === "Khashan") { react+=2; def+=1; }
    if(culture === "Saeth") { def+=2; }
    
    let armor = arm + "," + arm + "," + arm;

    combatants.push({
        id: "npc_exp_"+Date.now(),
        isPC: false,
        name: baseName,
        reaction: react,
        init: 0,
        def: def,
        armor: armor,
        hpMax: hp,
        hp: hp
    });
    updateCombatUI();
    logAction(`PNJ Express ajouté: ${baseName}, PV: ${hp}, Défense: ${def}`);
}
