document.addEventListener("DOMContentLoaded", function () {
  const burger = document.getElementById("burger");
  const nav = document.getElementById("navLinks");
  const dropdowns = document.querySelectorAll(".dropdown");

  // Burger toggle
  burger.addEventListener("click", () => {
    nav.classList.toggle("active");
    burger.classList.toggle("active");
  });

  // Mobile dropdowns (two-tap system)
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector("> a");
    
    link.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        // Check if dropdown is already active
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

  // Close menu when clicking on non-dropdown links
  document.querySelectorAll("#navLinks a").forEach(a => {
    a.addEventListener("click", () => {
      if (window.innerWidth <= 768 && !a.parentElement.parentElement.classList.contains("dropdown-content")) {
        // Close the menu if it's not a dropdown item
        nav.classList.remove("active");
        burger.classList.remove("active");
        
        // Close all dropdowns
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove("active");
        });
      }
    });
  });

  // Close dropdowns when clicking outside (on mobile)
  document.addEventListener("click", function(e) {
    if (window.innerWidth <= 768 && 
        nav.classList.contains("active") &&
        !e.target.closest("#navLinks")) {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove("active");
      });
    }
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