const puppeteer = require('puppeteer');

class Page {
  static async build () {
    const browser = await puppeteer.launch({
      headless: false
    });
    const _page = await browser.newPage();
    const page = new Page(_page);

    return new Proxy(page, {
      get: function (target, property) {
        return page[property] || browser[property] || _page[property];
      }
    });
  }

  constructor (page) {
    this.page = page;
  }
}

module.exports = Page;
