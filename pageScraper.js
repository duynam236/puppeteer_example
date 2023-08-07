const puppeteer = require("puppeteer");
const sendEmail = require("./sendEmail.js");
var fs = require("fs");

const scraperObject = {
  username: "nam.test.subiz@gmail.com",
  password: "#iloveyou3000",
  async scraper(browser, email_id, template, index, total) {
    console.log("Start screenshot");
    let page = await browser.newPage();
    if (index === 0) {
      await page.goto(
        "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&service=mail&flowName=GlifWebSignIn",
        // "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&rip=1&sacu=1&service=mail&flowName=GlifWebSignIn&flowEntry=ServiceLogin",
        {
          waitUntil: "domcontentloaded",
        }
      );

      await sleep(1000);
      await page.type("input[type='email']", this.username);
      await Promise.all([
        page.keyboard.press("Enter"),
        page.waitForNavigation({
          waitUntil: "networkidle0",
        }),
      ]);

      await sleep(1000);
      await page.type("input[type='password']", this.password);
      await Promise.all([
        page.keyboard.press("Enter"),
        page.waitForNavigation({
          waitUntil: "domcontentloaded",
        }),
      ]);
    }
    await page.goto("https://mail.google.com/mail/u/0/#inbox", {
      waitUntil: "domcontentloaded",
    });

    await page.waitForFunction(
      `document.querySelector("table tbody tr td div div div span span").innerHTML.includes("${email_id}")`
    );

    await sleep(1000);
    await page.goto(
      // "https://mail.google.com/mail/u/0/h/1fdlpqz3vkk1z/?zy=e&view&f=1&f=1",
      "https://mail.google.com/mail/u/0/h/?&s=a",
      {
        waitUntil: "domcontentloaded",
      }
    );

    await Promise.all([
      page.evaluate((email_id) => {
        const trArr = Array.from(
          document.querySelectorAll("table tbody tr td a span")
        );
        let fetchValueRowIndex = trArr.filter((v, i) => {
          return v.innerHTML.includes(email_id);
        });
        fetchValueRowIndex[0].click();
      }, email_id),
      page.waitForNavigation({
        waitUntil: "networkidle0",
      }),
    ]);

    await page.evaluate(() => {
      const show = Array.from(
        document.querySelectorAll(
          "tbody > tr > td > table > tbody > tr > td > div > div > font > a"
        )
      );
      let btn_show = show.filter((v) => {
        return v.innerHTML.includes("Show quoted text");
      });

      if (btn_show[0]) btn_show[0].click();
      return;
    });

    try {
      await page.waitForNavigation({
        waitUntil: "networkidle0",
        timeout: 1000,
      });
    } catch (e) {}

    let out_desk = `./${template}/${template}_screenshot_desktop.png`;
    let out_mobile = `./${template}/${template}_screenshot_mobile.png`;
    await page.screenshot({
      path: out_desk,
      type: "png",
      fullPage: true,
    });
    await page.goto("https://mail.google.com/mail/mu/mp/339/#tl/All%20Mail", {
      waitUntil: "networkidle2",
    });
    await page.setViewport({ width: 390, height: 844 });

    await sleep(3000);
    await page.evaluate(() => {
      let trArr = Array.from(
        document.querySelectorAll("body > div > div > div > div > button")
      );
      let fetchValueRowIndex = trArr.filter((v, i) => {
        return v.innerHTML.includes("I am not interested");
      });
      console.log("Click done care");
      if (fetchValueRowIndex[0]) fetchValueRowIndex[0].click();
      return;
    });
    await sleep(100);

    await Promise.all([
      page.evaluate((email_id) => {
        let trArr = Array.from(
          document.querySelectorAll(
            "body > div > div > div > div > div > div > div[role='button']"
          )
        );
        let fetchValueRowIndex = trArr.filter((v) => {
          let parent = v.parentNode;
          return parent.innerHTML.includes(email_id);
        });
        fetchValueRowIndex[0].click();
      }, email_id),
    ]);

    try {
      await page.waitForNavigation({
        waitUntil: "networkidle0",
        timeout: 3000,
      });
    } catch (e) {}
    // await Promise.all([
    //   page.waitForSelector('div[style="overflow: visible;"]', {}),
    //   page.click('div[aria-label="Show quoted text"]'),
    // ]);

    await page.evaluate(() => {
      const btn = Array.from(
        document.querySelectorAll("div[aria-label='Show quoted text']")
      );

      if (btn[0]) btn[0].click();
      return;
    });

    await page.screenshot({
      path: out_mobile,
      type: "png",
      fullPage: true,
    });
    console.log("Screenshot ", template);

    if (index === total - 1) {
      console.log("SCREENSHOT DONE!!!");
      browser.close();
    }
  },
};

module.exports = scraperObject;
function sleep(ms) {
  return new Promise(function (res) {
    setTimeout(res, ms);
  });
}
