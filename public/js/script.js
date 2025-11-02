document.addEventListener("DOMContentLoaded", function () {
  const burger = document.getElementById("burger");
  const nav = document.getElementById("navLinks");

  // Burger toggle
  burger.addEventListener("click", () => {
    nav.classList.toggle("active");
    burger.classList.toggle("active");
  });

  // Close menu when clicking any link
  document.querySelectorAll("#navLinks a").forEach(a => {
    a.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        nav.classList.remove("active");
        burger.classList.remove("active");
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

