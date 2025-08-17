document.getElementById('burger').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    const isMobile = window.innerWidth <= 768;

    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('> a');
        
        link.addEventListener('click', function(e) {
            if (isMobile) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
            }
        });
    });
