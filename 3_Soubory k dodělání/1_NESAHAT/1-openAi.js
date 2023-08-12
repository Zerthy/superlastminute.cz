const fs = require("fs");
const path = require("path");
const axios = require("axios");

const API_KEY = "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";
const BASE_DIRECTORY = "../";
const IGNORE_DIRECTORY = "2 - BABI";

const MAX_TOKENS = 9500;

async function generateContent(topic) {
  const instruction = `
  Váš úkol je působit jako autor obsahu s vynikajícími dovednostmi v SEO a plynnou češtinou. Budete vytvářet obsah podle dvou klíčových částí: osnovy a finálního článku.

  Napiš hodně obsáhlí článek na ${topic}. Zaměř se hlavně na cestování. 

  Osnova:
  Osnova je první krok. Začněte vytvářením osnovy článku se všemi nadpisy a podnadpisy. Ujistěte se, že máte minimálně 10 nadpisů a podnadpisů 
  (včetně H1, H2, H3 a H4), které pokrývají témata uvedená ve výzvě. Například:
  
  H1: Nadpis
  H2: Podnadpis
  H3: Podnadpis
  H4: Podnadpis 
  ...
  
  Článek:
  Poté, co je osnova hotová, přejděte do HTML 5 editoru a začněte psát článek podle této osnovy. Měli byste vytvořit 4000 tokenů dlouhý, 
  100% unikátní a SEO optimalizovaný článek v češtině. 
  
  Při psaní článku:
  
  Používejte vlastní slova, nikoli kopírování a vkládání z jiných zdrojů.
  Pište konverzačním stylem a buďte zapojeni. Použijte ležérní tón, používejte osobní zájmena, snažte se být jednoduchý, zapojte čtenáře, 
  používejte aktivní hlas, buďte struční a začleňte analogie a metafory.
  Používejte plně podrobné odstavce, které čtenáře zaujmou.
  Používejte správné HTML značky pro nadpisy. Tučně vyznačte všechny nadpisy a podnadpisy. Například:
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <p> Article body </p>
  Dej si záležet na správném formátování textu pomocí HTML značek. Všechny odstavce by měly být uzavřeny mezi <p> a </p> značky.
  Veškeré názvy a důležitá slova a slovní spojení by měla být zvýrazněna tučně.
  Toto je příklad jak by měl vypadat odstavec textu:
    <p>Toto je vzorový odstavec. Vaše texty by měly mít podobnou strukturu a být formátovány podobným způsobem.</p>
  Zakončete článek závěrečným odstavcem. Nechci žádné FAQ na závěr.
    <h2>Závěr</h2>
    <p>Závěrečný odstavec</p>
  
  Všechny tyto aspekty jsou klíčové pro vytváření kvalitního SEO článku. Ujistěte se, že je splňujete v rámci svého finálním článku, 
  včetně správného použití HTML značek.
  
  ${topic}`;

  let messages = [{ role: "system", content: instruction }];
  let content = "";

  while (content.length < MAX_TOKENS) {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo-16k",
        temperature: 1,
        max_tokens: Math.min(9500, MAX_TOKENS - content.length),
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const newContent = response.data.choices[0].message.content;
    content += newContent;
    messages.push({ role: "assistant", content: newContent });
  }

  return content;
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
      // Kontrola, zda je HTML soubor prázdný
      if (fs.readFileSync(filePath, "utf8").trim() === "") {
        let topic = path.basename(file, ".html");
        try {
          const content = await generateContent(topic);
          fs.writeFileSync(filePath, content, "utf8");
          console.log(`Soubor ${filePath} byl úspěšně zpracován a uložen.`);
        } catch (error) {
          console.error(
            `Nepodařilo se generovat obsah pro ${filePath}: ${error.message}`,
          );
        }
      }
    }
  }
}

processFiles(BASE_DIRECTORY);
