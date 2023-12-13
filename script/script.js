document.addEventListener("DOMContentLoaded", function () {
    var shoppingCartIcon = document.getElementById("shoppingCart");
    var cartItemCount = document.getElementById("cartItemCount");
    var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    var cartModal = document.getElementById("cartModal");
    var quantityModal = document.getElementById("quantityModal");
    var productLink, productName, productPrice;
    var productContainer = document.getElementById("productContainer");
    
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                var content = atob(response.content);
                var products = JSON.parse(content);
                displayProducts(products);
            } else {
                console.error("Failed to load products.json");
            }
        }
    };
    xhr.open("GET", "https://api.github.com/repos/MaxOzarko/lr6/contents/products.json", true);
    xhr.send();
    
    fetch("https://raw.githubusercontent.com/MaxOzarko/lr6/main/products.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load products.json");
            }
            return response.json();
        })
        .then(products => {
            displayProducts(products);
        })
        .catch(error => {
            console.error(error.message);
        });

    function displayProducts(products) {
        productContainer.innerHTML = "";
    
        products.forEach(function (product, index) {
            var card = document.createElement("div");
            card.className = "card" + (product.new ? " new" : "") + (product.bestseller ? " hit" : "");
    
            var category = '<h2 class="card__category"><p title="' + product.category + '"><a href="">' + product.category + '</a></p></h2>';
            var image = '<div class="card__img"><img src="' + product.image + '" alt="' + product.name + '"></div>';
            var productName = '<h3 class="card__name"><p title="' + product.name + '"><a href="">' + product.name + '</a></p></h3>';
            var price = '<p class="card__price">' + (product.discount ? '<span class="line">' + product.price + '</span> ' + product.discountprice : product.price) + ' грн</p>';
            var addToCart = '<a href="#" class="card__tocart">' + (product.available ? 'у корзину' : 'незабаром у продажі') + '</a>';
    
            card.innerHTML = category + image + productName + price + addToCart;
            productContainer.appendChild(card);
        });
    }    

    document.body.addEventListener("click", function (event) {
        var button = event.target.closest(".card__tocart");

        if (button) {
            var parentCard = button.parentElement;
            var productAnchor = parentCard.querySelector('.card__name a');
            var priceElement = parentCard.querySelector('.card__price');

            if (productAnchor && priceElement) {
                productName = productAnchor.innerText;
                productLink = productAnchor.href;
                productPrice = getPrice(priceElement);

                openQuantityModal();
            } else {
                console.error("Required elements not found.");
            }
        }
    });

    function openQuantityModal() {
        var quantityInput = document.getElementById("quantityInput");
        if (quantityModal && quantityInput) {
            quantityModal.style.display = "flex";
            quantityInput.value = 1;
        } else {
            console.error("Quantity modal or input not found.");
        }
    }

    window.closeQuantityModal = function () {
        var quantityModal = document.getElementById("quantityModal");
        if (quantityModal) {
            quantityModal.style.display = "none";
        } else {
            console.error("Quantity modal not found.");
        }
    };

    shoppingCartIcon.addEventListener("click", function () {
        if (cartItems.length === 0) {
            openCartModal();
        } else {
            window.location.href = "cart/index.html";
        }
    });

    function openCartModal() {
        if (cartItems.length === 0) {
            cartModal.style.display = "flex";
        } else {
            cartModal.style.display = "flex";
            var modalContent = `
                <div>
                    Товар додано
                    <div>
                        <button onclick="goToCart()">Перейти у корзину</button>
                        <button onclick="continueShopping()">Повернутись до покупок</button>
                    </div>
                </div>`;
            cartModal.innerHTML = modalContent;
        }
    }

    window.goToCart = function () {
        window.location.href = "cart/index.html";
    };

    window.continueShopping = function () {
        cartModal.style.display = "none";
    };

    window.closeCartModal = function () {
        cartModal.style.display = "none";
    };

    window.openQuantityModal = function () {
        openQuantityModal();
    };

    window.addToCartModal = function () {
        var quantityInput = document.getElementById("quantityInput");
        var quantity = quantityInput.value;

        if (isValidQuantity(quantity)) {
            addToCart(productLink, quantity, productName, productPrice);
            updateCartItemCount();
            closeQuantityModal();
            openCartModal();
        } else {
            console.error("Invalid quantity.");
        }
    };

    function updateCartItemCount() {
        var cartItemCount = document.getElementById("cartItemCount");
        var uniqueItemCount = getUniqueItemCount();
        cartItemCount.innerText = uniqueItemCount;
    }
    
    
    updateCartItemCount();

    function addToCart(productLink, quantity, productName, productPrice) {
        var item = {
            link: productLink,
            quantity: parseInt(quantity),
            name: productName,
            price: productPrice
        };
        cartItems.push(item);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

    function getUniqueItemCount() {
        return new Set(cartItems.map(item => item.name)).size;
    }
    

    function isValidQuantity(quantity) {
        return quantity !== null && quantity !== "" && !isNaN(quantity) && parseInt(quantity) > 0;
    }

    function getPrice(element) {
        var priceString = element.innerText.trim().replace("ГРН", "").replace(/\s+/g, '');
        return parseFloat(priceString);
    }
});