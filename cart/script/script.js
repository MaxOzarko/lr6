document.addEventListener("DOMContentLoaded", function () {
    displayCartItems();
});

function displayCartItems() {
    var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    var cartTableBody = document.getElementById("cartTableBody");
    var totalSumElement = document.getElementById("totalSum");

    cartTableBody.innerHTML = "";
    var totalSum = 0;

    cartItems.forEach(function (item, index) {
        var row = document.createElement("tr");
        var productName = item.name;
        var productLink = item.link;
        var productPrice = item.price;
        var total = item.quantity * productPrice;

        totalSum += total;

        row.innerHTML = "<td>" + (index + 1) + "</td><td><a href='" 
        + productLink + "'>" + productName + "</a></td><td>" 
        + productPrice + " грн</td><td><input type='number' value='" 
        + item.quantity + "' min='1' onchange='updateQuantity(" 
        + index + ", this.value)'></td><td>" + total 
        + " грн</td><td><a href='#' class='delete' onclick='deleteItem("+ index + ")'>Видалити</a></td>";
        cartTableBody.appendChild(row);
    });

    totalSumElement.innerText = totalSum + " грн";
}

function updateQuantity(index, newQuantity) {
    var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    if (newQuantity > 0) {
        cartItems[index].quantity = parseInt(newQuantity);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        displayCartItems();
    }
}


function payment() {
    alert("Квитанція відправлена!");

    localStorage.removeItem("cartItems");
    displayCartItems(); 
}

function deleteItem(index) {
    var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems.splice(index, 1);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    displayCartItems();
    location.reload();
}