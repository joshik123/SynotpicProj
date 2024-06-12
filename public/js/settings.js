    document.getElementById("settingsForm").addEventListener("submit", function(event) {
        event.preventDefault();
    
        const form = event.target;
        const formData = new FormData(form);
    
        fetch("/settings", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentEmail: formData.get('currentEmail'),
                newEmail: formData.get('newEmail'),
                currentPassword: formData.get('currentPassword'),
                newPassword: formData.get('newPassword')
            })
        })
        .then(response => {
            if (response.ok) {
                alert("Details have been changed successfully!");
            } else {
                return response.json().then(data => {
                    throw new Error(data.message);
                });
            }
        })
        .catch(error => {
            const errorMessage = document.getElementById("error-message");
            errorMessage.textContent = error.message;
            errorMessage.style.display = "block";
        });
    });
    

