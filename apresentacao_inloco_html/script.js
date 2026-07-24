const slides = Array.from(document.querySelectorAll(".slide"));
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const slideCounter = document.getElementById("slideCounter");
const progressBar = document.getElementById("progressBar");

let current = 0;

function clampSlide(index) {
  return Math.max(0, Math.min(slides.length - 1, index));
}

function showSlide(index) {
  current = clampSlide(index);

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === current);
  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === slides.length - 1;
  slideCounter.textContent = `${current + 1} / ${slides.length}`;
  progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
  document.title = `Inloco | ${current + 1}. ${slides[current].dataset.title}`;
  window.location.hash = `slide-${current + 1}`;
}

function readHash() {
  const match = window.location.hash.match(/slide-(\d+)/);
  if (!match) return 0;
  return clampSlide(Number(match[1]) - 1);
}

prevBtn.addEventListener("click", () => showSlide(current - 1));
nextBtn.addEventListener("click", () => showSlide(current + 1));

window.addEventListener("keydown", (event) => {
  const nextKeys = ["ArrowRight", "ArrowDown", "PageDown", " "];
  const prevKeys = ["ArrowLeft", "ArrowUp", "PageUp", "Backspace"];

  if (nextKeys.includes(event.key)) {
    event.preventDefault();
    showSlide(current + 1);
  }

  if (prevKeys.includes(event.key)) {
    event.preventDefault();
    showSlide(current - 1);
  }

  if (event.key === "Home") {
    event.preventDefault();
    showSlide(0);
  }

  if (event.key === "End") {
    event.preventDefault();
    showSlide(slides.length - 1);
  }
});

window.addEventListener("hashchange", () => showSlide(readHash()));

let touchStartX = null;
window.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
});

window.addEventListener("touchend", (event) => {
  if (touchStartX === null) return;
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 50) {
    showSlide(current + (distance < 0 ? 1 : -1));
  }
  touchStartX = null;
});

showSlide(readHash());
