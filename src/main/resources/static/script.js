const table = document.querySelector('#etudiants-table tbody');
const form = document.getElementById('etudiant-form');

async function chargerEtudiants() {
    const res = await fetch('/api/etudiants');
    const etudiants = await res.json();
    table.innerHTML = '';
    etudiants.forEach(e => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${e.nom}</td><td>${e.prenom}</td><td>${e.email}</td>`;
        table.appendChild(tr);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const email = document.getElementById('email').value;

    await fetch('/api/etudiants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, prenom, email })
    });

    form.reset();
    chargerEtudiants();
});

chargerEtudiants();