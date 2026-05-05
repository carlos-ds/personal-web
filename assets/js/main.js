// The value of this variable should remain aligned with the media query in CSS
const MOBILE_BREAKPOINT = 768;

let isNavigationHidden = true;

document.addEventListener("DOMContentLoaded", () => {
  toggleNavigation();
});

function toggleNavigation() {
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const navItems = document.querySelector(".nav-items");

  toggleAttributesForAssistiveTechnologiesOnMobileNavigation(navItems, true);

  hamburgerIcon.addEventListener("click", () => {
    toggleAttributesForAssistiveTechnologiesOnMobileNavigation(
      navItems,
      !isNavigationHidden,
    );

    if (isNavigationHidden) {
      navItems.classList.add("opaque");
      navItems.classList.add("height--auto");
    } else {
      navItems.classList.remove("opaque");
      navItems.classList.remove("height--auto");
    }

    const icon = document.querySelector(".material-symbols-outlined");
    icon.textContent = isNavigationHidden ? "close" : "menu";

    isNavigationHidden = !isNavigationHidden;
  });
}

function toggleAttributesForAssistiveTechnologiesOnMobileNavigation(
  navItems,
  isHidden,
) {
  const viewportWidth = window.innerWidth;

  if (viewportWidth < MOBILE_BREAKPOINT) {
    if (isHidden) {
      navItems.setAttribute("aria-hidden", true);
    } else {
      navItems.removeAttribute("aria-hidden");
    }
  }
}
