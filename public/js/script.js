// =======================
// Mobile menu toggle
// =======================
document.getElementById('burger')?.addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});

// =======================
// Dropdown functionality
// =======================
function setupDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    const isMobile = window.innerWidth <= 768;

    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('> a');

        // remove any old listeners by replacing node
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);

        newLink.addEventListener('click', function (e) {
            if (isMobile) {
                e.preventDefault();

                // close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('active');
                    }
                });

                // toggle current
                dropdown.classList.toggle('active');
            }
        });
    });
}

// Run on page load + resize
document.addEventListener('DOMContentLoaded', setupDropdowns);
window.addEventListener('resize', setupDropdowns);

// =======================
// Modal for Data Engineer images
// =======================
function openModal(img) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    modal.style.display = "block";
    modalImg.src = img.src;
}

function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}
