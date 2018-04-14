const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

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

  async login () {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    await this.page.goto('localhost:3000');
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf (selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }
}

module.exports = Page;