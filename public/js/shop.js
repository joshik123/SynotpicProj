document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.getElementById('cart-icon');
    const cartCount = document.getElementById('cart-count');
    const sidebar = document.getElementById('sidebar');
    const cartItemsList = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const buyNowButton = document.querySelector('.buy-now-button');

    let totalPrice = 0;
    let cartItems = [];

    let itemCount = 0;

    cartIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        sidebar.classList.toggle('open');
    });

    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && event.target !== cartIcon) {
            sidebar.classList.remove('open');
        }
    });

    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    const successMessage = document.getElementById("success-message");

    const products = {
        1: {
            name: "Sweetcorn",
            price: 10.00,
            description: "Fresh sweetcorn sourced locally.",
            image: "images/sweetcorn.png"
        },
        2: {
            name: "Rice",
            price: 10.00,
            description: "Premium quality rice imported from Asia.",
            image: "images/rice.png"
        },
        3: {
            name: "Tuna",
            price: 20.00,
            description: "Wild-caught tuna, rich in omega-3 fatty acids.",
            image: "images/tuna.png"
        },
        4: {
            name: "Beans",
            price: 0.50,
            description: "Fresh beans, rich in carbohydrates.",
            image: "images/beans.jpeg"
        },
        5: {
            name: "Bananna",
            price: 0.75,
            description: "Fresh banannas sourced locally",
            image: "images/bananna.png"
        },
        6: {
            name: "Carrots",
            price: 1.00,
            description: "Fresh carrots sourced locally",
            image: "images/carrots.png"
        },
        7: {
            name: "Cucumber",
            price: 0.67,
            description: "Fresh tomatoes freshly picked",
            image: "images/cucumber.png"
        },
        8: {
            name: "Chicken",
            price: 2.00,
            description: "Fresh raw chicken",
            image: "images/chicken.png"
        }
    };

    const modal = document.getElementById('product-modal');

    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const product = products[productId];
            const modalContent = `
                <div>
                    <img src="${product.image}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p><strong>Price:</strong> £${product.price.toFixed(2)}</p>
                    <p><strong>Description:</strong> ${product.description}</p>
                </div>
            `;
            document.getElementById('product-details').innerHTML = modalContent;
            modal.style.display = "block";
        });
    });

    const span = document.querySelector("#product-modal .close");
    span.onclick = function() {
        modal.style.display = "none";
    };
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    document.getElementById('category').addEventListener('change', function() {
        var category = this.value;
        var productItems = document.querySelectorAll('.product-item');
        productItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    document.getElementById('sort').addEventListener('change', function() {
        var sortOption = this.value;
        var productItems = document.querySelectorAll('.product-item');
        var sortedItems = Array.from(productItems).sort((a, b) => {
            if (sortOption === 'price-low') {
                return parseFloat(a.querySelector('p').textContent.replace(/[^\d.]/g, '')) - parseFloat(b.querySelector('p').textContent.replace(/[^\d.]/g, ''));
            } else if (sortOption === 'price-high') {
                return parseFloat(b.querySelector('p').textContent.replace(/[^\d.]/g, '')) - parseFloat(a.querySelector('p').textContent.replace(/[^\d.]/g, ''));
            } else if (sortOption === 'name-asc') {
                return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
            } else if (sortOption === 'name-desc') {
                return b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent);
            }
        });
        var grid = document.querySelector('.product-grid');
        grid.innerHTML = '';
        sortedItems.forEach(item => {
            grid.appendChild(item);
        });
    });

    function addToCart(event) {
        event.stopPropagation();
        const productName = this.getAttribute('data-name');
        const productPrice = parseFloat(this.getAttribute('data-price'));
        const quantityInput = this.previousElementSibling;
        const quantity = parseInt(quantityInput.value);

        if (quantity > 0) {
            itemCount += quantity;
            totalPrice += productPrice * quantity;
            cartCount.textContent = itemCount;
            totalPriceElement.textContent = `£${totalPrice.toFixed(2)}`;

            const existingItem = cartItems.find(item => item.name === productName);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                const productImage = this.parentElement.querySelector('img').src;
                cartItems.push({ name: productName, price: productPrice, quantity: quantity, image: productImage });
            }

            renderCartItems();
            quantityInput.value = 1;
        }
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    function renderCartItems() {
        cartItemsList.innerHTML = '';
        cartItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'cart-item';
            listItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>£${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
            `;
            cartItemsList.appendChild(listItem);
        });
    }

    buyNowButton.addEventListener('click', function() {
        alert('Proceeding to checkout with the following items:\n' +
            cartItems.map(item => `${item.name} - £${item.price.toFixed(2)} x ${item.quantity}`).join('\n') +
            `\n\nTotal: £${totalPrice.toFixed(2)}`);
    });

    function loadItemsFromServer() {
        fetch('http://localhost:3000/items')
            .then(response => response.json())
            .then(items => {
                items.forEach(addItemToShop);
            })
            .catch(error => console.error('Error:', error));
    }

    function addItemToShop(item) {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.setAttribute('data-product-id', item.id);
        productItem.innerHTML = `
            <img src="${item.imageSrc}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p>£${parseFloat(item.price).toFixed(2)}</p>
            <input type="number" class="quantity-input" value="1" min="1">
            <button class="add-to-cart" data-name="${item.name}" data-price="${parseFloat(item.price).toFixed(2)}">Add to Cart</button>
        `;
        document.querySelector('.product-grid').appendChild(productItem);
        productItem.querySelector('.add-to-cart').addEventListener('click', addToCart);
    }

    loadItemsFromServer();
});
