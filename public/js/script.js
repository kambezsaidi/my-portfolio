document.addEventListener('DOMContentLoaded', function() {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const dropdowns = document.querySelectorAll('.dropdown');
  const burgerIcon = document.querySelector('.burger-icon');
  const closeIcon = document.querySelector('.close-icon');

  // Mobile menu toggle
  mobileToggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    burgerIcon.style.display = navLinks.classList.contains('active') ? 'none' : 'block';
    closeIcon.style.display = navLinks.classList.contains('active') ? 'block' : 'none';
  });

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

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('nav') && window.innerWidth <= 768) {
      navLinks.classList.remove('active');
      burgerIcon.style.display = 'block';
      closeIcon.style.display = 'none';
      dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
    }
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