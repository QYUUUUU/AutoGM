<script>

    // Vanilla JS Modal Management
    function showModal(id) {
        const modal = document.getElementById(id);
        if(!modal) return;
        modal.style.display = 'block';
        // Force reflow
        void modal.offsetWidth;
        modal.classList.add('show');
        
        // Add backdrop if it doesn't exist
        if(!document.querySelector('.modal-backdrop')) {
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
        }
        document.body.classList.add('modal-open');
    }

    function hideModal(id) {
        const modal = document.getElementById(id);
        if(!modal) return;
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 150); // match bootstrap fade out
        
        const backdrop = document.querySelector('.modal-backdrop');
        if(backdrop) {
            backdrop.classList.remove('show');
            setTimeout(() => backdrop.remove(), 150);
        }
        document.body.classList.remove('modal-open');
    }

    document.addEventListener('DOMContentLoaded', () => {
        
        // 1. Background Scroller Initialization
        const images = [
            "/images/background-ool.png", 
            "/images/background-aon.png", 
            "/images/background-tegee.png", 
            "/images/background-avorae.png"
        ];
        
        for (let i = images.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [images[i], images[j]] = [images[j], images[i]];
        }
        
        const container = document.getElementById('random-slideshow');
        images.forEach((img, index) => {
            const div = document.createElement('div');
            div.className = 'bg-slide';
            div.style.backgroundImage = `url('${img}')`;
            
            if (index === 0) {
                // First slide: starts visible without fading in
                div.style.animation = `fadeSlideFirst 160s infinite`;
                div.style.opacity = '0.6';
            } else {
                // Subsequent slides fade in normally
                div.style.animation = `fadeSlide 160s infinite`;
                div.style.animationDelay = `${index * 40}s`;
            }
            container.appendChild(div);
        });

        // 2. Custom Pure JS Tabs
        const tabs = document.querySelectorAll('.god-tabs .nav-link');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                // Deactivate all
                tabs.forEach(t => t.classList.remove('active'));
                // Activate clicked
                tab.classList.add('active');
                
                // Hide all panes
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('show', 'active');
                });
                
                // Show requested pane
                const targetSelector = tab.getAttribute('data-target');
                const targetPane = document.querySelector(targetSelector);
                if (targetPane) {
                    targetPane.classList.add('show', 'active');
                }
            });
        });

        // 3. Custom Pure JS Accordions
        const accordions = document.querySelectorAll('.accordion-god .btn-link');
        accordions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSelector = btn.getAttribute('data-target');
                const targetPane = document.querySelector(targetSelector);
                
                const isCurrentlyOpen = targetPane.classList.contains('show');
                
                // Close all blocks
                document.querySelectorAll('.accordion-god .collapse').forEach(pane => {
                    pane.classList.remove('show');
                });

                // Toggle logic
                if (!isCurrentlyOpen) {
                    targetPane.classList.add('show');
                }
            });
        });

        // Vanilla JS for data-dismiss
        document.querySelectorAll('[data-dismiss="modal"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if(modal) hideModal(modal.id);
            });
        });

        // Vanilla JS for data-dismiss
        document.querySelectorAll('[data-dismiss="modal"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if(modal) hideModal(modal.id);
            });
        });
    });

    // 4. Exposed Action Functions (Creation, Pact, Favors)
    function submitGodCreation() {
        const nom = document.getElementById('godName').value;
        const description = document.getElementById('godDesc').value;
        const domaines = document.getElementById('godDomains').value;
        const interditsMineurs = document.getElementById('godInterditsMin').value;
        const interditsMajeurs = document.getElementById('godInterditsMaj').value;

        if(!nom) {
            alert("L'Entité exige un Nom !");
            return;
        }

        const data = { nom, description, domaines, interditsMineurs, interditsMajeurs };

        fetch('/eclats/gods/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(payload => {
            if(payload.success) window.location.reload();
            else alert("Erreur lors de la genèse: " + payload.message);
        })
        .catch(err => alert("Erreur Serveur."));
    }

    function updateCharacterPactState() {
        const select = document.getElementById('pacteCharacterSelect');
        const container = document.getElementById('pacteActionsContainer');
        const unboundSection = document.getElementById('unboundGodSection');
        const boundSection = document.getElementById('boundGodSection');
        const currentStadeDisplay = document.getElementById('currentStadeDisplay');
        const upgradeBtn = document.getElementById('upgradeBtn');

        if(!select.value) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';
        const option = select.options[select.selectedIndex];
        const godId = option.getAttribute('data-god-id');
        const stade = option.getAttribute('data-stade');

        if(godId && godId.trim() !== '') {
            unboundSection.style.display = 'none';
            boundSection.style.display = 'block';
            currentStadeDisplay.innerText = stade || 'Rencontre';
            
            if(stade === 'Accord') {
                upgradeBtn.disabled = true;
                upgradeBtn.innerHTML = "<i class='fas fa-check-circle mr-2'></i> Ascendance Maximale (Accord)";
                upgradeBtn.classList.remove('btn-god-outline');
                upgradeBtn.classList.add('btn-god');
            } else {
                upgradeBtn.disabled = false;
                upgradeBtn.innerHTML = "Élever le Pacte <i class='fas fa-arrow-up ml-1'></i>";
                upgradeBtn.classList.add('btn-god-outline');
                upgradeBtn.classList.remove('btn-god');
            }
        } else {
            unboundSection.style.display = 'block';
            boundSection.style.display = 'none';
        }
    }

    
    function bindGod() {
        const characterId = document.getElementById('pacteCharacterSelect').value;
        const godId = document.getElementById('pacteGodSelect').value;
        if(!characterId || !godId) return alert("Sélectionnez l'âme et la divinité.");

        document.getElementById('pactModalTitle').innerText = 'Initier la Rencontre';
        document.getElementById('pactModalDesc').innerText = `L'Élu entre en possession de son Éclat.\nIl gagne +1 Caractéristique et +1 Compétence.`;
        document.getElementById('pactSkill2Container').style.display = 'none';
        document.getElementById('pactActionType').value = 'bind';
        showModal('pactModal');
    }

    function upgradePact() {
        const select = document.getElementById('pacteCharacterSelect');
        const option = select.options[select.selectedIndex];
        const stade = option.getAttribute('data-stade') || 'Rencontre';

        document.getElementById('pactModalTitle').innerText = 'Élever le Pacte';
        document.getElementById('pactActionType').value = 'upgrade';

        if (stade === 'Rencontre') {
            document.getElementById('pactModalDesc').innerText = 'Passage à l\'Entente.
L\'Élu gagne +1 Caractéristique et +1 Compétence.';
            document.getElementById('pactSkill2Container').style.display = 'none';
        } else if (stade === 'Entente') {
            document.getElementById('pactModalDesc').innerText = 'Passage à l\'Accord.
L\'Élu gagne +1 Caractéristique et DEUX Compétences.';
            document.getElementById('pactSkill2Container').style.display = 'block';
        }
        
        showModal('pactModal');
    }

    function confirmPactAction() {
        const type = document.getElementById('pactActionType').value;
        const characterId = document.getElementById('pacteCharacterSelect').value;
        const stat = document.getElementById('pactStat').value;
        const skill1 = document.getElementById('pactSkill1').value;
        let skill2 = document.getElementById('pactSkill2').value;
        
        if (document.getElementById('pactSkill2Container').style.display === 'none') {
            skill2 = null;
        }

        if (type === 'bind') {
            const godId = document.getElementById('pacteGodSelect').value;
            fetch('/eclats/pacte/bind', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ characterId, godId, stat, skill1 })
            }).then(res => res.json()).then(data => {
                if(data.success) { hideModal('pactModal'); location.reload(); }
                else alert('Erreur: ' + data.message);
            });
        } else if (type === 'upgrade') {
            fetch('/eclats/pacte/upgrade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ characterId, statToUpgrade: stat, skillToUpgrade1: skill1, skillToUpgrade2: skill2 })
            }).then(res => res.json()).then(data => {
                if(data.success) { hideModal('pactModal'); location.reload(); }
                else alert('Erreur: ' + data.message);
            });
        }
    }

    function breakPact() {
        if(!confirm("Êtes-vous certain de vouloir briser ce lien sacré ? La colère du Dieu et la perte de toutes faveurs en découleront.")) return;
        const characterId = document.getElementById('pacteCharacterSelect').value;
        fetch('/eclats/pacte/break', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ characterId })
        }).then(res => res.json()).then(data => {
            if(data.success) location.reload();
            else alert('Erreur: ' + data.message);
        });
    }

    function updateCharacterFaveurState() {
        const select = document.getElementById('faveurCharacterSelect');
        const container = document.getElementById('faveursContainer');
        const noGodAlert = document.getElementById('noGodAlert');
        const faveursListArea = document.getElementById('faveursListArea');

        if(!select.value) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';
        const option = select.options[select.selectedIndex];
        const godId = option.getAttribute('data-god-id');
        const faveursStr = option.getAttribute('data-faveurs');

        if(!godId || godId.trim() === '') {
            noGodAlert.style.display = 'block';
            faveursListArea.style.display = 'none';
        } else {
            noGodAlert.style.display = 'none';
            faveursListArea.style.display = 'block';
            
            const list = document.getElementById('currentFaveursList');
            list.innerHTML = '';
            try {
                let decodedStr = faveursStr;
                if (!decodedStr || decodedStr === '') decodedStr = '[]';
                const faveurs = JSON.parse(decodedStr);
                
                if(faveurs.length === 0) {
                    list.innerHTML = '<li class="list-group-item text-center" style="background: rgba(0,0,0,0.2); border: 1px dashed rgba(255,255,255,0.1); color: #888;">Aucune Grâce n\'a encore été octroyée.</li>';
                } else {
                    faveurs.forEach(f => {
                        const safeName = f.replace(/'/g, "\\'").replace(/"/g, "&quot;");
                        list.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center mb-2" style="background: rgba(87, 152, 209, 0.05); border: 1px solid rgba(87, 152, 209, 0.2); border-radius: 4px; color: #ccc;">
                            <span style="font-family: 'Cinzel', serif; letter-spacing: 0.5px; color: var(--god-gold);"><i class="fas fa-sparkles mr-2" style="font-size: 0.8rem; opacity: 0.6;"></i> ${f}</span>
                            <button class="btn btn-sm btn-danger-god" onclick="removeFaveur('${safeName}')" title="Répudier"><i class="fas fa-times"></i></button>
                        </li>`;
                    });
                }
            } catch(e) { console.error('Erreur parsing faveurs:', e); }
        }
    }

    function addFaveur() {
        const characterId = document.getElementById('faveurCharacterSelect').value;
        const faveurName = document.getElementById('faveurNameInput').value;
        if(!characterId || !faveurName.trim()) return alert("Le nom de la faveur est requis pour l'invocation.");

        fetch('/eclats/faveurs/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ characterId, faveurName })
        }).then(res => res.json()).then(data => {
            if(data.success) location.reload();
            else alert('Erreur serveur.');
        });
    }

    function removeFaveur(faveurName) {
        if(!confirm(`Répudier la faveur divinement accordée : "${faveurName}" ?`)) return;
        const characterId = document.getElementById('faveurCharacterSelect').value;

        fetch('/eclats/faveurs/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ characterId, faveurName })
        }).then(res => res.json()).then(data => {
            if(data.success) location.reload();
            else alert('Erreur serveur.');
        });
    }
</script>
