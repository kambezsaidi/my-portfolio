// Burger toggle
document.getElementById('burger')?.addEventListener('click', () => {
  document.getElementById('navLinks')?.classList.toggle('active');
  document.getElementById('burger')?.classList.toggle('active');
});

// Close menu after clicking any link (mobile quality-of-life)
document.querySelectorAll('#navLinks a').forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      document.getElementById('navLinks')?.classList.remove('active');
      document.getElementById('burger')?.classList.remove('active');
    }
  });
});

// Mobile dropdowns (accordion behaviour)
document.addEventListener('DOMContentLoaded', function () {
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('> a');
    if (!link) return;

    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        if (!dropdown.classList.contains('active')) {
          // First tap: open dropdown, block navigation
          e.preventDefault();
          dropdown.classList.add('active');

          // Close others
          dropdowns.forEach(other => {
            if (other !== dropdown) other.classList.remove('active');
          });
        } else {
          // Second tap: allow normal navigation
          dropdown.classList.remove('active');
          // don’t preventDefault here → will follow link
        }
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