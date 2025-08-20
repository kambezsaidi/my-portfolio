document.addEventListener("DOMContentLoaded", function () {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('navLinks');
  const dropdowns = document.querySelectorAll('.dropdown');

  // Burger toggle - unified version
  burger?.addEventListener('click', () => {
    nav?.classList.toggle('active');
    burger?.classList.toggle('active');
  });

  // Close menu after clicking a real link (not dropdown parents)
  document.querySelectorAll('#navLinks a').forEach(a => {
    a.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        const parentLi = a.parentElement;
        
        // Only close if it's NOT a dropdown toggle
        if (!parentLi.classList.contains('dropdown')) {
          nav?.classList.remove('active');
          burger?.classList.remove('active');
        }
      }
    });
  });

  // Mobile dropdowns (accordion, two-tap fix)
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector("> a");
    if (!link) return;

    link.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        // Check if dropdown is already active
        if (!dropdown.classList.contains("active")) {
          // First tap - open dropdown and prevent navigation
          e.preventDefault();
          dropdown.classList.add("active");
          
          // Close other dropdowns
          dropdowns.forEach(other => {
            if (other !== dropdown) other.classList.remove("active");
          });
        } else {
          // Second tap - allow navigation (don't prevent default)
          dropdown.classList.remove("active");
          // The link will naturally navigate now
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