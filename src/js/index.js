import Swiper from '../lib/swiper-bundle.esm.browser.min.js';

// simplebar

new SimpleBar(document.querySelector('.country__list'), {
    classNames: {
        scrollbar: 'country__scrollbar',
        track: 'country__track',
    },
});

// slider
new Swiper('.goods__block', {
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
        320: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 2,
            spaceBetween: 24,
        },
        1440: {
            slidesPerView: 3,
            spaceBetween: 24,
        },
    },
    navigation: {
        prevEl: '.goods__arrow_prev',
        nextEl: '.goods__arrow_next',
    },
    preventClicks: true,
    a11y: false,
});

// modal
const productMore = document.querySelectorAll('.product__more');
const modal = document.querySelector('.modal');

productMore.forEach((btn) => {
    btn.addEventListener('click', () => {
        modal.classList.add('modal__open');
    });
});

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.remove('modal__open');
    }
});

const formPlaceholder = document.querySelectorAll('.form__placeholder');
const formInput = document.querySelectorAll('.form__input');

formInput.forEach((input, index) => {
    input.addEventListener('focus', () => {
        formPlaceholder[index].classList.add('form__placeholder_active');
    });

    input.addEventListener('blur', () => {
        if (input.value === '') {
            formPlaceholder[index].classList.remove('form__placeholder_active');
        }
    });
});

// currency

const dataCurrency = {};

const formatCurrency = (value, currency) => {
    return new Intl.NumberFormat('EU', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
    }).format(value);
};

const showPrice = (currency = 'USD') => {
    const priceElems = document.querySelectorAll('[data-price]');

    priceElems.forEach(elem => {
        elem.textContent = formatCurrency(elem.dataset.price * dataCurrency[currency], currency);
    });
};

// API scripts

const myHeaders = new Headers();
myHeaders.append('apikey', '4wXOLGOj3bkrMseBEkf8pZGIMeXVywON');

const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders,
};

fetch('https://api.apilayer.com/fixer/latest?&base=USD', requestOptions)
        .then(response => response.json())
        .then(result => {
            Object.assign(dataCurrency, result.rates);
            showPrice();
        })
        .catch(error => console.log('error', error));


// choices

const countryBtn = document.querySelector('.country__btn');
const countryWrapper = document.querySelector('.country__wrapper');

countryBtn.addEventListener('click', () => {
    countryWrapper.classList.toggle('country__wrapper_open');
});

countryWrapper.addEventListener('click', ({target}) => {
    if (target.classList.contains('country__choice')) {
        countryWrapper.classList.remove('country__wrapper_open');
        showPrice(target.dataset.currency);
    }
});

// timer

// склонение, возвращает только слово

const declOfNum = (n, titles) => titles[n % 10 === 1 && n % 100 !== 11 ?
    0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];

const timer = (deadline) => {
    const unitDays = document.querySelector('.timer__unit_days');
    const unitHours = document.querySelector('.timer__unit_hours');
    const unitMinutes = document.querySelector('.timer__unit_minutes');

    const descriptionDays = document.querySelector('.timer__description_days');
    const descriptionHours = document.querySelector('.timer__description_hours');
    const descriptionMinutes = document.querySelector('.timer__description_minutes');

    const getTimeRemaining = () => {
        const dateStop = new Date(deadline).getTime();
        const dateNow = Date.now();
        const timeRemaining = dateStop - dateNow;

        // const secondes = timeRemaining / 1000 % 60;

        const minutes = Math.floor(timeRemaining / 1000 / 60 % 60);

        const hours = Math.floor(timeRemaining / 1000 / 60 / 60 % 24);

        const days = Math.floor(timeRemaining / 1000 / 60 / 60 / 24);

        return {timeRemaining, minutes, hours, days};
    };

    const start = () => {
        const startTimer = getTimeRemaining();

        unitDays.textContent = startTimer.days;
        unitHours.textContent = startTimer.hours;
        unitMinutes.textContent = startTimer.minutes;

        descriptionDays.textContent = declOfNum(startTimer.days, ['день', 'дня', 'дней']);
        descriptionHours.textContent = declOfNum(startTimer.hours, ['час', 'часа', 'часов']);
        descriptionMinutes.textContent = declOfNum(startTimer.minutes, ['минута', 'минуты', 'минут']);

        const intervalId = setTimeout(start, 60000);

        if (startTimer.timeRemaining < 0) {
            clearTimeout(intervalId);
            unitDays.textContent = '0';
            unitHours.textContent = '0';
            unitMinutes.textContent = '0';
        }
    };

    start();
};

timer('2023/12/07 20:00');


