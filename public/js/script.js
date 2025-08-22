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

<form id="contact-form" action="/contact" method="POST">
  <!-- fields here -->
  <button type="submit" class="submit-btn">Send Message</button>
</form>

<div id="form-message" style="margin-top:1em;"></div>

<script>
document.getElementById("contact-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const form = e.target;
  const data = {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value
  };

  try {
    const res = await fetch("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    const msgBox = document.getElementById("form-message");

    if (result.success) {
      msgBox.textContent = "✅ Message sent successfully!";
      msgBox.style.color = "green";
      form.reset();
    } else {
      msgBox.textContent = "❌ " + result.message;
      msgBox.style.color = "red";
    }
  } catch (err) {
    document.getElementById("form-message").textContent = "⚠️ Something went wrong.";
  }
});
</script>
