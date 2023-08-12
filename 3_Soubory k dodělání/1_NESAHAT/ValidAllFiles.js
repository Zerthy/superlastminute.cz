const fs = require("fs");
const path = require("path");
const prettier = require("prettier");

const BASE_DIRECTORY = "../"; // upravte podle potřeby
const IGNORE_DIRECTORY = "2 - BABI";

let fileDeleted = false; // flag pro označení, zda byl nějaký soubor smazán

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

      if (prettier.check(content, { parser: "html" })) {
        console.log(`Soubor ${filePath} je validní.`);
      } else {
        // Obsah souboru je neplatný, smažeme jej
        fs.writeFileSync(filePath, "");
        console.log(
          `Soubor ${filePath} byl nalezen neplatný a jeho obsah byl smazán.`,
        );
        fileDeleted = true; // nastavíme flag na true
      }
    }
  }
}

processFiles(BASE_DIRECTORY).then(() => {
  // Pokud byl nějaký soubor smazán, ukončíme proces s chybovým kódem 1
  if (fileDeleted) {
    process.exit(1);
  }
});
