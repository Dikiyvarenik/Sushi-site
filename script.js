let count=0;

let discountPercent=0;


let cartItems = [];

function updateFinalPrice(){
    let total = 0
    cartItems.forEach(item=>{
        total+= item.itemPrice*item.quantity;
    });
    let finalPrice = total - (total*(discountPercent/100));
    if(totalPriceElement) totalPriceElement.innerText = total;
    const finalPriceSlot = document.getElementById("final-price");
    if(finalPriceSlot){
        finalPriceSlot.innerText=Math.round(finalPrice);
    }
}

const cart = document.getElementById("cart-count");
const button = document.querySelectorAll(".add-to-cart-btn");
const totalPriceElement=document.getElementById("total-price");
const cartItemsContainer = document.getElementById("cart-items-container");


function updateCartUI(){
    cartItemsContainer.innerHTML = "";
    if (cartItems.length===0){
        cartItemsContainer.innerHTML +=`<h3>Ваша корзина пуста</h3>`;
        totalPriceElement.innerText=0;
        return;
    }

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
    step1.style.display="block";
    step2.style.display="none";
    step3.style.display="none";
});

const step1= document.getElementById("modal-step-1");
const step2 =document.getElementById("modal-step-2");
const goToCheckoutBtn = document.getElementById("go-to-checkout-btn");
const backToStep1Btn = document.getElementById("back-to-step-1");
const step3= document.getElementById("modal-step-3");
const finalOrderBtn=document.getElementById("final-order-btn");
const summaryAddress=document.getElementById("summary-address");
const backToStep2Btn=document.getElementById("back-to-step-2");

if (goToCheckoutBtn && step1 && step2){
    goToCheckoutBtn.addEventListener("click",()=>{
        if (count === 0){
            alert("Ваша корзина пуста! Добавьте что то перед оформлением заказа.")
            return;
        }
        step1.style.display="none";
        step2.style.display="block";

        const modalTitle = document.querySelector(".modal-window h3");
        if (modalTitle) {
            modalTitle.innerText = "Доставка";
        }
        const finalBtn = document.getElementById("final-order-btn");
        if (finalBtn) {
            finalBtn.innerText = "Продолжить";
        }
        if (myMap){
            myMap.container.fitToViewport()
        }
    });
}
if(backToStep1Btn && step1 && step2){
    backToStep1Btn.addEventListener("click",()=>{
        step2.style.display="none";
        step1.style.display="block";

         const modalTitle = document.querySelector(".modal-window h3");
        if (modalTitle) {
            modalTitle.innerText = "Ваша корзина";
        }
    });
}

if (finalOrderBtn && step2 && step3){
    finalOrderBtn.addEventListener("click",()=>{
        const userAddress = document.getElementById("suggest-address").value;

        if( userAddress.trim()===""){
            alert("Пожалуйста,введите адрес доставки или выберете его на карте");
            return;
        }

        if(summaryAddress){
            summaryAddress.innerText=""+userAddress;
        }
        updateFinalPrice();
        step2.style.display="none";
        step3.style.display="block";
    });
}
if (backToStep2Btn && step2 && step3){
    backToStep2Btn.addEventListener("click",()=>{
        step3.style.display="none";
        step2.style.display="block";
    });
}

ymaps.ready(init);

let myMap;
let myPlacemark;
function init() {

    myMap = new ymaps.Map("map", {
        center: [55.755814, 37.617635],
        zoom: 12,
        controls: ["zoomControl"]
    });

    myMap.events.add("click", function (e) {

        const coords = e.get("coords");
    console.log(coords); 


        if (myPlacemark) {
            myPlacemark.geometry.setCoordinates(coords);
        } else {

            myPlacemark = new ymaps.Placemark(
                coords,
                {
                    iconCaption: "Доставка сюда"
                },
                {
                    preset: "islands#orangeDotIcon"
                }
            );

            myMap.geoObjects.add(myPlacemark);
        }


        ymaps.geocode(coords)
            .then(function (res) {
                const firstGeoObject = res.geoObjects.get(0);
                if (firstGeoObject) {
                    const address = firstGeoObject.getAddressLine();
                    document.getElementById("suggest-address").value = address;
                }
            })
            .catch(function (err) {
            });

        });


}
const paymentGrid = document.querySelector(".payment-grid");
if (paymentGrid){
    paymentGrid.addEventListener("click",(event)=>{
        if(event.target.classList.contains("payment-btn")){
            const currentActive=document.querySelector(".payment-btn.active");
            if(currentActive){
                currentActive.classList.remove("active");
            }
            event.target.classList.add("active")
        }
    });
}
const applyPromobtn=document.getElementById("apply-promo-btn");
const promoInput = document.getElementById("promo-input");
const promoMessage = document.getElementById("promo-message");

applyPromobtn.addEventListener("click",()=>{
    const promoValue = document.getElementById("promo-input").value.trim().toUpperCase();

    if (promoValue === "YAKUDZA"){
        discountPercent = 10;
        promoMessage.innerText = "Промокод YAKUDZA применен! скидка 10%";
        promoMessage.style.color="green";
        promoMessage.style.display="block";

        updateFinalPrice();
    } else if (promoValue === "VARENIK") {
        discountPercent=80;
        promoMessage.innerText = "Промокод VARENIK применен! скидка 80%";
        promoMessage.style.color="green";
        promoMessage.style.display="block";

        updateFinalPrice();
    }else{
        discountPercent=0;
        promoMessage.innerText = "неверный промокод";
        promoMessage.style.color = "red";
        promoMessage.style.display="block";

        updateFinalPrice();
    }
});

const placeOrderBtn = document.getElementById("place-order-btn");



if(placeOrderBtn){
    placeOrderBtn.addEventListener("click",()=>{
        const emalVal = document.querySelector(".checkout-email").value.trim();
        if (emalVal ==="" || !emalVal.includes("@")){
            alert("Пожалуйста,введите коректный Email адрес");
            return;
        }
        const oplataSelect = document.querySelector(".payment-btn.active");
        if(!oplataSelect){
            alert("Пожалуйста выберете способ оплаты");
            return;
        }
        alert("Заказ успешно оформлен! Приятного аппетита 🍣");

        cartItems= [];
        count=0;
        discountPercent=0;
        cart.innerText=count;

        document.querySelector(".checkout-email").value="";
        document.getElementById("promo-input").value="";
        document.getElementById("suggest-address").value="";
        promoMessage.style.display="none";
        oplataSelect.classList.remove("active");
        updateCartUI();
        modal.classList.remove("active");
        step1.style.display = "block";
        step2.style.display = "none";
        step3.style.display = "none";
    })
}
