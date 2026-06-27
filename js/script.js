// Mobile Navigation Menu

const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => {
    menu.classList.toggle("show");
});

// Close menu when a link is clicked

const links = document.querySelectorAll("#menu a");

links.forEach(link => {
    link.addEventListener("click", () => {
        menu.classList.remove("show");
    });
});

// Sticky navbar shadow while scrolling

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
        header.style.boxShadow = "0 5px 20px rgba(0,0,0,.15)";
    } else {
        header.style.boxShadow = "none";
    }
});
