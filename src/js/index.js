// const links = document.querySelectorAll("[href^='#']");
const links = document.querySelectorAll(".fs-menu__link");

const V = 0.1;

const overlayHamb = document.querySelector("#hamburgerOverlay");
const hamburgerMenu = document.querySelector("#burger-link");
const classes = ["open", "active"];
const elements = [hamburgerMenu, overlayHamb];
const body = document.querySelector('#body');

const _toggleClass = (element, className) => {
  element.forEach((item, index) => item.classList.toggle(className[index]));
};

hamburgerMenu.addEventListener("click", e => {
  e.preventDefault();
  // console.log('body: overfol hidd');
  body.classList.toggle('active');
  _toggleClass(elements, classes);
});

for (const iter of links) {
  iter.addEventListener("click", e => {
    e.preventDefault();

    const anchor = document.querySelector(iter.getAttribute("href"));
    const coordAnchor = anchor.getBoundingClientRect().top;
    const windowY = window.pageYOffset;

    let start = null;

    requestAnimationFrame(step);

    function step(time) {
      if (start === null) start = time;
      let progress = time - start;

      let coordY =
        coordAnchor < 0
          ? Math.max(windowY - progress / V, windowY + coordAnchor)
          : Math.min(windowY + progress / V, windowY + coordAnchor);

      window.scrollTo(0, coordY);

      if (coordY != windowY + coordAnchor) {
        requestAnimationFrame(step);
      } else {
        _toggleClass(elements, classes);
      }
    }
  });
}

// Phone Validation
const phoneValid = document.querySelector("#phone1");

phoneValid.addEventListener("keydown", function(event) {
  let isDigit = false;

  if (event.key >= 0 || event.key <= 9) {
    isDigit = true;
  }

  let isDash = false;
  if (
    event.key == "-" ||
    event.key == "+" ||
    event.key == "ArrowLeft" ||
    event.key == "ArrowRight" ||
    event.key == "Backspace" ||
    event.key == ")" ||
    event.key == "("
  ) {
    isDash = true;
  }

  if (!isDigit && !isDash) {
    event.preventDefault();
  }
});

// Name validation

const nameValid = document.querySelector("#name1");

nameValid.addEventListener("keydown", function(event) {
  if (event.key >= 0 || event.key <= 9) {
    event.preventDefault();
  }
});

function validateForm(form) {
  let valid = true;

  if (!validateField(form.elements.name)) {
    valid = false;
  }
  if (!validateField(form.elements.phone)) {
    valid = false;
  }
  if (!validateField(form.elements.comments)) {
    valid = false;
  }

  return valid;
}

const inputFieldError = document.querySelector(".form__input");

function validateField(form__block) {
  if (!form__block.checkValidity()) {
    form__block.nextElementSibling.textContent = form__block.validationMessage;

    return false;
  } else {
    form__block.nextElementSibling.textContent = "";

    return true;
  }
}

// OVERLAY

const openPopup = document.querySelector(".comments__list");
let overlay;

(function(modal){
  const template = document.querySelector("#overlayTemplate").innerHTML;
  overlay = createOverlay(template);

  modal.addEventListener('click', e => {
    e.preventDefault();

    const target = e.target;

    if (target.classList.contains("comments__btn")) {

      const title = document.querySelector('.comments__title');
      const text = document.querySelector('.comments__text');

      overlay.open();
      overlay.setContent(title.textContent, text.textContent);
    } else {
      console.log('неудча');
    }

  })
})(openPopup)

  function createOverlay(template) {
    let fragment = document.createElement("div");

    fragment.innerHTML = template;

    const overlayElement = fragment.querySelector(".overlay");
    const contentElement = fragment.querySelector(".overlay__content");
    const closeElement = fragment.querySelector(".close-popup");
    const title = fragment.querySelector(".overlay__title");
    const text = fragment.querySelector(".overlay__text");

    fragment = null;

    overlayElement.addEventListener("click", e => {
      event.preventDefault();
      if (e.target === overlayElement) {
        closeElement.click();
      }
    });
    closeElement.addEventListener("click", () => {
      document.body.removeChild(overlayElement);
    });
    return {
      open() {
        document.body.appendChild(overlayElement);
      },
      close() {
        closeElement.click();
      },
      setContent(_title, _text) {
        title.innerHTML = _title;
        text.innerHTML = _text;
      },
      setContentAjax(content) {
        contentElement.innerHTML = content;
        
      }
    };
  }

// AJAX form

const orderForm = document.querySelector("#form");

orderForm.addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();
  const form = e.target;
  const request = ajaxForm(form);

  request.addEventListener("load", function() {
    // console.log(request);
    if (request.status >= 400) {
      overlay.open();
      overlay.setContentAjax("Произошла ошибка " + request.response.message);
    } else {
      overlay.open();
      overlay.setContentAjax(request.response.message);
    }
  });
}

const ajaxForm = function(form) {
  const formData = new FormData(form);
  const url = "https://webdev-api.loftschool.com/sendmail";
  const mail = "kirilluchatov@yandex.ru";
  formData.append("to", mail);

  const xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.open("POST", url);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.send(formData);

  return xhr;
};

// SLIDER
const slides = document.querySelectorAll(".slider__item");

(function(slides) {
  let currentSlide = 0;
  var next = document.querySelector("#right");
  var previous = document.querySelector("#left");

  next.addEventListener("click", function(event) {
    event.preventDefault();
    nextSlide();
  });

  previous.addEventListener("click", function(event) {
    event.preventDefault();
    previousSlide();
  });

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function previousSlide() {
    goToSlide(currentSlide - 1);
  }

  
  function goToSlide(n) {
    slides[currentSlide].classList.remove("showing");
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add("showing");
  }
})(slides);

// ACCORDEON H

const listTargetH = document.querySelector(".person__list");

listTargetH.addEventListener("click", function(e) {
  const target = e.target;

  if (target.classList.contains("person__name-click")) {
    e.preventDefault();
    const item = target.closest(".person__item");
    const allItems = document.querySelectorAll(".person__item");
    if (item.classList.contains("active")) {
      item.classList.remove("active");
      return null;
    }

    allItems.forEach(item => {
      if (item.classList.contains("active")) item.classList.remove("active");
    });

    item.classList.add("active");
  }
});

// ACCORDEON V

const listTargetV = document.querySelector(".menu-accordeon");

listTargetV.addEventListener("click", e => {
  const target = e.target;

  if (target.classList.contains("menu-accordeon__trigger")) {
    e.preventDefault();

    const item = target.closest(".menu-accordeon__item");
    const allItem = document.querySelectorAll(".menu-accordeon__item");

    if (item.classList.contains("active")) {
      item.classList.remove("active");
      return null;
    }

    allItem.forEach(item => {
      if (item.classList.contains("active")) item.classList.remove("active");
    });

    item.classList.add("active");
  } else if (target.classList.contains("menu-accordeon__subtitle")) {
    e.preventDefault();

    const item = target.closest(".menu-accordeon__item");
    const allItem = document.querySelectorAll(".menu-accordeon__item");

    if (item.classList.contains("active")) {
      item.classList.remove("active");
      return null;
    }

    allItem.forEach(item => {
      if (item.classList.contains("active")) item.classList.remove("active");
    });

    item.classList.add("active");
  } else {
    console.log("noy");
  }
});

// player

let player;

const formatTime = timeSec => {
  const roundTime = Math.round(timeSec);

  const minutes = Math.floor(roundTime / 60);
  const seconds = roundTime - minutes * 60;

  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutes}:${formattedSeconds}`;
};

const onPlayerReady = () => {
  let interval;
  let durationSec = player.getDuration();

  $(".player__duration-estimate").text(formatTime(durationSec));

  if (typeof interval !== "undefined") {
    clearInterval(interval);
  }

  interval = setInterval(() => {
    const completedSec = player.getCurrentTime();
    const completedPercent = (completedSec / durationSec) * 100;

    $(".player__playback-button").css({
      left: `${completedPercent}%`
    });

    $(".player__duration-completed").text(formatTime(completedSec));
  }, 1000);
};

const eventsInit = () => {
  $(".player__start").on("click", e => {
    e.preventDefault();
    const btn = $(e.currentTarget);

    if (btn.hasClass("paused")) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  });

  $(".player__playback").on("click", e => {
    const bar = $(e.currentTarget);
    const newButtonPosition = e.pageX - bar.offset().left;
    const buttonPosPercent = (newButtonPosition / bar.width()) * 100;
    const newPlayerTimeSec = (player.getDuration() / 100) * buttonPosPercent;

    $(".player__playback-button").css({
      left: `${buttonPosPercent}%`
    });

    player.seekTo(newPlayerTimeSec);
  });

};

const onPlayerStateChange = event => {
  const playerButton = $(".player__start");
  /*
  -1 (воспроизведение видео не начато)
  0 (воспроизведение видео завершено)
  1 (воспроизведение)
  2 (пауза)
  3 (буферизация)
  5 (видео подают реплики).
   */
  switch (event.data) {
    case 1: 
      $('.player__wrapper').addClass('active');
      playerButton.addClass("paused");
      break;
    case 2: 
      playerButton.removeClass("paused");
      break;
  }
};

function onYouTubeIframeAPIReady() {
  player = new YT.Player("yt-player", {
    height: "405",
    width: "660",
    
    videoId: "5P6ADakiwcg",

    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    },
    playerVars: {
      controls: 0,
      disablekb: 0,
      showinfo: 0,
      rel: 0,
      autoplay: 0,
      modestbranding: 0
    }
  });
}

eventsInit();



// =============   MAP
ymaps.ready(init);

var placemarks = [
    {
        latitude: 59.97,
        longitude: 30.31,
        hintContent: '<div class="map__hint">ул. Литераторов, д. 19</div>',
        balloonContent: [
            '<div class="map__balloon">',
            'Самые вкусные бургеры у нас!',
            '</div>'
        ]
    },
    {
        latitude: 59.94,
        longitude: 30.25,
        hintContent: '<div class="map__hint">Малый проспект В О, д 64</div>',
        balloonContent: [
            '<div class="map__balloon">',
            'Самые вкусные бургеры у нас!',
            '</div>'
        ]
    },
    {
        latitude: 59.93,
        longitude: 30.34,
        hintContent: '<div class="map__hint">наб. реки Фонтанки, д. 56</div>',
        balloonContent: [
            '<div class="map__balloon">',
            'Самые вкусные бургеры у нас!',
            '</div>'
        ]
    }
],
    geoObjects= [];

function init() {
    var map = new ymaps.Map('map', {
        center: [59.94, 30.32],
        zoom: 12,
        controls: ['zoomControl'],
        behaviors: ['drag']
    });

    for (var i = 0; i < placemarks.length; i++) {
            geoObjects[i] = new ymaps.Placemark([placemarks[i].latitude, placemarks[i].longitude],
            {
                hintContent: placemarks[i].hintContent,
                balloonContent: placemarks[i].balloonContent.join('')
            },
            {
                iconLayout: 'default#image',
                iconImageHref: 'images/img/map-marker.png',
                iconImageSize: [46, 57],
                iconImageOffset: [-23, -57],
                iconImageClipRect: [[415, 0], [461, 57]]
            });
    }

    var clusterer = new ymaps.Clusterer({
        clusterIcons: [
            {
                href: 'img/burger.png',
                size: [100, 100],
                offset: [-50, -50]
            }
        ],
        clusterIconContentLayout: null
    });

    map.geoObjects.add(clusterer);
    clusterer.add(geoObjects);
};


// OPS 

const sections = $(".section");
const display = $(".maincontent");
let inscroll = false;

// const mobileDetect = new MobileDetect(window.navigator.userAgent);
// const isMobile = mobileDetect.mobile();

const countPositionPercent = sectionEq => {
  return `${sectionEq * -100}%`;
};

const switchActiveClass = (elems, elemNdx) => {
  elems
    .eq(elemNdx)
    .addClass("active")
    .siblings()
    .removeClass("active");
};

const unBlockScroll = () => {
  setTimeout(() => {
    inscroll = false;
  }, 1200); // подождать пока завершится инерция на тачпадах
};

const performTransition = sectionEq => {
  if (inscroll) return;
  inscroll = true;

  const position = countPositionPercent(sectionEq);
  const switchFixedMenuClass = () =>
    switchActiveClass($(".fixed-menu__item"), sectionEq);

  switchActiveClass(sections, sectionEq);
  switchFixedMenuClass();

  display.css({
    transform: `translateY(${position})`
  });

  unBlockScroll();
};

const scrollViewport = direction => {
  const activeSection = sections.filter(".active");
  const nextSection = activeSection.next();
  const prevSection = activeSection.prev();

  if (direction === "next" && nextSection.length) {
    performTransition(nextSection.index());
  }

  if (direction === "prev" && prevSection.length) {
    performTransition(prevSection.index());
  }
};

$(document).on({
  wheel: e => {
    const deltaY = e.originalEvent.deltaY;
    const direction = deltaY > 0 ? "next" : "prev";
    scrollViewport(direction);
  },
  keydown: e => {
    const tagName = e.target.tagName.toLowerCase();
    const userTypingInInputs = tagName === "input" || tagName === "textarea";

    if (userTypingInInputs) return;

    switch (e.keyCode) {
      case 40:
        scrollViewport("next");
        break;

      case 38:
        scrollViewport("prev");
        break;
    }
  }
});

$("[data-scroll-to]").on("click", e => {
  e.preventDefault();
  performTransition(parseInt($(e.currentTarget).attr("data-scroll-to")));
});

// // разрешаем свайп на мобильниках
// if (isMobile) {
//   window.addEventListener(
//     "touchmove",
//     e => {
//       e.preventDefault();
//     },
//     { passive: false }
//   );

//   $("body").swipe({
//     swipe: (event, direction) => {
//       let scrollDirecrion;
//       if (direction === "up") scrollDirecrion = "next";
//       if (direction === "down") scrollDirecrion = "prev";
//       scrollViewport(scrollDirecrion);
//     }
//   });
// }