let Lightmod = false

function ChangeToDarkMod(){
    if(Lightmod){
        Lightmod = false;
        document.documentElement.style.setProperty("--text-color", "black");
        document.documentElement.style.setProperty("--background-color", "#efe7e5");
        document.getElementById("Dark-Light-Mode").innerHTML = "🌙";
    }else{
        //Dark Mod
        Lightmod = true;
        document.documentElement.style.setProperty("--text-color", "rgba(255, 255, 255, 1)");
        document.documentElement.style.setProperty("--background-color", "rgb(61, 61, 61)");
        document.getElementById("Dark-Light-Mode").innerHTML = "☀️";
    }
}

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

/*Fonction ajouter au panier*/
function addToCart(name, price) {
  // 1. Récupérer le panier actuel
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // 2. Ajouter le produit
  cart.push({
    name: name,
    price: price
  });

  // 3. Sauvegarder
  localStorage.setItem("cart", JSON.stringify(cart));

  // 4. Feedback utilisateur
  alert("Produit ajouté au panier !");
}