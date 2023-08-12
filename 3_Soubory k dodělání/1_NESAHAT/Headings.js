const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

// Název složky, ve které chcete prohledávat HTML soubory
const directoryPath = path.join(__dirname, "..");

// Funkce pro průchod všemi podsložkami a soubory
function walk(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
      return walk(absolute);
    } else if (path.extname(absolute) === ".html") {
      fs.readFile(absolute, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        const $ = cheerio.load(data);
        $(
          "h1:not(.custom-headingH1), h2:not(.custom-headingH2), h3:not(.custom-headingH3), h4:not(.custom-headingH4), h5:not(.custom-headingH5), h6:not(.custom-headingH6)",
        ).each(function () {
          let tagName = $(this).prop("tagName").toLowerCase();
          $(this).addClass("custom-heading" + tagName.toUpperCase());
        });

        // Získejte všechny prvky na nejvyšší úrovni těla a spojte je dohromady
        let updatedHtml = $("body")
          .children()
          .map(function () {
            return $(this).prop("outerHTML");
          })
          .get()
          .join("");

        fs.writeFileSync(absolute, updatedHtml);
      });
    }
  });
}

// Spustíme funkci na hlavní složce
walk(directoryPath);
