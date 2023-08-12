const fs = require("fs");

// Načtení seznamu odkazů ze souboru UniqueLinks.txt
const path = require("path");
const absolutniCesta = path.resolve(__dirname, "..", "UniqueLinks.txt");
const seznamOdkazu = fs.readFileSync(absolutniCesta, "utf8").split("\n");

// Oddělení odkazů na základě počtu slov v anchor textu
const odkazyJednoSlovo = [];
const odkazyViceSlov = [];

seznamOdkazu.forEach((odkaz) => {
  // Získání obsahu anchor textu mezi značkami <a> a </a>
  const match = odkaz.match(/<a[^>]*>(.*?)<\/a>/);

  if (match && match[1]) {
    const anchorText = match[1];

    // Kontrola počtu slov v anchor textu
    const pocetSlov = anchorText.split(" ").length;

    // Rozdělení odkazu do odpovídajícího seznamu
    if (pocetSlov === 1) {
      odkazyJednoSlovo.push(odkaz);
    } else {
      odkazyViceSlov.push(odkaz);
    }
  }
});

// Smazání obsahu souborů
fs.writeFileSync("JednoSlovoLinks.txt", "", "utf8");
fs.writeFileSync("ViceSlovLinks.txt", "", "utf8");

// Uložení odkazů do příslušných souborů
fs.appendFileSync("JednoSlovoLinks.txt", odkazyJednoSlovo.join("\n"), "utf8");
fs.appendFileSync("ViceSlovLinks.txt", odkazyViceSlov.join("\n"), "utf8");

console.log(
  "Seznam odkazů byl rozdělen do souborů JednoSlovoLinks.txt a ViceSlovLinks.txt."
);
