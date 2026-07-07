function updateCartBadge() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const badge = document.getElementById("cart-badge");

    if (!badge) return;

    let quantity = 0;

    cart.forEach(item => {
        quantity += item.quantity;
    });

    badge.textContent = quantity;
    badge.style.display = quantity > 0 ? "flex" : "none";
}
updateCartBadge();

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
}