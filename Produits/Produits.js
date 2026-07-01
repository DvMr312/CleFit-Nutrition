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

/*Recherche de produit et filtre*/
const search = document.getElementById("search");
const category = document.getElementById("categorie-filtre");
const products = document.querySelectorAll(".produit-card");

function filterProducts() {
    const searchValue = search.value.toLowerCase();
    const categoryValue = category.value;

    products.forEach(product => {
        const title = product.querySelector("h2").textContent.toLowerCase();
        const productCategory = product.dataset.category;

        const matchesSearch = title.includes(searchValue);
        const matchesCategory = categoryValue === "all" || productCategory === categoryValue;

        if (matchesSearch && matchesCategory) {
            product.style.display = "";
        } else {
            product.style.display = "none";
        }
    });
}
search.addEventListener("input", filterProducts);
category.addEventListener("change", filterProducts);

/*Fonction ajouter au panier*/
function addToCart(name, price) {
  // 1. Récupérer le panier actuel
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // 1.1 Recherche existence produit
  const existingProduct = cart.find(
        item => item.name === name
    );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        // 2. Ajouter le produit
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

  // 3. Sauvegarder
  localStorage.setItem("cart", JSON.stringify(cart));

  // 4. Feedback utilisateur
  showNotification("Produit ajouté au panier !");
}

//Re-Stock/Rupture-de-stock controle
function updateStockButtons() {

    document.querySelectorAll(".produit-card").forEach(card => {

        const rupture = card.querySelector(".stock-label.rupture");
        const button = card.querySelector(".AddToCart");

        if (rupture && button) {
            button.disabled = true;
            button.title = "Produit en rupture de stock";
        }
    });
}
updateStockButtons();

function showNotification(message) {

    const notif = document.getElementById("notification");

    notif.textContent = message;
    notif.classList.add("show");

    setTimeout(() => {
        notif.classList.remove("show");
    }, 3000);
}