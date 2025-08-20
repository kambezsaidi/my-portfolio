document.addEventListener("DOMContentLoaded", function () {
  const burger = document.getElementById("burger");
  const nav = document.getElementById("navLinks");
  const dropdowns = document.querySelectorAll(".dropdown");

  // Burger toggle
  burger?.addEventListener("click", () => {
    nav?.classList.toggle("active");
    burger?.classList.toggle("active");
  });

  // Close menu after clicking a sub-link
  document.querySelectorAll("#navLinks a").forEach(a => {
    a.addEventListener("click", () => {
      if (window.innerWidth <= 768 && !a.parentElement.classList.contains("dropdown")) {
        nav?.classList.remove("active");
        burger?.classList.remove("active");
      }
    });
  });

  // Mobile dropdowns (accordion, two-tap fix)
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector("> a");
    if (!link) return;

    link.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        // Check if the dropdown is already active
        const isActive = dropdown.classList.contains("active");
        
        // Close all other dropdowns
        dropdowns.forEach(other => {
          if (other !== dropdown) other.classList.remove("active");
        });
        
        // If not active, prevent navigation and open dropdown
        if (!isActive) {
          e.preventDefault();
          dropdown.classList.add("active");
        }
        // If already active, allow default navigation (no preventDefault)
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