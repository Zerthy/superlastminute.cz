const fs = require("fs");
const path = require("path");
const prettier = require("prettier");

const BASE_DIRECTORY = "../";
const IGNORE_DIRECTORY = "2 - BABI";

async function formatFiles(directory) {
  const files = fs.readdirSync(directory);

  for (let file of files) {
    let filePath = path.join(directory, file);

    if (fs.statSync(filePath).isDirectory()) {
      if (path.basename(filePath) === IGNORE_DIRECTORY) {
        console.log(`Přeskakuji složku ${filePath}`);
        continue;
      }
      await formatFiles(filePath);
    } else if (path.extname(file) === ".html") {
      const fileContent = fs.readFileSync(filePath, "utf8");
      try {
        const formattedContent = await prettier.format(fileContent, {
          parser: "html",
        });
        fs.writeFileSync(filePath, formattedContent);
        console.log(`Soubor ${filePath} byl úspěšně zformátován.`);
      } catch (error) {
        console.error(
          `Chyba při formátování souboru ${filePath}: ${error.message}`,
        );
      }
    }
  }
}

formatFiles(BASE_DIRECTORY).catch(console.error);
