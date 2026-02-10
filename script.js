function filtrerMenu() {
    // 1. Récupérer ce que l'utilisateur a tapé
    let saisie = document.getElementById('maRecherche').value.toLowerCase();

    // 2. Récupérer la liste des liens du menu
    let menu = document.getElementById('menuDoc');
    let elements = menu.getElementsByTagName('li');

    // 3. Parcourir chaque élément du menu
    for (let i = 0; i < elements.length; i++) {
        let lien = elements[i].getElementsByTagName('a')[0];
        let texte = lien.textContent || lien.innerText;

        // 4. Cacher ou afficher selon la recherche
        if (texte.toLowerCase().indexOf(saisie) > -1) {
            elements[i].style.display = ""; // Afficher
        } else {
            elements[i].style.display = "none"; // Cacher
        }
    }
}