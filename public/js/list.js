document.addEventListener('DOMContentLoaded', function() {
    const sellForm = document.getElementById('sellForm');

    sellForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const itemType = document.getElementById('itemType').value;
        const itemName = document.getElementById('itemName').value;
        const itemDescription = document.getElementById('itemDescription').value;
        const itemQuantity = document.getElementById('itemQuantity').value;
        const itemPrice = document.getElementById('itemPrice').value;
        const itemImage = document.getElementById('itemImage').files[0];

        const reader = new FileReader();
        reader.onload = function(e) {
            const itemImageSrc = e.target.result;
            const newItem = {
                type: itemType,
                name: itemName,
                description: itemDescription,
                quantity: itemQuantity,
                price: itemPrice,
                imageSrc: itemImageSrc
            };

            // Save the new item to the server
            saveItemToServer(newItem);
            alert('Item listed successfully!');
        };
        reader.readAsDataURL(itemImage);

        sellForm.reset();
    });

    function saveItemToServer(item) {
        fetch('http://localhost:3000/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
        .then(response => response.json())
        .then(data => console.log('Item saved:', data))
        .catch(error => console.error('Error:', error));
    }
});
