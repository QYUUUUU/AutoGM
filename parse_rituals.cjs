
// Add modal logic manually to the HTML var before saving
html = html.replace('</div>\n{% endblock %}', `
<!-- Modal select character -->
<div class="modal fade text-dark" id="ritualModal" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content text-left">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title" id="ritualModalLabel">Apprendre le Rituel</h5>
        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body bg-dark text-white">
        <p>Sélectionnez un personnage pour maîtriser : <strong><span id="ritualNameDisplay"></span></strong></p>
        <select class="form-control mb-3 bg-secondary text-white border-dark" id="characterSelect">
          {% for char in characters %}
          <option value="{{ char.id_Character }}">{{ char.nom }}</option>
          {% endfor %}
        </select>
      </div>
      <div class="modal-footer bg-dark">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
        <button type="button" class="btn btn-primary" onclick="submitRitual()">Ajouter</button>
      </div>
    </div>
  </div>
</div>

<script>
    let selectedRitualName = '';

    // Add buttons dynamically to all ritual headers
    document.addEventListener("DOMContentLoaded", function() {
        const headers = document.querySelectorAll('.card-header');
        headers.forEach(header => {
            const ritualName = header.textContent.trim();
            header.classList.add('d-flex', 'justify-content-between', 'align-items-center');
            const btn = document.createElement('button');
            btn.className = 'btn btn-sm btn-outline-light';
            btn.innerHTML = '<i class="fas fa-plus"></i> Apprendre';
            btn.onclick = function() {
                openRitualModal(ritualName);
            };
            header.appendChild(btn);
        });
    });

    function openRitualModal(ritualName) {
        selectedRitualName = ritualName;
        document.getElementById('ritualNameDisplay').textContent = ritualName;
        $('#ritualModal').modal('show');
    }

    function submitRitual() {
        const characterId = document.getElementById('characterSelect').value;
        if (!characterId) {
            alert("Veuillez sélectionner un personnage.");
            return;
        }

        fetch('/rituels/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                characterId: characterId,
                ritualName: selectedRitualName
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Rituel ajouté avec succès ! Vous pouvez le consulter dans le Dashboard.");
                $('#ritualModal').modal('hide');
            } else {
                alert("Erreur: " + data.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert("Une erreur est survenue lors de l'ajout.");
        });
    }
</script>
</div>
{% endblock %}
`);

fs.writeFileSync('app/views/rituels.html.twig', html);
console.log('Added modal blocks. Regenetating.');
