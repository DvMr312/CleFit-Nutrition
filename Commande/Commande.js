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

  cart.forEach((item, index) => {
  html += `
    <div class="cart-item">
    <span>${item.name} × ${item.quantity} - ${(item.price * item.quantity).toFixed(2)} €</span><br>
    <button class="decreaseincrease" onclick="decreaseQuantity(${index})">-</button>
    <span>${item.quantity}</span>
    <button class="decreaseincrease" onclick="increaseQuantity(${index})">+</button>
      <button class="DeleteButton" onclick="removeFromCart(${index})">
        Supprimer ✖
      </button>
    </div>
  `;

  total += item.price * item.quantity;
});

  html += `<strong>Total : ${total.toFixed(2)} €</strong>`;
  container.innerHTML = html;
}
displayCart();

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(cart));
  
  displayCart();

}

function clearCart() {
  localStorage.removeItem("cart");
  displayCart();
}

function increaseQuantity(index){

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity++;
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

function decreaseQuantity(index){

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity--;
  if(cart[index].quantity <= 0){
    cart.splice(index,1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Fonction qui transforme le panier en texte
function getCartSummary() {

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  let summary = "";
  let total = 0;

  cart.forEach(item => {
    summary += `${item.name} x${item.quantity}\n`;
    total += item.price * item.quantity;
  });
  summary += `\nTotal : ${total.toFixed(2)} €`;
  return summary;
}

document.getElementById("order-form").addEventListener("submit", function(e){

  e.preventDefault();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    showOrderMessageEmptyCart("Votre panier est vide");
    return;
  }

  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const adresse = document.getElementById("adresse").value.trim();
  const email = document.getElementById("email").value.trim();
  const telephone = document.getElementById("telephone").value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    showOrderMessageEmptyCart("Adresse email invalide");
    return;
  }

  const phoneRegex = /^[0-9]{10}$/;

  if (!phoneRegex.test(telephone)) {
    showOrderMessageEmptyCart("Numéro de téléphone invalide");
    return;
  }

  if (!nom || !prenom || !adresse) {
    showOrderMessageEmptyCart("Tous les champs sont obligatoires");
    return;
  }

  console.log(getOrderDetails());

  showOrderMessage("Votre commande a été envoyée avec succès !");

  setTimeout(() => {

    if(confirm("Télécharger votre récapitulatif PDF ?")) {
      downloadOrderPDF();
    }

  }, 1800);

});


function showOrderMessage(message) {

  const msg = document.getElementById("order-message");

  msg.textContent = message;
  msg.classList.add("show");

  setTimeout(() => {
    msg.classList.remove("show");
  }, 4000);  
}

function showOrderMessageEmptyCart(message) {

  const msg = document.getElementById("order-messageEmptyCart");

  msg.textContent = message;
  msg.classList.add("show");

  setTimeout(() => {
    msg.classList.remove("show");
  }, 4000);  
}

//Descriptif de la commande passer
function getOrderDetails() {

  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const adresse = document.getElementById("adresse").value;
  const email = document.getElementById("email").value;
  const telephone = document.getElementById("telephone").value;
  return `

  Nom : ${nom}
  Prénom : ${prenom}
  Adresse : ${adresse}
  Email : ${email}
  Téléphone : ${telephone}

  ${getCartSummary()}
  `;
}

function downloadOrderPDF() {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const adresse = document.getElementById("adresse").value;
  const email = document.getElementById("email").value;
  const telephone = document.getElementById("telephone").value;

  let y = 20;

  doc.setFontSize(18);
  doc.text("CléFit NUTRITION", 20, y);
  y += 15;

  doc.setFontSize(12);
  doc.text(`Nom : ${nom}`, 20, y);
  y += 8;

  doc.text(`Prénom : ${prenom}`, 20, y);
  y += 8;

  doc.text(`Adresse : ${adresse}`, 20, y);
  y += 8;

  doc.text(`Email : ${email}`, 20, y);
  y += 8;

  doc.text(`Téléphone : ${telephone}`, 20, y);
  y += 15;

  doc.text("Commande :", 20, y);
  y += 10;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;

  cart.forEach(item => {
    doc.text(
      `${item.name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)} €`,
      20,
      y
    );

    total += item.price * item.quantity;
    y += 8;
  });

  y += 10;

  doc.setFontSize(14);
  doc.text(`Total : ${total.toFixed(2)} €`, 20, y);
  doc.save(`Commande_${nom}_${prenom}.pdf`);
}

