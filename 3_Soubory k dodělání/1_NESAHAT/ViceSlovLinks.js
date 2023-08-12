const fs = require("fs");
const path = require("path");

// Funkce pro "escaping" speciálních znaků v regulárních výrazech
const escapeRegExp = (string) => {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
};

// Načtěte soubory s odkazy
const loadLinks = (filePath) => {
  const data = fs.readFileSync(filePath, "utf8");
  const linkPattern = /<a href="([^"]*)">([^<]*)<\/a>/g;
  const links = [];
  let match;

  while ((match = linkPattern.exec(data)) !== null) {
    links.push({ url: match[1], text: match[2] });
  }

  return links;
};

// Načtení odkazů z souboru ve stejné složce jako je skript
const links = loadLinks(path.resolve(__dirname, "ViceSlovLinks.txt"));

// Funkce pro procházení souborů
const processFiles = (directory) => {
  fs.readdirSync(directory).forEach((file) => {
    const absolutePath = path.join(directory, file);

    if (fs.statSync(absolutePath).isDirectory()) {
      processFiles(absolutePath); // rekurze pro procházení podsložek
    } else if (path.extname(file) === ".html") {
      let html = fs.readFileSync(absolutePath, "utf8");

      // Proveďte nahrazení pro všechny odkazy
      links.forEach((link) => {
        const re = new RegExp(
          `(?<!<a[^>]*>)\\b${escapeRegExp(link.text)}\\b(?!<\/a>)`,
          "gi",
        );
        html = html.replace(re, `<a href="${link.url}">${link.text}</a>`);
      });

      // Uložte změněný HTML soubor
      fs.writeFileSync(absolutePath, html, "utf8");
    }
  });
};

// Spustíme funkci na mateřské složce skriptu
processFiles(path.join(__dirname, ".."));
