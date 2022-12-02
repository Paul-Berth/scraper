const fs = require('fs');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// const mainUrl =
//   'https://www.marmiton.org/recettes/index/categorie/plat-principal/';
// index : 20

const mainUrl = 'https://www.marmiton.org/recettes/index/categorie/dessert/';
// index : 20

const scraperObject = {
  async scraper(browser, isHeadless) {
    let page = await browser.newPage();
    console.log(`Navigating to ${mainUrl}...`);
    await page.goto(mainUrl);
    async function scrapeCurrentPage() {
      await page.waitForSelector(
        '#content > div.recipe-search__resuts > div.recipe-search__col-left > div > div:nth-child(5)'
      );
      let urls = [];
      urls = urls.concat(
        await page.$eval(
          '#content > div.recipe-search__resuts > div.recipe-search__col-left > div > div:nth-child(5)',
          (container) => {
            let urls = [];
            for (let i = 0; i < container.children.length; i++) {
              urls.push(container.children[i].querySelector('a').href);
            }
            return urls;
          }
        )
      );
      //...
      for (link in urls) {
        let currentPageData = await pagePromise(urls[link]);
        scrapedData.push(currentPageData);
      }
      fs.writeFileSync('dessert.json', JSON.stringify(scrapedData));
      index += 1;
      await page.goto(mainUrl + index.toString());
      if (index <= 50) return scrapeCurrentPage(); // Call this function recursively
      await page.close();
      return scrapedData;
    }
    let data = await scrapeCurrentPage();
    return data;
  },
};

const scraperObject = {
  async scraper(browser, isHeadless) {
    let page = await browser.newPage();
    console.log(`Navigating to ${mainUrl}...`);
    await page.goto(mainUrl);
    if (!isHeadless) {
      await page.waitForSelector('#didomi-notice-agree-button');
      await page.click('#didomi-notice-agree-button');
    }
    let scrapedData = [];
    let index = 1;
    async function scrapeCurrentPage() {
      await page.waitForSelector(
        '#content > div.recipe-search__resuts > div.recipe-search__col-left > div > div:nth-child(5)'
      );
      let urls = [];
      urls = urls.concat(
        await page.$eval(
          '#content > div.recipe-search__resuts > div.recipe-search__col-left > div > div:nth-child(5)',
          (container) => {
            let urls = [];
            for (let i = 0; i < container.children.length; i++) {
              urls.push(container.children[i].querySelector('a').href);
            }
            return urls;
          }
        )
      );
      urls = urls.concat(
        await page.$eval(
          '#content > div.recipe-search__resuts > div.recipe-search__col-left > div > div:nth-child(7)',
          (container) => {
            let urls = [];
            for (let i = 0; i < container.children.length; i++) {
              urls.push(container.children[i].querySelector('a').href);
            }
            return urls;
          }
        )
      );
      console.log(urls);

      // Loop through each of those links, open a new page instance and get the relevant data from them
      let pagePromise = (link) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};
          let newPage = await browser.newPage();
          await newPage.goto(link);
          dataObj['title'] = await newPage.$eval(
            '#__next > div:nth-child(3) > main > div > div > div.SHRD__sc-juz8gd-1.kOwNOA > div.SHRD__sc-juz8gd-3.bsFPOd > div.RCP__sc-l87aur-1.fHhWhI > div.RCP__sc-l87aur-2.PLTXZ > h1',
            (text) => text.textContent
          );
          dataObj['timeToCook'] = await newPage.$eval(
            '#__next > div:nth-child(3) > main > div > div > div.SHRD__sc-juz8gd-1.kOwNOA > div.SHRD__sc-juz8gd-3.bsFPOd > div.RCP__sc-1qnswg8-0.jBugmG > div:nth-child(1) > span > p',
            (text) => text.textContent
          );
          dataObj['nbPeople'] = await newPage.$eval(
            '#__next > div:nth-child(3) > main > div > div > div.SHRD__sc-juz8gd-1.kOwNOA > div.SHRD__sc-juz8gd-3.bsFPOd > div.RCP__sc-oaytzz-0.kbIcsa > div.RCP__sc-i1pqes-2.knQZcH > div.SHRD__sc-w4kph7-3.jsdPbk > div > span.SHRD__sc-w4kph7-4.hYSrSW',
            (text) => text.textContent
          );
          dataObj['typeRecipe'] = 'DESSERT';

          await newPage.waitForSelector(
            '#__next > div:nth-child(3) > main > div > div > div.SHRD__sc-juz8gd-1.kOwNOA > div.SHRD__sc-juz8gd-3.bsFPOd > div.RCP__sc-oaytzz-0.kbIcsa > div.RCP__sc-vgpd2s-0.fZyURy > div.MuiGrid-root.RCP__sc-vgpd2s-6.ghZzUe.MuiGrid-container.MuiGrid-spacing-xs-6'
          );
          let ingredients = await newPage.$eval(
            '#__next > div:nth-child(3) > main > div > div > div.SHRD__sc-juz8gd-1.kOwNOA > div.SHRD__sc-juz8gd-3.bsFPOd > div.RCP__sc-oaytzz-0.kbIcsa > div.RCP__sc-vgpd2s-0.fZyURy > div.MuiGrid-root.RCP__sc-vgpd2s-6.ghZzUe.MuiGrid-container.MuiGrid-spacing-xs-6',
            (container) => {
              // console.log(container);
              let ingredients = [];
              for (let i = 0; i < container.children.length; i++) {
                ingredients.push({
                  raw: container.children[i].querySelector('div').textContent,
                });
              }
              return ingredients;
            }
          );
          for (let i = 0; i < ingredients.length; i++) {
            const regex = new RegExp(
              "([\\d]+)?([  ])?((?:kg|g|c.à.s|c.à.c|cl|ml|l)(?=[  ]))?([  ])?((?:de[  ]|d'))?(.*)",
              'i'
            );
            const res = [...ingredients[i].raw.match(regex)];
            ingredients[i].qte = res[1] || '';
            ingredients[i].name = res[6];
            ingredients[i].unity = res[3] || '';
          }
          dataObj['ingredients'] = ingredients;
          resolve(dataObj);
          await newPage.close();
        });

      if (!isHeadless) await pagePromise(urls[0]);
      if (isHeadless) {
        for (link in urls) {
          let currentPageData = await pagePromise(urls[link]);
          scrapedData.push(currentPageData);
          console.log('index : ', index);
          console.log(currentPageData);
        }
      }

      // try {
      //   index = await page.$eval(
      //     '#content > nav > ul > li.selected + li',
      //     (div) => div.textContent
      //   );
      //   console.log('index : ', index);
      //   await page.click('#content > nav > ul > li.selected + li');
      // } catch (e) {
      //   await page.$eval('#content > nav > ul > div.showMoreButton', (div) =>
      //     div.click()
      //   );

      //   index = await page.$eval(
      //     '#content > nav > ul > div.showMorePages > li:nth-child(1)',
      //     (div) => div.textContent
      //   );
      //   console.log('index : ', index);
      //   await page.click(
      //     '#content > nav > ul > div.showMorePages > li:nth-child(1)'
      //   );
      // }
      fs.writeFileSync('dessert.json', JSON.stringify(scrapedData));
      index += 1;
      await page.goto(mainUrl + index.toString());
      if (index <= 50) return scrapeCurrentPage(); // Call this function recursively
      await page.close();
      return scrapedData;
    }
    let data = await scrapeCurrentPage();
    return data;
  },
};

module.exports = scraperObject;
