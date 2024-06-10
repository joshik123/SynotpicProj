document.getElementById('donation-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Assuming you want to simulate a successful donation with a simple thank you message
    document.getElementById('donation-form').style.display = 'none';
    document.getElementById('thank-you').classList.remove('hidden');
});