document.addEventListener('DOMContentLoaded', function() {
    // Get the cart icon and count span
    const cartIcon = document.getElementById('cart-icon');
    const cartCount = document.getElementById('cart-count');

    // Initialize cart count
    let itemCount = 0;

    // Add event listener to all 'Add to Cart' buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Increment item count
            itemCount++;
            
            // Update cart count
            cartCount.textContent = itemCount;

            // Add item to cart (you can implement this part as needed)
            // For now, let's just console log the added item's name and price
            const itemName = this.getAttribute('data-name');
            const itemPrice = this.getAttribute('data-price');
            console.log(`Added to cart: ${itemName} - $${itemPrice}`);

            // You can implement further functionality here, like adding the item to the actual cart
        });
    });
});