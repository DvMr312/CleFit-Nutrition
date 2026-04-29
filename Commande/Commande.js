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
        document.documentElement.style.setProperty("--text-color", "white");
        document.documentElement.style.setProperty("--background-color", "rgb(61, 61, 61)");
        document.getElementById("Dark-Light-Mode").innerHTML = "☀️";
    }
}

function scrollToProduits() {
  document.getElementById("Top-Produits").scrollIntoView({ behavior: "smooth" });
}

function scrollToAccueil() {
  document.getElementById("Accueil").scrollIntoView({ behavior: "smooth" });
}

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

/*Fonction montrer le panier*/
function displayCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart");

  if (cart.length === 0) {
    container.innerHTML = "<p>Votre panier est vide</p>";
    return;
  }

  let total = 0;
  let html = "";

  cart.forEach(item => {
    html += `<p>${item.name} - ${item.price}€</p>`;
    total += item.price;
  });

  html += `<strong>Total : ${total}€</strong>`;
  container.innerHTML = html;
}
displayCart();
