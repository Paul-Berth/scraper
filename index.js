const browserObject = require('./browser');
const scraperController = require('./pageController');

const isHeadless = true;

//Start the browser and create a browser instance
let browserInstance = browserObject.startBrowser(isHeadless);

// Pass the browser instance to the scraper controller
scraperController(browserInstance, isHeadless);
