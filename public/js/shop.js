document.addEventListener('DOMContentLoaded', function() {
    // Get the cart icon and count span
    const cartIcon = document.getElementById('cart-icon');
    const cartCount = document.getElementById('cart-count');
    const basketItemsList = document.getElementById('basketItems');
    const successMessage = document.getElementById("success-message");
    const buyNowButton = document.getElementById('buyNowButton');

    // Initialize cart count and items array
    let itemCount = 0;
    let cartItems = [];

    // Event listener for cart icon click
    cartIcon.addEventListener('click', function() {
        const sidebar = document.getElementById('basketSidebar');
        sidebar.classList.toggle('open');
    });

    // Get the buttons to add items to the cart
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    // When the user clicks on 'Add to Cart' button
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemName = this.getAttribute('data-name');
            const itemPrice = parseFloat(this.getAttribute('data-price'));
            const quantityInput = this.previousElementSibling;
            const quantity = parseInt(quantityInput.value);

            // Update cart count
            itemCount += quantity;
            cartCount.textContent = itemCount;

            // Add item to cart items array
            const existingItem = cartItems.find(item => item.name === itemName);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cartItems.push({ name: itemName, price: itemPrice, quantity: quantity });
            }

            // Render basket items in sidebar
            renderBasketItems();

            // Show success message
            showSuccessMessage();

            // Reset quantity input to 1
            quantityInput.value = 1;
        });
    });

    // Function to render basket items in sidebar
    function renderBasketItems() {
        basketItemsList.innerHTML = '';
        cartItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`;
            basketItemsList.appendChild(listItem);
        });
    }

    // Function to show success message
    function showSuccessMessage() {
        successMessage.style.display = "block";
        setTimeout(function() {
            successMessage.style.display = "none";
        }, 2000); // Hide message after 2 seconds
    }

    // Event listener for Buy Now button
    buyNowButton.addEventListener('click', function() {
        alert('Proceeding to checkout with the following items:\n' +
            cartItems.map(item => `${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`).join('\n'));
    });
});
