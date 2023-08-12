const { exec } = require("child_process");
const path = require("path");

// Pole s názvy skriptů, které se mají spustit
const scripts = [
  "1-openAi.js", // Vygeneruje texty k destinaci přes API
  "kontrolaTextu.js", // kontrola dokončení textu
  "2-Otazky.js", // Vygeneruje Otázky k destinaci přes API
  "kontrolaTextu.js", // kontrola dokončení textu
  "3-Vylety.js", // Vygeneruje Výlety k destinaci přes API
  "kontrolaTextu.js", // kontrola dokončení textu
  "kontrolaNadpisu.js", // Okontroluje nadpisy Výletů a Otázek
  "removeNonTagText.js", // Odstraní text, který není obalen Tagem
  "ValidAllFiles.js", // Pokud najde neplatný soubor, smaže jej a vrátí chybový kód 1
];

// Funkce pro spuštění skriptu
function runScript(script) {
  return new Promise((resolve, reject) => {
    console.log(`Spouštím skript ${script}`);

    // Rozpoznání typu skriptu podle přípony
    const command = script.endsWith(".py") ? "python" : "node";
    const scriptDirectory = path.dirname(script); // Získání adresáře skriptu

    const process = exec(
      `cd ${scriptDirectory} && ${command} ${script}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Chyba při spuštění skriptu ${script}: ${error}`);
          reject(error);
        } else {
          console.log(`Skript ${script} úspěšně ukončen`);
          resolve();
        }
      },
    );
  });
}

// Spustí skripty v pořadí, jak jsou uvedeny v poli
async function runAllScripts() {
  for (let i = 0; i < scripts.length; i++) {
    await runScript(scripts[i]);
  }

  console.log("Hotovo - všechny skripty byly úspěšně dokončeny.");
  console.log(" ");
  console.log("!!!>>> H.O.T.O.V.O <<<!!!");
  console.log("!!!>>> H.O.T.O.V.O <<<!!!");
  console.log("!!!>>> H.O.T.O.V.O <<<!!!");
  console.log(" ");
}

runAllScripts();
