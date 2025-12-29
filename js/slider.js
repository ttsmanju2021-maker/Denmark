
document.addEventListener("DOMContentLoaded", function () {

  /* Hero / Single slide slider */
  if (document.querySelector(".services-sliderr")) {
    new Swiper(".services-sliderr", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      speed: 6000,
      pagination: {
        el: ".services-sliderr .swiper-pagination",
        clickable: true,
      },
    });
  }

  /* Services / Multi slide slider */
  if (document.querySelector(".services-slider")) {
    new Swiper(".services-slider", {
      slidesPerView: 3,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      speed: 3000,
      pagination: {
        el: ".services-slider .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".services-slider .swiper-button-next",
        prevEl: ".services-slider .swiper-button-prev",
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  }

});
