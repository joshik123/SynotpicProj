// JavaScript for form submission
        document.getElementById('contact-form').addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission
            

            const formData = new FormData(this);
            for (const [name, value] of formData.entries()) {
                console.log(`${name}: ${value}`);
            }

            alert('Your message has been sent!');
            this.reset(); // Reset the form after submission
        });