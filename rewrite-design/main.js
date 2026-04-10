document.addEventListener("DOMContentLoaded", () => {
  const hamburgerIcon = document.getElementById("hamburger-icon");
  hamburgerIcon.addEventListener("click", () => {
    const navItems = document.querySelector(".nav-items");
    navItems.style.opacity = 1;
    navItems.style.height = "auto";
  });
});
