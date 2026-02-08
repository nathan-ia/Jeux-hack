function filtrerMenu() {
    let input = document.getElementById('maRecherche');
    let filter = input.value.toLowerCase();
    let ul = document.getElementById("menuDoc");
    let li = ul.getElementsByTagName('li');


    for (let i = 0; i < li.length; i++) {
        let a = li[i].getElementsByTagName('a')[0];
        let texte = a.textContent || a.innerText;

        if (texte.toLowerCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}


document.getElementById('monBtn').onclick = function () {
    alert("Interaction réussie !");
};