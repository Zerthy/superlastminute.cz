const fs = require("fs");
const path = require("path");

// Funkce pro "escaping" speciálních znaků v regulárních výrazech
const escapeRegExp = (string) => {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
};

// Načtení souboru se slovy k zesílení
const loadStrongWords = (filePath) => {
  const data = fs.readFileSync(filePath, "utf8");
  const strongWordPattern = /<strong>([^<]*)<\/strong>/g;
  const words = [];
  let match;

  while ((match = strongWordPattern.exec(data)) !== null) {
    words.push(match[1].trim());
  }

  return words;
};

const words = loadStrongWords(
  path.join(__dirname, "..", "/1_NESAHAT/ViceSlovStrong.txt"),
); // Používáme soubor ViceSlovStrong.txt

// Funkce pro průchod všemi podsložkami a soubory
function walk(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const absolutePath = path.join(directory, file);
    if (fs.statSync(absolutePath).isDirectory()) {
      return walk(absolutePath); // pokud je to složka, projde ji
    } else if (path.extname(absolutePath) === ".html") {
      let html = fs.readFileSync(absolutePath, "utf8");

      // Proveďte nahrazení pro všechna slova
      words.forEach((word) => {
        const re = new RegExp(
          `(?<!<strong>)\\b${escapeRegExp(word)}\\b(?!<\/strong>)`,
          "gi",
        ); // Ignorujeme slova/fráze uvnitř HTML tagu <strong>
        html = html.replace(re, `<strong>${word}</strong>`);
      });

      // Uložte změněný HTML soubor
      fs.writeFileSync(absolutePath, html, "utf8");
    }
  });
}

// Spustíme funkci na hlavní složce
walk(path.join(__dirname, ".."));
