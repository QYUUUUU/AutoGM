document.addEventListener('DOMContentLoaded', () => {
    const inventoryContainer = document.querySelector('.inventory');
    if (!inventoryContainer) return;

    let items = [];
    const rawData = inventoryContainer.getAttribute('data-inventory');
    const charId = inventoryContainer.getAttribute('data-char-id');

    try {
        if (rawData && rawData.trim() !== '') {
            const parsed = JSON.parse(rawData);
            if (Array.isArray(parsed)) {
                items = parsed;
            } else {
                // If it's a quill object, try to recover text?
                if (parsed.ops) {
                    items = [];
                } else {
                    items = [];
                }
            }
        }
    } catch (e) {
        if (rawData && rawData.trim() !== '') {
            items = [{ name: "Ancien contenu", desc: rawData, type: "Autre", quantity: 1, stats: "" }];
        }
    }

    const listElement = document.getElementById('inventory-list');
    
    function renderInventory() {
        listElement.innerHTML = '';
        if (items.length === 0) {
            listElement.innerHTML = '<div class="text-white-50 text-center mt-4"><em>Votre inventaire est vide.</em></div>';
            return;
        }

        items.forEach((item, index) => {
            const itemCard = document.createElement('div');
            itemCard.className = 'card mb-2 bg-dark text-white border-secondary p-2';
            itemCard.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <h6 class="mb-0 text-warning" style="text-shadow: 1px 1px 2px black;">${item.name} <small class="text-white-50">x${item.quantity || 1}</small></h6>
                    <button class="btn btn-sm btn-outline-danger py-0 px-2 btn-remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
                <div class="d-flex justify-content-between" style="font-size: 0.85em;">
                    <span class="text-info">${item.type || 'Objet'}</span>
                    ${item.stats ? '<span class="text-success"><i class="fas fa-shield-alt"></i> ' + item.stats + '</span>' : ''}
                </div>
                ${item.desc ? '<div class="mt-1" style="font-size: 0.8em; color: #ccc;">' + item.desc + '</div>' : ''}
            `;
            listElement.appendChild(itemCard);
        });

        document.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                items.splice(idx, 1);
                saveInventory();
                renderInventory();
            });
        });
    }

    function saveInventory() {
        const jsonString = JSON.stringify(items);
        inventoryContainer.setAttribute('data-inventory', jsonString);
        
        fetch('/Character/Favorite/inventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ charId: charId, inventory: jsonString })
        }).catch(err => console.error("Error saving inventory:", err));
    }

    renderInventory();

    // Modal Logic
    const btnSaveItem = document.getElementById('btn-save-item');
    if (btnSaveItem) {
        btnSaveItem.addEventListener('click', () => {
            const isCustom = document.getElementById('custom-item-tab').classList.contains('active');
            let newItem = null;

            if (!isCustom) {
                const select = document.getElementById('item-select');
                const opt = select.options[select.selectedIndex];
                if (opt && opt.value !== '') {
                    newItem = {
                        name: opt.getAttribute('data-name'),
                        type: opt.getAttribute('data-type'),
                        stats: opt.getAttribute('data-stats'),
                        desc: opt.getAttribute('data-desc'),
                        quantity: 1
                    };
                }
            } else {
                const name = document.getElementById('custom-item-name').value;
                if (name) {
                    newItem = {
                        name: name,
                        type: document.getElementById('custom-item-type').value,
                        stats: document.getElementById('custom-item-stats').value,
                        desc: document.getElementById('custom-item-desc').value,
                        quantity: 1
                    };
                }
            }

            if (newItem) {
                // check if already exists to increment quantity
                const existing = items.find(i => i.name === newItem.name && i.stats === newItem.stats);
                if (existing) {
                    existing.quantity = (existing.quantity || 1) + 1;
                } else {
                    items.push(newItem);
                }
                
                saveInventory();
                renderInventory();
                
                // reset form
                document.getElementById('custom-item-name').value = '';
                document.getElementById('custom-item-type').value = '';
                document.getElementById('custom-item-stats').value = '';
                document.getElementById('custom-item-desc').value = '';
                document.getElementById('item-select').value = '';
                
                const closeBtn = document.querySelector('#addItemModal .btn-secondary');
                if(closeBtn) closeBtn.click();
            }
        });
    }
});
