let favoriteSelect = document.getElementById("favoriteCharacter");
let characterId = favoriteSelect.value;
let quill;
getCharacter(characterId)
    .then((data) => {
        quill = makeQuill(data.inventory);
    });
favoriteSelect.addEventListener("change", async () => {
    characterId = favoriteSelect.value;
    try {
        getCharacter(characterId)
            .then((data) => {
                updateQuill(data.inventory);
            });
    } catch (error) {
        console.error(error);
    }
});

function updateInventory(quill) {
    var contents = quill.getContents();
    const jsonString = JSON.stringify(contents);
    updateCharacterField(characterId, "inventory", jsonString);
}

function makeQuill(quillContent) {
    quill = new Quill('#editor', {
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
    updateQuill(quillContent);
    quill.on('text-change', function () {
        updateInventory(quill);
    });
    return quill;
}

function updateQuill(quillContent) {
    try {
        quillContent = JSON.parse(quillContent);
        quill.setContents(quillContent);
        quill.history.clear();
    } catch (error) {
        console.error("Inventaire non chargeable :'(");
        console.error(error);
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
