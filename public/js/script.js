// Mobile menu toggle
document.getElementById('burger')?.addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});

// Dropdown functionality
function setupDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    const isMobile = window.innerWidth <= 768;

    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('> a');
        
        // Remove previous event listeners to avoid duplicates
        link?.replaceWith(link.cloneNode(true));
        const newLink = dropdown.querySelector('> a');
        
        newLink?.addEventListener('click', function(e) {
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
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', setupDropdowns);

// Update on window resize
window.addEventListener('resize', setupDropdowns);