// SLIDE LOGOS
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("logosSlider");
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  slider.addEventListener("mousedown", (e) => {
    isDragging = true;
    slider.classList.add("dragging");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDragging = false;
    slider.classList.remove("dragging");
  });

  slider.addEventListener("mouseup", () => {
    isDragging = false;
    slider.classList.remove("dragging");
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeft - walk;
  });

  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("touchmove", (e) => {
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeft - walk;
  });
});

// CARROSSEL MODELOS
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".carousel-list");
  const items = document.querySelectorAll(".carousel-item");
  const dotsContainer = document.querySelector(".carousel-dots");
  const prevBtn = document.querySelector(".carousel-arrow.prev");
  const nextBtn = document.querySelector(".carousel-arrow.next");

  let currentIndex = 0;

  function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    document.querySelectorAll(".carousel-dots button").forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  function createDots() {
    items.forEach((_, i) => {
      const dot = document.createElement("button");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentIndex = i;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    });
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
  });

  createDots();
});
