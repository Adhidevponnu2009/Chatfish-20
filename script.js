let products = JSON.parse(localStorage.getItem("products")) || [
  {
    name:"Running Shoes",
    price:1500,
    rating:"⭐⭐⭐⭐",
    image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff"
  }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function loadProducts(list){
  const container = document.getElementById("products");
  if(!container) return;

  container.innerHTML = "";

  list.forEach((p,index)=>{
    container.innerHTML += `
      <div class="product">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <div class="rating">${p.rating}</div>
        <p class="price">₹${p.price}</p>
        <div class="qty-selector">
          <button class="minus">-</button>
          <span class="qty">1</span>
          <button class="plus">+</button>
        </div>
        <button class="add">Add to Cart</button>
      </div>
    `;
  });

  // Attach events after rendering
  document.querySelectorAll(".product").forEach((productCard, index)=>{
    let qty = 1;
    const qtySpan = productCard.querySelector(".qty");
    const plusBtn = productCard.querySelector(".plus");
    const minusBtn = productCard.querySelector(".minus");
    const addBtn = productCard.querySelector(".add");

    qtySpan.innerText = qty;

    plusBtn.addEventListener("click", ()=>{
      qty++;
      qtySpan.innerText = qty;
    });

    minusBtn.addEventListener("click", ()=>{
      if(qty > 1){
        qty--;
        qtySpan.innerText = qty;
      }
    });

    addBtn.addEventListener("click", (e)=>{
      e.stopPropagation();

      const productName = productCard.querySelector("h3").innerText;
      const price = Number(productCard.querySelector(".price").innerText.replace("₹",""));
      const image = productCard.querySelector("img").src;

      // Only add if item not already in cart
      const exists = cart.some(item => item.name === productName);
      if(!exists){
        cart.push({name: productName, price, image, quantity: qty, total: price * qty});
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        showNotification(`${productName} added to cart!`);
      } else {
        showNotification(`${productName} is already in cart!`);
      }
    });
  });
}

function updateCartCount(){
  const countElement = document.getElementById("cartCount");
  if(countElement){
    countElement.innerText = cart.length;
  }
}

function searchProducts(){
  const text = document.getElementById("search").value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(text));
  loadProducts(filtered);
}

// Simple notification
function showNotification(msg){
  let notify = document.getElementById("notification");
  if(!notify){
    notify = document.createElement("div");
    notify.id = "notification";
    notify.style.position = "fixed";
    notify.style.bottom = "20px";
    notify.style.left = "50%";
    notify.style.transform = "translateX(-50%) translateY(20px)";
    notify.style.background = "#2563eb";
    notify.style.color = "white";
    notify.style.padding = "12px 24px";
    notify.style.borderRadius = "8px";
    notify.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
    notify.style.transition = "all 0.3s ease";
    document.body.appendChild(notify);
  }
  notify.innerText = msg;
  notify.style.opacity = "1";
  notify.style.transform = "translateX(-50%) translateY(0)";
  setTimeout(()=>{
    notify.style.opacity = "0";
    notify.style.transform = "translateX(-50%) translateY(20px)";
  },2000);
}

// Initial load
loadProducts(products);
updateCartCount();