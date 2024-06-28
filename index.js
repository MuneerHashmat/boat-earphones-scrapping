const fs = require("fs");
const cheerio = require("cheerio");
const xlsx = require("xlsx");
const puppeteer = require("puppeteer");

const getData = async () => {
  const response = await fetch(
    "https://www.boat-lifestyle.com/collections/wired-earphones",
    {
      Headers: {
        "Content-Type": "text/html",
      },
    }
  );

  const data = await response.text();
  fs.writeFileSync("index.html", data);
};

// getData();

const html = fs.readFileSync("./index.html");
const $ = cheerio.load(html);

const titles = $(".product-item-meta__title");
const titlesArray = [];
titles.each((index, element) => {
  titlesArray.push($(element).text().trim());
});

// console.log(titlesArray);

const ratings = $(".rating__stars");
const ratingsArray = [];
ratings.each((index, element) => {
  ratingsArray.push($(element).text().trim());
});

// console.log(ratingsArray);

const prices = $(".price--highlight");
const pricesArray = [];
prices.each((index, element) => {
  pricesArray.push($(element).text().trim().slice(-4));
});
// console.log(pricesArray);

const discounts = $(".off");
const discountsArray = [];
discounts.each((index, element) => {
  discountsArray.push($(element).text().trim());
});

// console.log(discountsArray);

const inStock = $(".product-item__quick-form");
const inStockArray = [];
inStock.each((index, element) => {
  if ($(element).toString().includes("notifyMe_trigger")) {
    inStockArray.push("no");
  } else {
    inStockArray.push("yes");
  }
});

// console.log(inStockArray);

const earphones = [];
titlesArray.map((item, index) => {
  earphones.push({
    title: item,
    rating: ratingsArray[index],
    price: pricesArray[index],
    discount: discountsArray[index],
    "in stock?": inStockArray[index],
  });
});

fs.writeFileSync("earphones.json", JSON.stringify(earphones));
const workbook = xlsx.utils.book_new();
const sheetdata = xlsx.utils.json_to_sheet(earphones);
xlsx.utils.book_append_sheet(workbook, sheetdata, "earphones");
xlsx.writeFile(workbook, "earphones.xlsx");
