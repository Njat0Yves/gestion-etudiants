const table = document.querySelector('#etudiants-table tbody');
const form = document.getElementById('etudiant-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

const idField = document.getElementById('etudiant-id');
const nomField = document.getElementById('nom');
const prenomField = document.getElementById('prenom');
const emailField = document.getElementById('email');

async function chargerEtudiants() {
    const res = await fetch('/api/etudiants');
    const etudiants = await res.json();
    table.innerHTML = '';
    etudiants.forEach(e => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${e.nom}</td>
            <td>${e.prenom}</td>
            <td>${e.email}</td>
            <td class="actions">
                <button class="edit-btn" data-id="${e.id}">Modifier</button>
                <button class="delete-btn" data-id="${e.id}">Supprimer</button>
            </td>`;
        table.appendChild(tr);
    });
}

function resetForm() {
    form.reset();
    idField.value = '';
    formTitle.textContent = 'Ajouter un étudiant';
    submitBtn.textContent = 'Ajouter';
    cancelBtn.classList.add('hidden');
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = idField.value;
    const payload = {
        nom: nomField.value,
        prenom: prenomField.value,
        email: emailField.value
    };

    if (id) {
        // Modification
        await fetch(`/api/etudiants/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } else {
        // Création
        await fetch('/api/etudiants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    resetForm();
    chargerEtudiants();
});

cancelBtn.addEventListener('click', resetForm);

table.addEventListener('click', async (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains('delete-btn')) {
        if (confirm('Supprimer cet étudiant ?')) {
            await fetch(`/api/etudiants/${id}`, { method: 'DELETE' });
            chargerEtudiants();
        }
    }

    if (e.target.classList.contains('edit-btn')) {
        const res = await fetch(`/api/etudiants/${id}`);
        const etudiant = await res.json();
        idField.value = etudiant.id;
        nomField.value = etudiant.nom;
        prenomField.value = etudiant.prenom;
        emailField.value = etudiant.email;
        formTitle.textContent = 'Modifier un étudiant';
        submitBtn.textContent = 'Enregistrer';
        cancelBtn.classList.remove('hidden');
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

chargerEtudiants();