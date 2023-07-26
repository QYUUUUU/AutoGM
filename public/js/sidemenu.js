  document.addEventListener("DOMContentLoaded", function () {
    const sidebarMenu = document.getElementById("sidebarMenu");
    const mainNavbar = document.getElementById("main-navbar");
    const toggleButton = document.querySelector(".navbar-toggler");

    toggleButton.addEventListener("click", function () {
      sidebarMenu.classList.toggle("show");
      mainNavbar.classList.toggle("show");
    });
  });