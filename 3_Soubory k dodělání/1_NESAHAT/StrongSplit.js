const fs = require("fs");

// Načtení seznamu <strong> tagů ze souboru StrongsList.txt
const path = require("path");
const absolutniCesta = path.resolve(__dirname, "..", "StrongsList.txt");
const seznamTagu = fs.readFileSync(absolutniCesta, "utf8").split("\n");

// Oddělení tagů na základě počtu slov uvnitř
const tagyJednoSlovo = [];
const tagyViceSlov = [];

seznamTagu.forEach((tag) => {
  // Získání obsahu mezi značkami <strong> a </strong>
  const match = tag.match(/<strong[^>]*>(.*?)<\/strong>/);

  if (match && match[1]) {
    const text = match[1];

    // Kontrola počtu slov uvnitř
    const pocetSlov = text.split(" ").length;

    // Rozdělení tagu do odpovídajícího seznamu
    if (pocetSlov === 1) {
      tagyJednoSlovo.push(tag);
    } else {
      tagyViceSlov.push(tag);
    }
  }
});

// Smazání obsahu souborů
fs.writeFileSync("JednoSlovoStrong.txt", "", "utf8");
fs.writeFileSync("ViceSlovStrong.txt", "", "utf8");

// Uložení tagů do příslušných souborů
fs.appendFileSync("JednoSlovoStrong.txt", tagyJednoSlovo.join("\n"), "utf8");
fs.appendFileSync("ViceSlovStrong.txt", tagyViceSlov.join("\n"), "utf8");

console.log(
  "Seznam tagů byl rozdělen do souborů JednoSlovoStrong.txt a VíceSlovStrong.txt."
);
