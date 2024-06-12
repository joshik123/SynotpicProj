// document.addEventListener('DOMContentLoaded', () => {
//     const darkModeToggle = document.getElementById('dark-mode');
//     const isDarkMode = localStorage.getItem('dark-mode') === 'true';

//     if (isDarkMode) {
//         document.body.classList.add('dark-mode');
//         darkModeToggle.checked = true;
//     }

//     darkModeToggle.addEventListener('change', () => {
//         if (darkModeToggle.checked) {
//             document.body.classList.add('dark-mode');
//             localStorage.setItem('dark-mode', 'true');
//         } else {
//             document.body.classList.remove('dark-mode');
//             localStorage.setItem('dark-mode', 'false');
//         }
//     });

    const form = document.getElementById('settings-form');

    form.addEventListener('DOMContentLoaded', () => {
        event.preventDefault();
        const saveButton = document.getElementById('save');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                event.preventDefault();

                const old_pass = document.getElementById('old-password').value;
                const new_pass = document.getElementById('new-password').value;
                const conf_pass = document.getElementById('confirm-password').value;
                const old_email = document.getElementById('old-email').value;
                const new_email = document.getElementById('new-email').value;
    
                fetch('/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ old_pass, new_pass,conf_pass, old_email ,new_email }),
                })
                .then(response => response.text())
                .then(data => {
                    document.getElementById('update').innerText = data;
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('update').innerText = "Error occurred while updating details.";
                });
    
            });
        }
    });
    
    
    