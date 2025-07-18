function initCarouselInfinite() {
  const track = document.querySelector(".carousel-track");
  if (!track) return;
  const slides = Array.from(track.children);
  slides.forEach((slide) => {
    const clone = slide.cloneNode(true);
    track.appendChild(clone);
  });
}

function initLogosSlider() {
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

    ["mouseleave", "mouseup"].forEach((evt) =>
      slider.addEventListener(evt, () => {
        isDragging = false;
        slider.classList.remove("dragging");
      })
    );

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
}

function initCarouselVisual() {
  document
    .querySelectorAll(".carousel-visual, .carousel-models")
    .forEach((carouselVisual) => {
      const carousel = carouselVisual.querySelector(".carousel-list");
      const items = carouselVisual.querySelectorAll(
        ".carousel-item, .testimonials-item"
      );
      const prevBtn = carouselVisual.querySelector(".carousel-arrow.prev");
      const nextBtn = carouselVisual.querySelector(".carousel-arrow.next");
      const dotsContainer = carouselVisual.querySelector(".carousel-dots");

      let currentIndex = 0;
      const isHalfVisible = carouselVisual.classList.contains(
        "carousel-visual--half"
      );

      function getSlideWidth() {
        return window.innerWidth <= 1024 ? 100 : isHalfVisible ? 66.66 : 100;
      }

      function updateCarousel() {
        setPositionByIndex();
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
        dotsContainer.innerHTML = "";
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
        if (currentIndex > 0) currentIndex--;
        else if (!isHalfVisible) currentIndex = items.length - 1;
        updateCarousel();
      });

      nextBtn?.addEventListener("click", () => {
        if (currentIndex < items.length - 1) currentIndex++;
        else if (!isHalfVisible) currentIndex = 0;
        updateCarousel();
      });

      // DRAG SUPPORT
      let isDragging = false;
      let startX = 0;
      let currentTranslate = 0;
      let prevTranslate = 0;
      let animationID = 0;

      function getPositionX(event) {
        return event.type.includes("mouse")
          ? event.pageX
          : event.touches[0].clientX;
      }

      function animation() {
        setCarouselPosition();
        if (isDragging) requestAnimationFrame(animation);
      }

      function setCarouselPosition() {
        carousel.style.transform = `translateX(${currentTranslate}px)`;
      }

      function setPositionByIndex() {
        const slideWidth = getSlideWidth();
        currentTranslate =
          -currentIndex * (carousel.offsetWidth * (slideWidth / 100));
        prevTranslate = currentTranslate;
        carousel.style.transform = `translateX(${currentTranslate}px)`;
      }

      function touchStart(event) {
        isDragging = true;
        startX = getPositionX(event);
        animationID = requestAnimationFrame(animation);
        carousel.classList.add("grabbing");
      }

      function touchMove(event) {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startX;
      }

      function touchEnd() {
        cancelAnimationFrame(animationID);
        isDragging = false;

        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -50 && currentIndex < items.length - 1) currentIndex++;
        if (movedBy > 50 && currentIndex > 0) currentIndex--;

        setPositionByIndex();
        carousel.classList.remove("grabbing");
        updateCarousel();
      }

      carousel.addEventListener("touchstart", touchStart);
      carousel.addEventListener("touchmove", touchMove);
      carousel.addEventListener("touchend", touchEnd);

      carousel.addEventListener("mousedown", touchStart);
      carousel.addEventListener("mousemove", touchMove);
      carousel.addEventListener("mouseup", touchEnd);
      carousel.addEventListener("mouseleave", () => {
        if (isDragging) touchEnd();
      });

      window.addEventListener("resize", () => {
        updateCarousel();
      });

      createDots();
      updateCarousel();
    });
}

function initTabs() {
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
  if (!tabSlide) return;

  let isDown = false;
  let startX, scrollLeft;

  tabSlide.addEventListener("mousedown", (e) => {
    isDown = true;
    tabSlide.classList.add("grabbing");
    startX = e.pageX - tabSlide.offsetLeft;
    scrollLeft = tabSlide.scrollLeft;
  });

  ["mouseleave", "mouseup"].forEach((event) =>
    tabSlide.addEventListener(event, () => {
      isDown = false;
      tabSlide.classList.remove("grabbing");
    })
  );

  tabSlide.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - tabSlide.offsetLeft;
    const walk = (x - startX) * 1.5;
    tabSlide.scrollLeft = scrollLeft - walk;
  });
}

function initScreenshotSlider() {
  const track = document.querySelector(".screenshots-slider .slider-track");
  if (!track) return;

  let offset = 0;
  const speed = 0.5;
  let direction = 1;

  function animate() {
    offset += speed * direction;

    const maxScroll = track.scrollWidth - track.clientWidth;
    if (offset >= maxScroll) direction = -1;
    if (offset <= 0) direction = 1;

    track.style.transform = `translate3d(-${offset}px, 0, 0)`;

    requestAnimationFrame(animate);
  }

  animate();
}

function initScrollColumns() {
  const col1 = document.querySelector(".column-1 .column-inner");
  const col2 = document.querySelector(".column-2 .column-inner");
  const col3 = document.querySelector(".column-3 .column-inner");

  if (!col1 || !col2 || !col3) return;

  function handleScroll() {
    const scrollY = window.scrollY;
    const screenWidth = window.innerWidth;

    let offset1 = -200;
    let offset2 = 0;
    let offset3 = -250;
    let speed1 = 0.2;
    let speed2 = -0.2;
    let speed3 = 0.1;

    if (screenWidth <= 768) {
      offset1 = -80;
      offset2 = 0;
      offset3 = -100;
      speed1 = 0.1;
      speed2 = -0.1;
      speed3 = 0.05;
    } else if (screenWidth <= 1024) {
      offset1 = -150;
      offset2 = 0;
      offset3 = -180;
      speed1 = 0.15;
      speed2 = -0.15;
      speed3 = 0.08;
    }

    col1.style.transform = `translateY(${offset1 + scrollY * speed1}px)`;
    col2.style.transform = `translateY(${offset2 + scrollY * speed2}px)`;
    col3.style.transform = `translateY(${offset3 + scrollY * speed3}px)`;
  }

  handleScroll();
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll);
}

function initHamburgerMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const headerContent = document.querySelector(".header-content");

  if (!toggle || !headerContent) return;

  toggle.addEventListener("click", () => {
    headerContent.classList.toggle("menu-open");

    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", !expanded);
  });
}

function initCardCarousel() {
  document.querySelectorAll(".carousel-wrapper").forEach((wrapper) => {
    const carousel = wrapper.querySelector(".carousel-list");
    const items = wrapper.querySelectorAll(".carousel-item");
    const dotsContainer = wrapper.querySelector(".carousel-dots");

    if (!carousel || !dotsContainer || items.length === 0) return;

    let currentIndex = 0;
    let visibleItems = window.innerWidth >= 1024 ? 4 : 1;
    let slideWidthPercent = 100 / visibleItems;

    function updateVisibleItems() {
      visibleItems = window.innerWidth >= 1024 ? 4 : 1;
      slideWidthPercent = 100 / visibleItems;
    }

    function updateCarousel() {
      carousel.style.transform = `translateX(-${
        currentIndex * slideWidthPercent
      }%)`;
      updateDots();
    }

    function createDots() {
      dotsContainer.innerHTML = "";
      const totalSlides = Math.ceil(items.length / visibleItems);

      if (visibleItems > 1) {
        dotsContainer.style.display = "none";
        return;
      } else {
        dotsContainer.style.display = "flex";
      }

      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement("button");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
          currentIndex = i;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (visibleItems > 1) return;

      const totalSlides = Math.ceil(items.length / visibleItems);
      if (!dotsContainer) return;

      const dots = dotsContainer.querySelectorAll("button");
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    }

    function clampIndex() {
      const maxIndex = Math.ceil(items.length / visibleItems) - 1;
      if (currentIndex < 0) currentIndex = 0;
      if (currentIndex > maxIndex) currentIndex = maxIndex;
    }

    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    function touchStart(index, event) {
      if (visibleItems > 1) return;

      isDragging = true;
      startX = getPositionX(event);
      animationID = requestAnimationFrame(animation);
      carousel.classList.add("grabbing");
    }

    function touchMove(event) {
      if (!isDragging) return;
      const currentPosition = getPositionX(event);
      currentTranslate = prevTranslate + currentPosition - startX;
    }

    function touchEnd() {
      cancelAnimationFrame(animationID);
      isDragging = false;

      const movedBy = currentTranslate - prevTranslate;

      if (
        movedBy < -50 &&
        currentIndex < Math.ceil(items.length / visibleItems) - 1
      )
        currentIndex++;
      if (movedBy > 50 && currentIndex > 0) currentIndex--;

      setPositionByIndex();
      carousel.classList.remove("grabbing");
      updateDots();
    }

    function getPositionX(event) {
      return event.type.includes("mouse")
        ? event.pageX
        : event.touches[0].clientX;
    }

    function animation() {
      setCarouselPosition();
      if (isDragging) requestAnimationFrame(animation);
    }

    function setCarouselPosition() {
      carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    function setPositionByIndex() {
      currentTranslate = -currentIndex * (carousel.offsetWidth / visibleItems);
      prevTranslate = currentTranslate;
      carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    carousel.addEventListener("touchstart", (e) => touchStart(currentIndex, e));
    carousel.addEventListener("touchmove", touchMove);
    carousel.addEventListener("touchend", touchEnd);

    carousel.addEventListener("mousedown", (e) => touchStart(currentIndex, e));
    carousel.addEventListener("mousemove", touchMove);
    carousel.addEventListener("mouseup", touchEnd);
    carousel.addEventListener("mouseleave", () => {
      if (isDragging) touchEnd();
    });

    function init() {
      updateVisibleItems();
      createDots();
      currentIndex = 0;
      if (visibleItems > 1) {
        carousel.style.transition = "transform 0.4s ease-in-out";
        carousel.style.transform = `translateX(-${
          currentIndex * slideWidthPercent
        }%)`;
      } else {
        carousel.style.transition = "transform 0.3s ease-out";
        setPositionByIndex();
      }
    }

    window.addEventListener("resize", () => {
      init();
    });

    init();
  });
}

function initProgressOnView(percent) {
  const path = document.querySelector(".progress-path");
  if (!path) return;

  const totalLength = path.getTotalLength();
  percent = Math.min(Math.max(percent, 0), 100);

  path.style.strokeDasharray = totalLength;
  path.style.strokeDashoffset = totalLength;

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          path.style.transition = "stroke-dashoffset 2s ease";
          path.style.strokeDashoffset = totalLength * (1 - percent / 100);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(path);
}

function initMultipleProgressOnView() {
  const paths = document.querySelectorAll(".progress-path");

  paths.forEach((path) => {
    const totalLength = path.getTotalLength();
    const percent = Math.min(
      Math.max(parseFloat(path.dataset.percent) || 0, 0),
      100
    );

    path.style.strokeDasharray = totalLength;
    path.style.strokeDashoffset = totalLength;

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            path.style.transition = "stroke-dashoffset 2s ease";
            path.style.strokeDashoffset = totalLength * (1 - percent / 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(path);
  });
}

function copyCode() {
  const codeElement = document.getElementById("code-snippet");
  if (!codeElement) return;

  const codeText = codeElement.innerText;

  navigator.clipboard
    .writeText(codeText)
    .then(() => {
      alert("Código copiado!");
    })
    .catch((error) => {
      console.error("Erro ao copiar:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  initCarouselInfinite();
  initLogosSlider();
  initCarouselVisual();
  initTabs();
  initScreenshotSlider();
  initScrollColumns();
  initHamburgerMenu();
  initCardCarousel();
  initProgressOnView();
  initMultipleProgressOnView();
  copyCode();
});
