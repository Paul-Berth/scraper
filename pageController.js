const pageScraper = require('./pageScraper');
async function scrapeAll(browserInstance, isHeadless) {
  let browser;
  try {
    browser = await browserInstance;
    await pageScraper.scraper(browser, isHeadless);
    if (isHeadless) await browser.close();
  } catch (err) {
    console.log('Could not resolve the browser instance => ', err);
  }
  if (isHeadless) process.exit();
}

module.exports = (browserInstance, isHeadless) =>
  scrapeAll(browserInstance, isHeadless);
