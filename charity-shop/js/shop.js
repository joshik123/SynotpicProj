document.addEventListener('DOMContentLoaded', function() {
    // Get the cart icon and count span
    const cartIcon = document.getElementById('cart-icon');
    const cartCount = document.getElementById('cart-count');
    const sidebar = document.getElementById('sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');

    // Initialize cart count
    let itemCount = 0;

    // Event listener for cart icon click
    cartIcon.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });

    // Get the button that opens the modal
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    // Get the success message element
    const successMessage = document.getElementById("success-message");

    // When the user clicks on 'Add to Cart' button
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log("Add to Cart button clicked");
            const quantityInput = this.previousElementSibling;
            const quantity = parseInt(quantityInput.value);
            itemCount += quantity;
            cartCount.textContent = itemCount;
            console.log(`Item count updated: ${itemCount}`);
            // Show success message
            showSuccessMessage();
            // Reset quantity input to 1
            quantityInput.value = 0;
        });
    });

    // Function to show success message
    function showSuccessMessage() {
        console.log("Success");
        successMessage.style.display = "block";
        setTimeout(function() {
            successMessage.style.display = "none";
            console.log("/////");
        }, 2000); // Hide message after 2 seconds
    }
});