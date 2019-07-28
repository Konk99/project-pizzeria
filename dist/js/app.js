import { Product } from './components/Product.js';
import { Cart } from './components/Cart.js';
import { select, settings, templates, classNames } from './settings.js';
import { Booking } from './components/Booking.js';
import { Menu } from './components/Menu.js';

const app = {
  initMenu: function () {
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function () {
    const thisApp = this;

    thisApp.data = {};

    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {

        thisApp.data.products = parsedResponse;

        thisApp.initMenu();
      });
  },

  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },

  initPages: function () {
    const thisApp = this;

    thisApp.pages = Array.from(document.querySelector(select.containerOf.pages).children);
    thisApp.navLinks = Array.from(document.querySelectorAll(select.nav.links));
    let pagesMatchingHash = [];

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const clickedElement = this;

        const activeLink = clickedElement.getAttribute('href');
        const href = activeLink.replace('#', '');
        thisApp.activePage(href);
      })
    };

    if (window.location.hash.length > 2) {
      const idFromHash = window.location.hash.replace('#/', '');

      pagesMatchingHash = thisApp.pages.filter(function (page) {
        return page.id == idFromHash;
      });
    };

    thisApp.activePage(pagesMatchingHash.length ? pagesMatchingHash[0].id : thisApp.pages[0].id);
  },

  activePage(pageId) {
    const thisApp = this;

    for (let link of thisApp.navLinks) {
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
    };

    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.nav.active, page.getAttribute('id') == pageId);
    };

    window.location.hash = '#/' + pageId;
  },

  initBooking() {
    const thisApp = this;

    thisApp.bookingWrapper = document.querySelector(select.containerOf.booking);

    const booking = new Booking(thisApp.bookingWrapper);
  },

  initMainMenu() {
    const thisApp = this;

    thisApp.menu = document.querySelector(select.containerOf.mainMenu);

    const menu = new Menu(thisApp.menu);
    thisApp.slideshow();

  },

  slideshow() {
    let slideIndex = 0;
    showSlides();

    function showSlides() {
      let i = 0;
      const slides = document.getElementsByClassName("text");
      const dots = document.getElementsByClassName("dot");

      for (i; i < slides.length; i++) {
        slides[i].style.display = "none";
      }

      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
      }

      slideIndex++;
      if (slideIndex > slides.length) { slideIndex = 1 }
      slides[slideIndex - 1].style.display = "block";
      dots[slideIndex - 1].className += " active";
      setTimeout(showSlides, 2000);
    } 
  },

  init: function(){
    const thisApp = this;
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);

    thisApp.initPages();

    thisApp.initData();

    thisApp.initMainMenu();

    thisApp.initCart();

    thisApp.initBooking();
  },
};

app.init();
