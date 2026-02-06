document.getElementById('monBtn').onclick = function () {
    alert("Interaction réussie !");
};

// Ajoute cette fonction au début de ton fichier script.js
function filtrerMenu() {
    let input = document.getElementById('maRecherche');
    let filter = input.value.toLowerCase();
    let ul = document.getElementById("menuDoc");
    let li = ul.getElementsByTagName('li');

    // On boucle sur tous les liens du sommaire
    for (let i = 0; i < li.length; i++) {
        let a = li[i].getElementsByTagName('a')[0];
        let texte = a.textContent || a.innerText;

        // Si le texte contient ce qu'on a tapé, on l'affiche, sinon on cache
        if (texte.toLowerCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

// Garde ton ancien code pour le bouton
document.getElementById('monBtn').onclick = function () {
    alert("Interaction réussie !");
};