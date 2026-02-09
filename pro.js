// ================= LOGIN MODAL =================
function openLogin() {
    document.getElementById("loginModal").style.display = "flex";
}

function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}

// LOGIN FORM
let loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Login submitted successfully!");
        closeLogin();
    });
}

// ================= CONTACT FORM =================
let contactForm = document.querySelector(".contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Message sent successfully!");
        this.reset();
    });
}

// ================= MOBILE MENU =================
function toggleMenu() {
    document.querySelector(".nav-links").classList.toggle("active");
}

// ================= CART SYSTEM =================

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Cart count
let cartCount = document.getElementById("cartCount");
if (cartCount) {
    cartCount.innerText = cart.length;
}

// ADD TO CART BUTTON
document.querySelectorAll(".add-to-cart-btn").forEach(button => {
    button.addEventListener("click", function () {

        let productCard = this.closest(".product-card");
        let name = productCard.querySelector(".product-name").innerText;
        let price = productCard.querySelector(".product-price").innerText;

        cart.push({ name, price });

        // Save cart
        localStorage.setItem("cart", JSON.stringify(cart));

        // Update cart count
        if (cartCount) {
            cartCount.innerText = cart.length;
        }

        // Button animation
        this.innerText = "Added ✔";
        this.style.backgroundColor = "green";

        setTimeout(() => {
            this.innerText = "Add to Cart";
            this.style.backgroundColor = "";
        }, 1000);
    });
});
// ================= SEARCH FUNCTION =================
let searchInput = document.getElementById("searchInput");
let products = document.querySelectorAll(".product-card");
let noResult = document.getElementById("noResult");

if (searchInput) {
    searchInput.addEventListener("keyup", function () {

        let searchText = searchInput.value.toLowerCase().trim();
        let found = false;

        products.forEach(product => {
            let name = product.querySelector(".product-name").innerText.toLowerCase();

            product.classList.remove("highlight");

            if (searchText !== "" && name.includes(searchText)) {
                product.classList.add("highlight");
                product.scrollIntoView({ behavior: "smooth", block: "center" });
                found = true;
            }
        });

        // Show message if not found
        if (searchText !== "" && !found) {
            noResult.style.display = "block";
        } else {
            noResult.style.display = "none";
        }

        // Remove highlight when input empty
        if (searchText === "") {
            products.forEach(p => p.classList.remove("highlight"));
            noResult.style.display = "none";
        }
    });
}

function placeOrder() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if(cart.length === 0){
    alert("Your cart is empty!");
    return;
  }

  localStorage.setItem("orders", JSON.stringify(cart));
  localStorage.removeItem("cart");

  window.location.href = "order.html";
}
