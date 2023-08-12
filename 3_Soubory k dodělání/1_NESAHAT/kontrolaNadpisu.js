const fs = require("fs");
const path = require("path");

const BASE_DIRECTORY = "../"; // upravte podle potřeby
const IGNORE_DIRECTORY = "2 - BABI";
const OUTPUT_FILE = "../Chybné Nadpisy.txt";

const HTML_TAGS = ["<h2>Časté otázky (FAQs)</h2>", "<h2>Tipy na výlety</h2>"];

async function processFiles(directory) {
  const files = fs.readdirSync(directory);

  for (let file of files) {
    const filePath = path.join(directory, file);

    if (fs.statSync(filePath).isDirectory()) {
      if (path.basename(filePath) === IGNORE_DIRECTORY) {
        console.log(`Přeskakuji složku ${filePath}`);
        continue;
      }

      await processFiles(filePath); // rekurzivně zpracujeme podadresáře
    } else if (path.extname(file) === ".html") {
      const content = fs.readFileSync(filePath, "utf8");

      let isMissing = false;
      for (let tag of HTML_TAGS) {
        if (!content.includes(tag)) {
          isMissing = true;
          break;
        }
      }

      if (isMissing) {
        fs.appendFileSync(
          OUTPUT_FILE,
          `Špatný nadpis u Výletů nebo Otázek v souboru ${filePath}\n`,
          "utf8",
        );
        console.log(`Špatný nadpis u Výletů nebo Otázek v souboru ${filePath}`);
      }
    }
  }
}

fs.writeFileSync(OUTPUT_FILE, ""); // vymaže obsah souboru Chybné Nadpisy.txt
processFiles(BASE_DIRECTORY);
