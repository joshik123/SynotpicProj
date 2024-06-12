document.addEventListener('DOMContentLoaded', function() {
    // Get the donate button
    const donateButton = document.querySelector('.donate-button');

    // Get the donation modal and close button
    const modal = document.getElementById('donation-modal');
    const closeButton = modal.querySelector('.close');

    // Check if all necessary elements are found
    if (donateButton && modal && closeButton) {
        // Event listener for donate button click
        donateButton.addEventListener('click', function() {
            modal.style.display = 'block';
        });

        // Event listener for close button click
        closeButton.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        // Event listener for outside click to close modal
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Prevent form submission (if needed)
        const donationForm = modal.querySelector('form');
        donationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Your form submission logic here
            // This prevents the form from submitting and refreshing the page
        });
    } else {
        console.error('Error: One or more elements not found.');
    }
});