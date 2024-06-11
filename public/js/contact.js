// JavaScript for form submission
        document.getElementById('contact-form').addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission
            
            // You can add code here to handle form submission, such as sending an AJAX request
            // For demonstration, let's log the form data to the console
            const formData = new FormData(this);
            for (const [name, value] of formData.entries()) {
                console.log(`${name}: ${value}`);
            }

            // Optionally, you can add code to display a success message or redirect to a thank you page
            alert('Your message has been sent!');
            this.reset(); // Reset the form after submission
        });