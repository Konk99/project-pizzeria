import { templates } from '../settings.js';

export class Menu{
  constructor(menu) {
    const thisMenu = this;

    thisMenu.render(menu);
  }

  render(element) {
    const thisMenu = this;
    const generateHTML = templates.mainMenu();

    thisMenu.dom = {};
    thisMenu.dom.wrapper = element;

    thisMenu.dom.wrapper.innerHTML = generateHTML;
  }
}
