const fs = require("fs");
const path = require("path");
const glob = require("glob");
const prettier = require("prettier");

const htmlFilesPattern = "../**/*.html"; // Změňte tento vzor, aby odpovídal vašim HTML souborům.
const ignorePattern = "**/2 - BABI/**"; // Adresáře, které chcete ignorovat

async function formatHtmlFile(file) {
  try {
    const content = fs.readFileSync(file, "utf8");
    const formattedContent = await prettier.format(content, { parser: "html" });
    fs.writeFileSync(file, formattedContent, "utf8");
    return true;
  } catch (error) {
    console.error(`Chyba při formátování souboru ${file}:`, error);
    fs.writeFileSync(file, "", "utf8"); // Smazání obsahu souboru.
    return false;
  }
}

async function main() {
  const files = glob.sync(htmlFilesPattern, { ignore: ignorePattern });
  const erasedFiles = [];

  for (const file of files) {
    console.log(`Formátuji ${file}...`);
    const formatResult = await formatHtmlFile(file);
    if (!formatResult) {
      erasedFiles.push(file);
    }
  }

  if (erasedFiles.length > 0) {
    console.log("Následující soubory byly vymazány kvůli chybám:");
    console.log(erasedFiles.join("\n"));
    console.log(true);
  } else {
    console.log(false);
  }
}

main().catch((error) => {
  console.error("Chyba při formátování HTML souborů:", error);
});
