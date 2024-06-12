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
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the click event from bubbling up to the product item
            console.log("Add to Cart button clicked");
            const quantityInput = this.previousElementSibling;
            const quantity = parseInt(quantityInput.value);
            itemCount += quantity;
            cartCount.textContent = itemCount;
            console.log(`Item count updated: ${itemCount}`);
             quantityInput.value = 0;
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
        },
        4: {
            name:"Beans",
            price:"0.50",
            description: "Fresh beans, rich in carbohydrates.",
            image:"images/beans.jpeg"
        },
        5:{
            name:"Bananna",
            price:"0.75",
            description: "Fresh banannas sourced locally",
            image:"images/bananna.png"
        },
        6:{
            name:"Carrots",
            price:"£1.00",
            description: "Fresh carrots sourced locally",
            image:"images/carrots.png"
        },
        7:{
            name:"Cucumber",
            price:"0.67",
            description:"Fresh tomatoes freshly picked",
            image:"images/cucumber.png"
        },
        8:{
            name:"Chicken",
            price:"£2.00",
            description:"Fresh raw chicken",
            image:"images/chicken.png"
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

    // Filter products based on category
    document.getElementById('category').addEventListener('change', function(){
        var category = this.value;
        var productItems = document.querySelectorAll('.product-item');
        productItems.forEach(item => {
            if(category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Sort products
    document.getElementById('sort').addEventListener('change', function(){
        var sortOption = this.value;
        var productItems = document.querySelectorAll('.product-item');
        var sortedItems = Array.from(productItems).sort((a, b) => {
            if(sortOption === 'price-low') {
                return parseFloat(a.querySelector('p').textContent.replace(/[^\d.]/g, '')) - parseFloat(b.querySelector('p').textContent.replace(/[^\d.]/g, ''));
            } else if(sortOption === 'price-high') {
                return parseFloat(b.querySelector('p').textContent.replace(/[^\d.]/g, '')) - parseFloat(a.querySelector('p').textContent.replace(/[^\d.]/g, ''));
            } else if(sortOption === 'name-asc') {
                return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
            } else if(sortOption === 'name-desc') {
                return b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent);
            }
        });
        var grid = document.querySelector('.product-grid');
        grid.innerHTML = '';
        sortedItems.forEach(item => {
            grid.appendChild(item);
        });
    });
});
