// const pageScraper = require("./vnExpress.js");
const pageScraper = require("./pageScraper.js");
const sendEmail = require("./sendEmail.js");
var fs = require("fs");

async function scrapeAll(browserInstance) {
  let browser = await browserInstance;
  const process = require("process");
  var args = process.argv;
  let template;

  if (args[2]) {
    template = args[2];
    await CopyFile(template);
    await ScreenTemplate(browser, template, 0, 1);
    return;
  }
  let arr = fs.readdirSync("../email-templates/");
  arr = arr.filter(
    (item) =>
      fs.lstatSync(item).isDirectory() &&
      !item.startsWith(".") &&
      item !== "node_modules" &&
      item !== "dist" &&
      item !== "gulp" &&
      item !== "src"
  );

  for (let i = 0; i < arr.length; i++) {
    await CopyFile(arr[i]);
    await ScreenTemplate(browser, arr[i], i, arr.length);
  }
}

function randomString(len) {
  var str = "";
  if (!len || len < 1) len = 10;
  var asciiKey;
  for (var i = 0; i < len; i++) {
    asciiKey = Math.floor(Math.random() * 25 + 97);
    str += String.fromCharCode(asciiKey);
  }
  return str;
}

async function ScreenTemplate(browser, file, index, total) {
  let email_id = "email_" + randomString(20);
  let arr = fs.readdirSync(`./${file}/`);
  if (!arr) return console.log(`Email template ${file} not found`);
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== `${file}_inlinecss.html`) continue;
    await sendEmail.SendEmailTemplate(file, email_id);
  }

  try {
    await pageScraper.scraper(browser, email_id, file, index, total);
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

async function CopyFile(name) {
  let arr = fs.readdirSync(`./${name}/`);
  arr = arr.filter((file) => file.endsWith(".html"));
  if (!arr) return console.log(`Email template ${name} not found`);
  fs.copyFile(
    `./${name}/${arr[0]}`,
    `./src/templates/${name}_inlinecss.html`,
    (err) => {
      if (err) {
        console.log("Error Found:", err);
      } else {
      }
    }
  );
  await sleep(1500);
  fs.copyFile(
    `./dist/${name}_inlinecss.html`,
    `./${name}/${name}_inlinecss.html`,
    (err) => {
      if (err) {
        console.log("Error Found:", err);
      } else {
      }
    }
  );
}

function sleep(ms) {
  return new Promise(function (res) {
    setTimeout(res, ms);
  });
}

module.exports = (browserInstance) => scrapeAll(browserInstance);
