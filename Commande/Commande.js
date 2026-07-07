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

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});
emailjs.init("B8iZsCS5JszT1aExp");

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

  saveCart(cart);
  updateCartBadge();  
  displayCart();

}
function clearCart() {
  localStorage.removeItem("cart");
  displayCart();
}

function getCartTotal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
  });

  return total;
}

function increaseQuantity(index){

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity++;
  saveCart(cart);
  updateCartBadge(); 
  displayCart();
}

function decreaseQuantity(index){

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity--;
  if(cart[index].quantity <= 0){
    cart.splice(index,1);
  }
  saveCart(cart);
  updateCartBadge(); 
  displayCart();
}

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

let isSubmitting = false;
document.getElementById("order-form").addEventListener("submit", function(e){   
  
  e.preventDefault();
  if (isSubmitting) return;
  isSubmitting = true;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {    
    isSubmitting = false;
    showOrderMessageEmptyCart("Votre panier est vide");
    return;
  }

  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const adresse = document.getElementById("adresse").value.trim();
  const email = document.getElementById("email").value.trim();
  const telephone = document.getElementById("telephone").value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  if (!emailRegex.test(email)) {
    showOrderMessageEmptyCart("Adresse email invalide");
    return;
  }

  if (!phoneRegex.test(telephone)) {
    showOrderMessageEmptyCart("Numéro de téléphone invalide");
    return;
  }

  if (!nom || !prenom || !adresse) {
    showOrderMessageEmptyCart("Tous les champs sont obligatoires");
    return;
  }

  const submitButton = document.querySelector("#order-form button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Commande en cours...";   

  const orderId = Date.now().toString().slice(-9);
  const total = getCartTotal();

  const templateParams = {
    nom,
    prenom,
    adresse,
    email,
    telephone,
    commande: getCartSummary(),
    total: total.toFixed(2),
    date: new Date().toLocaleDateString("fr-FR"),
    order_id: orderId
  };

  emailjs.send(
  "service_7yllrwd",
  "template_5gunfoe",
  templateParams
  )
  .then(() => {
    isSubmitting = false;
    showOrderMessage("Votre commande a été envoyée avec succès !");

    setTimeout(() => {

      if(confirm("Télécharger votre récapitulatif PDF ?")) {
        downloadOrderPDF(orderId);
      }

      document.getElementById("order-form").reset();
      localStorage.removeItem("cart");
      displayCart();

      // réactiver bouton
      submitButton.disabled = false;
      submitButton.textContent = "Envoyer la commande";

    }, 1800);
  })
  .catch((error) => {
    isSubmitting = false;
    console.error("Erreur EmailJS :", error);

    showOrderMessageEmptyCart("Erreur lors de l'envoi de la commande");
    submitButton.disabled = false;
    submitButton.textContent = "Envoyer la commande";
  });
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

function downloadOrderPDF(orderId) {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Récupération des données
  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const adresse = document.getElementById("adresse").value;
  const email = document.getElementById("email").value;
  const telephone = document.getElementById("telephone").value;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  let total = 0;

  // Fond blanc
  doc.setFillColor(255,255,255);
  doc.rect(0,0,210,297,"F");

  // Bandeau noir
  doc.setFillColor(0,0,0);
  doc.rect(0,0,210,35,"F");

  // Titre
  doc.setTextColor(255,255,255);
  doc.setFontSize(22);
  doc.text("CLÉFIT NUTRITION",105,15,{align:"center"});

  doc.setFontSize(11);
  doc.text(
    "La clé de votre forme à tout âge",
    105,
    25,
    {align:"center"}
  );

  doc.setTextColor(0,0,0);

  const today = new Date();
  const date = today.toLocaleDateString("fr-FR");

  let y = 50;

  // Date + numéro
  doc.text(`Date : ${date}`,20,y);
  y += 8;

  doc.text(`Commande : #${orderId}`,20,y);
  y += 15;

  // CLIENT
  doc.setFontSize(14);
  doc.text("CLIENT",20,y);

  y += 4;
  doc.line(20,y,190,y);

  y += 10;

  doc.setFontSize(11);

  doc.text(`Nom : ${nom}`,20,y);
  y += 7;

  doc.text(`Prénom : ${prenom}`,20,y);
  y += 7;

  doc.text(`Adresse : ${adresse}`,20,y);
  y += 7;

  doc.text(`Téléphone : ${telephone}`,20,y);
  y += 7;

  doc.text(`Email : ${email}`,20,y);

  // COMMANDE
  y += 20;

  doc.setFontSize(14);
  doc.text("COMMANDE",20,y);

  y += 4;
  doc.line(20,y,190,y);

  y += 10;

  cart.forEach(item => {

    const prix =
    (item.price * item.quantity).toFixed(2);

    doc.text(
      `${item.name} x${item.quantity}`,
      20,
      y
    );

    doc.text(
      `${prix} €`,
      180,
      y,
      {align:"right"}
    );
    total += item.price * item.quantity;
    y += 8;
  });

  y += 5;
  doc.line(20,y,190,y);
  y += 10;
  doc.setFontSize(14);
  doc.text("TOTAL",20,y);

  doc.text(
    `${total.toFixed(2)} €`,
    180,
    y,
    {align:"right"}
  );
  y += 25;
  doc.setFontSize(12);

  doc.text(
    "Merci pour votre commande vous serez contacter très bientôt !",
    105,
    y,
    {align:"center"}
  );

  y += 8;

  doc.text(
    "CléFit Nutrition",
    105,
    y,
    {align:"center"}
  );

  doc.save(`Commande_${nom}_${prenom}.pdf`);
}


