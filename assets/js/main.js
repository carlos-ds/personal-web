let isNavigationClosed = true;

document.addEventListener("DOMContentLoaded", () => {
  const hamburgerIcon = document.getElementById("hamburger-icon");

  hamburgerIcon.addEventListener("click", () => {
    const navItems = document.querySelector(".nav-items");

    if (isNavigationClosed) {
      navItems.classList.add("opaque");
      navItems.classList.add("height--auto");
    } else {
      navItems.classList.remove("opaque");
      navItems.classList.remove("height--auto");
    }

    const icon = document.querySelector(".material-symbols-outlined");
    icon.textContent = isNavigationClosed ? "close" : "menu";

    isNavigationClosed = !isNavigationClosed;
  });
});
