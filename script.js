
const products = {
  matcha: {
    name: "Matcha Latte",
    price: 5.00
  },
  coconut: {
    name: "Lemon Coconut",
    price: 5.00
  },
  cider: {
    name: "Sparkling Cider",
    price: 5.00
  }
};

let cart = {};

const cartCount = document.getElementById("cart-count");
const cartHeadingCount = document.getElementById("cart-heading-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const openCartButton = document.getElementById("open-cart");
const closeCartButton = document.getElementById("close-cart");
const checkoutButton = document.getElementById("checkout-button");

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

// Add a drink to the cart.
document.querySelectorAll(".add-button").forEach(button => {
  button.addEventListener("click", () => {
    const id = button.dataset.id;

    if (cart[id]) {
      cart[id].quantity++;
    } else {
      cart[id] = {
        ...products[id],
        quantity: 1
      };
    }

    updateCart();

    button.innerHTML = "Added to bag ✓";

    setTimeout(() => {
      button.innerHTML = 'Add to bag <span>+</span>';
    }, 1000);
  });
});

// Calculate total number of drinks.
function getCartCount() {
  return Object.values(cart).reduce(
    (total, item) => total + item.quantity,
    0
  );
}

// Calculate subtotal.
function getCartTotal() {
  return Object.values(cart).reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

// Render the cart and update the displayed totals.
function updateCart() {
  const count = getCartCount();
  const total = getCartTotal();

  cartCount.textContent = count;
  cartHeadingCount.textContent = `(${count})`;
  cartTotal.textContent = `$${total.toFixed(2)}`;

  const entries = Object.entries(cart);

  if (entries.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-cart">Your bag is waiting for something lovely.</p>';
    return;
  }

  cartItems.innerHTML = entries.map(([id, item]) => `
    <div class="cart-item">
      <div>
        <h3>${item.name}</h3>
        <p>$${item.price.toFixed(2)} each</p>

        <div class="quantity-controls">
          <button data-action="decrease" data-id="${id}"
                  aria-label="Decrease ${item.name} quantity">−</button>

          <span>${item.quantity}</span>

          <button data-action="increase" data-id="${id}"
                  aria-label="Increase ${item.name} quantity">+</button>

          <button class="remove-button"
                  data-action="remove" data-id="${id}">
            Remove
          </button>
        </div>
      </div>

      <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
    </div>
  `).join("");
}

// Handle quantity controls and removal.
cartItems.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const { action, id } = button.dataset;

  if (!cart[id]) return;

  if (action === "increase") {
    cart[id].quantity++;
  }

  if (action === "decrease") {
    cart[id].quantity--;

    if (cart[id].quantity <= 0) {
      delete cart[id];
    }
  }

  if (action === "remove") {
    delete cart[id];
  }

  updateCart();
});

// Open the shopping cart.
function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("visible");
  cartPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
  closeCartButton.focus();
}

// Close the shopping cart.
function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("visible");
  cartPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cart-open");
  openCartButton.focus();
}

openCartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && cartPanel.classList.contains("open")) {
    closeCart();
  }
});

// Mobile navigation.
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("active");

  menuToggle.setAttribute("aria-expanded", isOpen);
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Demo checkout: no real payment is processed.
checkoutButton.addEventListener("click", () => {
  if (getCartCount() === 0) {
    alert("Your bag is empty. Add a drink to get started!");
    return;
  }

  alert(
    "Your bag is ready! Connect a payment provider to accept real orders."
  );
});

// Current year in the footer.
document.getElementById("year").textContent =
  new Date().getFullYear();

// Initialize the cart.
updateCart();
