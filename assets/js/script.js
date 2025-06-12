// SLIDE LOGOS
document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".logos-slider");

  sliders.forEach((slider) => {
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    // Mouse
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

    // Touch
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
});

// CARROSSEL
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".carousel-visual, .carousel-models")
    .forEach((carouselVisual) => {
      const carousel = carouselVisual.querySelector(".carousel-list");
      const items = carouselVisual.querySelectorAll(".carousel-item");
      const prevBtn = carouselVisual.querySelector(".carousel-arrow.prev");
      const nextBtn = carouselVisual.querySelector(".carousel-arrow.next");
      const dotsContainer = carouselVisual.querySelector(".carousel-dots");

      let currentIndex = 0;

      // Detecta o tipo de carrossel
      const isHalfVisible = carouselVisual.classList.contains(
        "carousel-visual--half"
      );
      const slideWidth = isHalfVisible ? 66.66 : 100;

      function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * slideWidth}%)`;

        if (isHalfVisible) {
          prevBtn.disabled = currentIndex === 0;
          nextBtn.disabled = currentIndex >= items.length - 1;
        }

        if (dotsContainer) {
          dotsContainer.querySelectorAll("button").forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
          });
        }
      }

      function createDots() {
        if (!dotsContainer) return;

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

      prevBtn?.addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        } else if (!isHalfVisible) {
          currentIndex = items.length - 1;
          updateCarousel();
        }
      });

      nextBtn?.addEventListener("click", () => {
        if (currentIndex < items.length - 1) {
          currentIndex++;
          updateCarousel();
        } else if (!isHalfVisible) {
          currentIndex = 0;
          updateCarousel();
        }
      });

      createDots();
      updateCarousel();
    });
});

// TABS
const buttons = document.querySelectorAll(".tab-btn");
const panes = document.querySelectorAll(".tab-pane");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("active"));
    panes.forEach((p) => p.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

const tabSlide = document.querySelector(".tab-slide");
let isDown = false;
let startX;
let scrollLeft;

tabSlide.addEventListener("mousedown", (e) => {
  isDown = true;
  tabSlide.classList.add("grabbing");
  startX = e.pageX - tabSlide.offsetLeft;
  scrollLeft = tabSlide.scrollLeft;
});

tabSlide.addEventListener("mouseleave", () => {
  isDown = false;
  tabSlide.classList.remove("grabbing");
});

tabSlide.addEventListener("mouseup", () => {
  isDown = false;
  tabSlide.classList.remove("grabbing");
});

tabSlide.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - tabSlide.offsetLeft;
  const walk = (x - startX) * 1.5; // scroll speed
  tabSlide.scrollLeft = scrollLeft - walk;
});
