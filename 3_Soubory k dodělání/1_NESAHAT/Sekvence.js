const { exec } = require("child_process");
const path = require("path");

const scriptsFirstRound = [
  "1-openAi.js", // Vygeneruje texty k destinaci přes API
  "2-Otazky.js", // Vygeneruje Otázky k destinaci přes API
  "3-Vylety.js", // Vygeneruje Výlety k destinaci přes API
  "kontrolaNadpisu.js", // Okontroluje nadpisy Výletů a Otázek
  "removeNonTagText.js", // Odstraní text, který není obalen Tagem a vrátí návratovou
  "ValidFiles.js", // Zkontroluje validní soubory, nevadlisní smaže a vrátí návratovou hodnotu
  //POkud je návratová hodnota TRUE - tak se scripty zpustí od začáítku ale jenom pro prázdné soubory
];

const scriptsSecondRound = [
  "LinkSplit.js", // Splitne soubor UniqueLinks.txt na 2 soubory
  "StrongSplit.js", // Splitne soubor StrongsList.txt na 2 soubory
  "ViceSlovLinks.js", // Nahradí fráze odkazem
  "JednoSlovoLinks.py", // Nahradí jedno slovo odkazem
  "ViceSlovStrong.js", // Nahradí fráze strongem
  "jednoSlovoStrong.py", // Nahradí slovo strongem
  "RemoveStrongs.py", // odstraní strongy kolem a v odkazech
  "RemoveStrongFromHeading.py", // odstraní strong z headingu
  "Headings.js", // nastaví správné heading třídy
  "FormatAllFiles.js", // Formátování html souborů
];

function runScript(script) {
  return new Promise((resolve, reject) => {
    console.log(`Spouštím skript ${script}`);
    const command = script.endsWith(".py") ? "python" : "node";
    const scriptDirectory = path.dirname(script);

    exec(
      `cd ${scriptDirectory} && ${command} ${script}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Chyba při spuštění skriptu ${script}: ${error}`);
          reject(error);
        } else {
          console.log(`Skript ${script} úspěšně ukončen`);
          resolve(stdout.trim() === "true");
        }
      },
    );
  });
}

async function runAllScripts(scripts) {
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    try {
      const isFinished = await runScript(script);
      // Pokud je skript "removeNonTagText.js" nebo "ValidFiles.js" a vrátil true, ukončíme cyklus
      if (
        (script === "removeNonTagText.js" || script === "ValidFiles.js") &&
        isFinished
      ) {
        return true;
      }
    } catch (error) {
      console.error(`Chyba při spuštění skriptu ${script}: ${error}`);
    }
  }
  return false;
}

async function main() {
  let isStillEditing = true;

  while (isStillEditing) {
    console.log("Spouštím první kolo skriptů");
    isStillEditing = await runAllScripts(scriptsFirstRound);
    if (isStillEditing) {
      console.log("První kolo skriptů nebylo dokončeno, opakuji...");
    }
  }

  console.log("První kolo skriptů dokončeno, spouštím druhé kolo skriptů");
  console.log("---------------------------------------------------------");
  await runAllScripts(scriptsSecondRound);

  console.log("Hotovo - všechny skripty byly úspěšně dokončeny.");
  console.log(" ");
  console.log("!!!>>> H.O.T.O.V.O <<<!!!");
  console.log("!!!>>> H.O.T.O.V.O <<<!!!");
  console.log("!!!>>> H.O.T.O.V.O <<<!!!");
  console.log(" ");
}

main();
