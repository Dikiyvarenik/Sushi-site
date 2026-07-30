let count=0;

let cartItems = [];

const cart = document.getElementById("cart-count");
const button = document.querySelectorAll(".add-to-cart-btn");
const totalPriceElement=document.getElementById("total-price");
const cartItemsContainer = document.getElementById("cart-items-container");


function updateCartUI(){
    cartItemsContainer.innerHTML = "";

    cartItems.forEach(item => {
        cartItemsContainer.innerHTML += `<div class="cart-item" style="display: flex; align-items: center;justify-content: space-between; margin-bottom: 15px; background: #333; padding: 10px; border-radius: 10px;">
        <img src="${item.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
        <div style="flex-grow: 1; text-align: left; margin-left: 15px;">
            <h4 style="margin: 0; font-size: 16px;">${item.name}</h4>
            <p style="margin: 5px 0 0 0; color: #ff4500; font-weight: bold;">${item.itemPrice * item.quantity} ₽</p>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
            <button class="quantity-btn minus" data-name="${item.name}" style="background: #ff4500; color: white; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">-</button>
            <span style="font-weight: bold;">${item.quantity}</span>
            <button class="quantity-btn plus" data-name="${item.name}" style="background: #ff4500; color: white; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">+</button>
        </div>
    </div>`;
    }); 

    let total =0;
    cartItems.forEach(item => {
        total = total+(item.itemPrice*item.quantity);
    });
    totalPriceElement.innerText = total;
} 

button.forEach(btn => {
    btn.addEventListener("click",()=>{
        count++;
        cart.innerText = count ;

        cart.classList.remove("bounce");
        cart.offsetWidth;
        cart.classList.add("bounce");
        
        const currentCard = btn.closest(".product-card");

        if (currentCard){
            currentCard.classList.remove("bounce");
            currentCard.offsetWidth;
            currentCard.classList.add("bounce");
            
            const title = currentCard.querySelector("h4").innerText;
            const priceText = currentCard.querySelector(".price").innerText;
            const price = parseInt(priceText);
            const imgSrc = currentCard.querySelector("img").src;
            
            const existingItem = cartItems.find(item => item.name === title);

            if (existingItem){
                existingItem.quantity++;
            } else {
                cartItems.push({
                    name: title,
                    itemPrice: price,
                    image: imgSrc,
                    quantity: 1
                });
            }
            
            
            updateCartUI();
        }
    }); 
});

cartItemsContainer.addEventListener("click",(event)=>{
    const isPlus = event.target.classList.contains("plus");
    const isMinus = event.target.classList.contains("minus");

    if (isPlus || isMinus){
        const productName = event.target.getAttribute("data-name");
        const item = cartItems.find(prod => prod.name === productName);
        if (item){
            if(isPlus){
                item.quantity++;
                count++;
            } else if (isMinus){
                item.quantity--;
                count--;
                if(item.quantity ===0){
                    cartItems = cartItems.filter(prod => prod.name !== productName)
                }
            }
            cart.innerText = count;

            updateCartUI();
        }
    }
})

const modal = document.getElementById("cart-modal")
const open =document.getElementById("open-cart-btn");
open.addEventListener("click",()=>{
    modal.classList.add("active")
});
const close =document.getElementById("close-modal-btn");
close.addEventListener("click",()=>{
    modal.classList.remove("active")
});
