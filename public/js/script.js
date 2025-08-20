// Burger toggle
document.getElementById('burger')?.addEventListener('click', () => {
  document.getElementById('navLinks')?.classList.toggle('active');
  document.getElementById('burger')?.classList.toggle('active');
});

// Close menu after clicking a real link (not dropdown parents)
document.querySelectorAll('#navLinks a').forEach(a => {
  a.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      const parentLi = a.parentElement;
      // Only close if it's NOT a dropdown toggle
      if (!parentLi.classList.contains('dropdown')) {
        document.getElementById('navLinks')?.classList.remove('active');
        document.getElementById('burger')?.classList.remove('active');
      }
    }
  });
});

// Mobile dropdowns (accordion behaviour, two-tap fix)
document.addEventListener("DOMContentLoaded", function () {
  const dropdowns = document.querySelectorAll(".dropdown");
  const nav = document.getElementById("navLinks");
  const burger = document.getElementById("burger");

  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector("> a");
    if (!link) return;

    link.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        if (!dropdown.classList.contains("active")) {
          // stop link navigation on first tap
          e.preventDefault();
          dropdown.classList.add("active");

          // close all other dropdowns
          dropdowns.forEach(other => {
            if (other !== dropdown) other.classList.remove("active");
          });

          // 🔒 force burger/nav to stay open
          nav.classList.add("active");
          burger.classList.add("active");
        } else {
          // second tap → follow link (don’t preventDefault)
          dropdown.classList.remove("active");
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