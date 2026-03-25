document.addEventListener("DOMContentLoaded", function () {

    const elements = document.querySelectorAll(".fade-in");

    function reveal() {
        elements.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;

            if (elementTop < windowHeight - 50) {
                el.classList.add("show");
            }
        });
    }

    window.addEventListener("scroll", reveal);
    reveal();
});