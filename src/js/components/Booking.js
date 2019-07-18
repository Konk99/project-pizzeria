import { templates, select, settings, classNames } from '../settings.js';
import { utils } from '../utils.js';
import { AmountWidget } from './AmountWidget.js';
import { DatePicker } from './DatePicker.js';
import { HourPicker } from './HourPicker.js';

export class Booking {
  constructor(booking) {
    const thisBooking = this;

    thisBooking.render(booking);
    thisBooking.initWidget();
    thisBooking.getData();
  }

  render(element) {
    const thisBooking = this;
    const generateHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;

    thisBooking.dom.wrapper.innerHTML = generateHTML;
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
  }

  initWidget() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDOM();
    });
  }

  getData() {
    const thisBooking = this;

    const startEndDates = {};
    startEndDates[settings.db.dateStartParamKey] = utils.dateToStr(thisBooking.datePicker.minDate);
    startEndDates[settings.db.dateEndParamKey] = utils.dateToStr(thisBooking.datePicker.maxDate);

    const endDate = {};
    endDate[settings.db.dateEndParamKey] = startEndDates[settings.db.dateEndParamKey];

    const params = {
      booking: utils.queryParams(startEndDates),
      eventsCurrent: settings.db.notRepeatParam + '&' + utils.queryParams(startEndDates),
      eventsRepeat: settings.db.repeatParam + '&' + utils.queryParams(endDate),
    };


    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking,
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent,
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat,
    };

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function ([bookingsResponse, eventsCurrentResponse, eventsRepeatResponse]) {
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let element of eventsCurrent) {
      thisBooking.makeBooked(element.date, element.hour, element.duration, element.table);
    };

    for (let element of bookings) {
      thisBooking.makeBooked(element.date, element.hour, element.duration, element.table);
    };

    for (let element of eventsRepeat) {
      thisBooking.makeBooked(element.date, element.hour, element.duration, element.table);
    };

    console.log('booking', thisBooking.booked);
    thisBooking.updateDOM();
  }

  makeBooked(date ,hour, duration, table) {
    const thisBooking = this;

    if (!thisBooking.booked[date]) {
      thisBooking.booked[date] = {};
    }

    let time = hour.split(':');
    if (time[1] == '30') {
      hour = `${time[0]}.5`;
    } else {
      hour = time[0];
    }

    if (!thisBooking.booked[date][hour]) {
      thisBooking.booked[date][hour] = [];
    }

    thisBooking.booked[date][hour].push(table);

    hour -= -(duration);

    if (!thisBooking.booked[date][hour]) {
      thisBooking.booked[date][hour] = [];
    }

    thisBooking.booked[date][hour].push(table);
  }

  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    for (let element of thisBooking.dom.tables) {
      let tableId = element.getAttribute(settings.booking.tableIdAttribute);
      if (thisBooking.booked[thisBooking.date] && thisBooking.booked[thisBooking.date][thisBooking.hour] && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(parseInt(tableId))) {
        element.classList.add(classNames.booking.tableBooked);
      } else {
        element.classList.remove(classNames.booking.tableBooked);
      }
    }
  }
}
