import { select, settings } from '../settings.js';
import { BaseWidget } from './BaseWidget.js';

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
    thisWidget.dom.hour = thisWidget.dom.wrapper.querySelector('input[name="hours"]');
  }

  setValue(value) {
    const thisWidget = this;

    const newValue = parseInt(value);

    if ((newValue != thisWidget.value) && (newValue >= settings.amountWidget.defaultMin) && (newValue <= settings.amountWidget.defaultMax)) {
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
      if (!thisWidget.dom.hour) {
        thisWidget.value--;
      } else {
        thisWidget.value = parseFloat(thisWidget.value) - .5;
      }

    });

    thisWidget.dom.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      if (!thisWidget.dom.hour) {
        thisWidget.value++;
      } else {
        thisWidget.value = parseFloat(thisWidget.value) + .5;
      }
      console.log(thisWidget.value);
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
