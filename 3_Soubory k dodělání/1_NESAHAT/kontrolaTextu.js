const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const BASE_DIRECTORY = "../";
const IGNORE_DIRECTORY = "2 - BABI";

function isTextInsideTags(text) {
  const $ = cheerio.load(text);
  const validTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p"];
  let isValid = true;

  $("body")
    .contents()
    .each(function (i, el) {
      if (el.type === "text" && $(el).text().trim().length > 0) {
        isValid = false;
        return false;
      }
      if (el.type === "tag" && !validTags.includes(el.name)) {
        isValid = false;
        return false;
      }
    });

  return isValid;
}

function checkAndDeleteFiles(directory) {
  const files = fs.readdirSync(directory);

  for (let file of files) {
    let filePath = path.join(directory, file);

    if (fs.statSync(filePath).isDirectory()) {
      if (path.basename(filePath) === IGNORE_DIRECTORY) {
        console.log(`Přeskakuji složku ${filePath}`);
        continue;
      }
      checkAndDeleteFiles(filePath);
    } else if (path.extname(file) === ".html") {
      const fileContent = fs.readFileSync(filePath, "utf8");
      if (!isTextInsideTags(fileContent)) {
        fs.unlinkSync(filePath);
        console.log(`Soubor ${filePath} nevyhovoval požadavkům a byl smazán.`);
      }
    }
  }
}

checkAndDeleteFiles(BASE_DIRECTORY);
