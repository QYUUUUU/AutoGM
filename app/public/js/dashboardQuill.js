document.addEventListener('DOMContentLoaded', function () {
    let favoriteSelect = document.getElementById("favoriteCharacter");
    let armeSelect = document.getElementById("armeSelect");
    let armureSelect = document.getElementById("armureSelect");
    let armeStats = document.getElementById("armeStats");
    let armureStats = document.getElementById("armureStats");

    function updateEquipmentStats() {
        if (armeSelect && armeSelect.options[armeSelect.selectedIndex]) {
            const opt = armeSelect.options[armeSelect.selectedIndex];
            const stats = opt.getAttribute("data-stats");
            const desc = opt.getAttribute("data-desc");
            armeStats.innerHTML = stats && stats !== "-" ? `<b>Stats:</b> ${stats}<br><i>${desc || ''}</i>` : "";
        }
        if (armureSelect && armureSelect.options[armureSelect.selectedIndex]) {
            const opt = armureSelect.options[armureSelect.selectedIndex];
            const stats = opt.getAttribute("data-stats");
            const desc = opt.getAttribute("data-desc");
            armureStats.innerHTML = stats && stats !== "-" ? `<b>Stats:</b> ${stats}<br><i>${desc || ''}</i>` : "";
        }
    }

    if (armeSelect) {
        armeSelect.addEventListener('change', function() {
            updateEquipmentStats();
            updateCharacterField(characterId, "armeEquipee", this.value);
        });
    }
    if (armureSelect) {
        armureSelect.addEventListener('change', function() {
            updateEquipmentStats();
            updateCharacterField(characterId, "armureEquipee", this.value);
        });
    }

    let characterId = favoriteSelect.value;
    let quill;
    getCharacter(characterId)
        .then((data) => {
            quill = makeQuill(data.notes, quill);
            if (armeSelect) armeSelect.value = data.armeEquipee || "";
            if (armureSelect) armureSelect.value = data.armureEquipee || "";
            updateEquipmentStats();
        });
    favoriteSelect.addEventListener("change", async () => {
        characterId = favoriteSelect.value;
        try {
            getCharacter(characterId)
                .then((data) => {
                    updateQuill(data.notes, quill);
                    if (armeSelect) armeSelect.value = data.armeEquipee || "";
                    if (armureSelect) armureSelect.value = data.armureEquipee || "";
                    updateEquipmentStats();
                });
        } catch (error) {
            console.error(error);
        }
    });

    function updateInventory(quill) {
        var contents = quill.getContents();
        const jsonString = JSON.stringify(contents);
        updateCharacterField(characterId, "notes", jsonString);
    }

    function makeQuill(quillContent) {
        const quill = new Quill('#editor', {
            theme: 'snow',
            placeholder: 'Take notes here...',
            modules: {
                toolbar: [
                    [
                        {
                            'header': [1, 2, false]
                        }
                    ],
                    [
                        'bold', 'italic', 'underline'
                    ],
                    ['code-block']
                ]
            }
        });
        updateQuill(quillContent, quill);
        quill.on('text-change', function () {
            updateInventory(quill);
        });
        return quill;
    }

    function updateQuill(quillContent, quill) {

        try {
            if (!quillContent || typeof quillContent !== 'string' || quillContent.trim() === '') {
                quill.setContents([{ insert: '\n' }]);
            } else {
                const parsedContent = JSON.parse(quillContent);
                quill.setContents(parsedContent);
            }
            quill.history.clear();
        } catch (error) {
            console.error("Notes non chargeables au format formatté, fallback :");
            quill.setText(quillContent || "");
            quill.history.clear();
        }
    }


    function updateCharacterField(id, field, value) {
        const url = '/Character';

        // Updated payload to be sent in the request body
        const data = {
            id: id,
            field: field,
            value: value
        };
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Convert data to JSON string
        })
            .then(response => {
                if (response.ok) {
                    // Handle successful response
                } else {
                    console.error(`Error updating ${field} for Character with ID ${id}`);
                    console.error(response.status, response.statusText);
                }
            })
            .catch(error => {
                console.error(`Error updating ${field} for Character with ID ${id}`);
                console.error(error);
            });
    }

    async function getCharacter(characterId) {
        try {
            const response = await fetch(`/Character/${characterId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }
});