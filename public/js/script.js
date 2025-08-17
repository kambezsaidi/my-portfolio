// =======================
// Mobile Menu Toggle
// =======================
document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burger');
    const navLinks = document.querySelector('nav ul');

    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle burger icon between ☰ and ✕
            burger.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
            // Close all dropdowns when toggling the menu
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });
    } else {
        console.error('Burger or navLinks not found in the DOM');
    }
});

// =======================
// Dropdown Functionality
// =======================
function setupDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    const isMobile = window.innerWidth <= 768;

    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.dropdown-toggle');

        // Remove any existing listeners by cloning the node
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);

        if (isMobile) {
            newLink.addEventListener('click', function (e) {
                e.preventDefault();
                // Close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('active');
                    }
                });
                // Toggle current dropdown
                dropdown.classList.toggle('active');
            });
        }
    });
}

// Run on page load and resize
document.addEventListener('DOMContentLoaded', setupDropdowns);
window.addEventListener('resize', setupDropdowns);

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