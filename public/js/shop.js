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

    // Function to show success message
    function showSuccessMessage() {
        successMessage.style.display = "block";
        setTimeout(function() {
            successMessage.style.display = "none";
        }, 2000); // Hide after 2 seconds
    }

    // When the user clicks on 'Add to Cart' button
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the click event from bubbling up to the product item
            console.log("Add to Cart button clicked");
            const quantityInput = this.previousElementSibling;
            const quantity = parseInt(quantityInput.value);
            itemCount += quantity;
            cartCount.textContent = itemCount;
            console.log(`Item count updated: ${itemCount}`);
            // Show success message
            showSuccessMessage();
            // Reset quantity input to 1
            quantityInput.value = 1;
        });
    });

    // Product Details
    const products = {
        1: {
            name: "Sweetcorn",
            price: "$10.00",
            description: "Fresh sweetcorn sourced locally.",
            image: "images/sweetcorn.png"
        },
        2: {
            name: "Rice",
            price: "£10.00",
            description: "Premium quality rice imported from Asia.",
            image: "images/rice.png"
        },
        3: {
            name: "Tuna",
            price: "£20.00",
            description: "Wild-caught tuna, rich in omega-3 fatty acids.",
            image: "images/tuna.png"
        }
    };

    // Get the modal
    const modal = document.getElementById('product-modal');

    // When the user clicks on a product, open the modal
    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            console.log("Product ID:", productId); // Check if productId is correctly obtained
            const product = products[productId];
            console.log("Product:", product); // Check the value of product
            const modalContent = `
                <div>
                    <img src="${product.image}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p><strong>Price:</strong> ${product.price}</p>
                    <p><strong>Description:</strong> ${product.description}</p>
                </div>
            `;
            document.getElementById('product-details').innerHTML = modalContent;
            modal.style.display = "block";
        });
    });

    // Get the <span> element that closes the modal
    const span = document.querySelector("#product-modal .close");

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
});