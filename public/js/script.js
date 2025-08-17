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

// Image Modal Functionality
function openModal(img) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    modal.style.display = "flex";
    modalImg.src = img.src;
    
    // Close modal when clicking outside image
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeModal();
        }
    }
}

function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

// Close modal with ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === "Escape") {
        closeModal();
    }
});