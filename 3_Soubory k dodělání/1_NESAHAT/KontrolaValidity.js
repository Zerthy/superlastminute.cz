const prettier = require("prettier");
const fs = require("fs");
const path = require("path");

// Nastavení cesty k adresáři a ignorovaných adresářů
const BASE_DIRECTORY = "../";
const IGNORE_DIRECTORY = ["2 - BABI"];

// Funkce pro prohledávání adresáře
const prohledatAdresar = (dirPath) => {
  fs.readdirSync(dirPath).forEach((file) => {
    const fullPath = path.join(dirPath, file);

    // Pokud je to adresář a není v seznamu ignorovaných adresářů, rekurzivně jej prozkoumáme
    if (
      fs.statSync(fullPath).isDirectory() &&
      !IGNORE_DIRECTORY.includes(file)
    ) {
      prohledatAdresar(fullPath);
    } else {
      // Kontrola, zda je soubor HTML
      if (path.extname(fullPath) === ".html") {
        // Přečtení a zformátování souboru
        fs.readFile(fullPath, "utf8", (err, data) => {
          if (err) {
            console.error(err);
            return;
          }

          // Zformátování kódu pomocí Prettier
          const formatted = prettier.format(data, { parser: "html" });

          // Kontrola, zda byl kód změněn
          if (data !== formatted) {
            console.log("Chyba byla detekována v: " + fullPath);

            // Mazání obsahu souboru
            fs.writeFile(fullPath, "", (err) => {
              if (err) console.log(err);
              console.log("Obsah souboru byl smazán.");
            });
          }
        });
      }
    }
  });
};

// Spustíme prohledávání základního adresáře
prohledatAdresar(BASE_DIRECTORY);
