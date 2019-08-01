import { select, settings } from '../settings.js';
import { BaseWidget } from './BaseWidget.js';
import { divide } from './Booking.js';

export class AmountWidget extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.amountWidget.defaultValue);

    const thisWidget = this;

    thisWidget.getElements();
    thisWidget.initActions();
  }

  getElements() {
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
    thisWidget.max = settings.amountWidget.defaultMax;
  }

  setValue(value) {
    const thisWidget = this;

    const newValue = parseInt(value);

    if ((newValue != thisWidget.value) && (newValue >= settings.amountWidget.defaultMin) && (newValue <= divide)) {
      thisWidget.value = newValue;
      this.announce();
    }

    thisWidget.input.value = thisWidget.value;
  }

  initActions() {
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function () {
      thisWidget.value = thisWidget.dom.input.value;
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();

      if (thisWidget.dom.linkDecrease.id == 'amount' || thisWidget.dom.linkIncrease.id == 'people') {
        thisWidget.value--;
      } else {
      thisWidget.value = parseFloat(thisWidget.value) - .5;

      }

    });

    thisWidget.dom.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      if (thisWidget.dom.linkIncrease.id == 'amount' || thisWidget.dom.linkIncrease.id == 'people') {
        thisWidget.value++;
      } else {
        if (thisWidget.dom.linkIncrease.classList.contains('checked') && thisWidget.value == divide) {
          thisWidget.value = parseFloat(thisWidget.value) + 0;
        } else {
          thisWidget.value = parseFloat(thisWidget.value) + .5;
        }


      }
      thisWidget.getElements();
    });

  }

  isValid(newValue) {
    return !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax;
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.input.value = parseFloat(thisWidget.value);
  }
}
