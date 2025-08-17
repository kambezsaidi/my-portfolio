document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');

    // Dropdown functionality for mobile
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('> a');
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) { // Only on mobile
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) other.classList.remove('active');
                });
            }
        });
    });
});

// =======================
// Modal for Data Engineer Images
// =======================
function openModal(img) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    if (modal && modalImg) {
        modal.style.display = "block";
        modalImg.src = img.src;
    }
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    if (modal) {
        modal.style.display = "none";
    }
}