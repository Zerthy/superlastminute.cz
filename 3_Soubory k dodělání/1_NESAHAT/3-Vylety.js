const fs = require("fs");
const path = require("path");
const axios = require("axios");

const API_KEY = "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";
const BASE_DIRECTORY = "../";
const IGNORE_DIRECTORY = "2 - BABI";
const SKIPPED_CONTENT = "<h2>Tipy na výlety</h2>"; // Změněno na "Tipy na výlety"

async function generateContent(topic) {
  const instruction = `Váš úkol je působit jako autor obsahu s vynikajícími dovednostmi v SEO a plynnou češtinou. Budete vytvářet obsah podle následující šablony. Potřebuji aby jsi napsal několik tématických nápadů na výlet v dané destinaci. Výlety by měly v člověku vzbudit zájem o danou destinaci.

  Do <H3></H3> nevkládej slovo "výlet" Chci aby jsi tam vložil něco jako název výletu.

  Náspis "<h2>Tipy na výlety</h2>" musí být vždy stejný.

  Šablona:
  <h2>Tipy na výlety</h2>
  <ol>
    <li>
      <h3>Název</h3>
      <p>Popis výletu</p>
    </li>
    <li>
      <h3>Název</h3>
      <p>Popis výletu</p>
    </li>
    <li>
      <h3>Název</h3>
      <p>Popis výletu</p>
    </li>
    <li>
      <h3>Název</h3>
      <p>Popis výletu</p>
    </li>
    <li>
      <h3>Název</h3>
      <p>Popis výletu</p>
    </li>
  .....
  </ol>
  
  ${topic}`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions", // aktualizované URL
    {
      model: "gpt-3.5-turbo", // přidáno model
      messages: [{ role: "system", content: instruction }], // aktualizovaná vstupní data
    },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response.data.choices[0].message.content; // aktualizovaný výstup
}

async function processFiles(directory) {
  const files = fs.readdirSync(directory);

  for (let file of files) {
    let filePath = path.join(directory, file);

    if (fs.statSync(filePath).isDirectory()) {
      if (path.basename(filePath) === IGNORE_DIRECTORY) {
        console.log(`Přeskakuji složku ${filePath}`);
        continue;
      }
      await processFiles(filePath);
    } else if (path.extname(file) === ".html") {
      let topic = path.basename(file, ".html");
      try {
        const originalContent = fs.readFileSync(filePath, "utf8");

        if (originalContent.includes(SKIPPED_CONTENT)) {
          console.log(
            `Soubor ${filePath} již obsahuje cílený obsah a byl přeskočen.`,
          );
          continue;
        }

        const newContent = await generateContent(topic);
        const finalContent = `${originalContent}\n${newContent}`;
        fs.writeFileSync(filePath, finalContent, "utf8");
        console.log(`Soubor ${filePath} byl úspěšně zpracován a uložen.`);
      } catch (error) {
        console.error(
          `Nepodařilo se generovat obsah pro ${filePath}: ${error.message}`,
        );
      }
    }
  }
}

processFiles(BASE_DIRECTORY);
