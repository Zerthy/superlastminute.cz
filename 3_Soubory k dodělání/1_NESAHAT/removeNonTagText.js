const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const directoryPath = path.join(__dirname, "..");

function prochazetSlozky(directory) {
  let upravenoSoubory = [];
  fs.readdirSync(directory).forEach((file) => {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
      upravenoSoubory = upravenoSoubory.concat(prochazetSlozky(absolute));
    } else if (path.extname(absolute) === ".html") {
      const bylUpraven = upravitHtml(absolute);
      if (bylUpraven) {
        upravenoSoubory.push(absolute);
      }
    }
  });
  return upravenoSoubory;
}

function upravitHtml(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  const $ = cheerio.load(html, { decodeEntities: false });
  let bylUpraven = false;

  $("body")
    .contents()
    .each(function () {
      if (this.type === "text") {
        $(this).remove();
        bylUpraven = true;
      }
    });

  if (bylUpraven) {
    fs.writeFileSync(filePath, $("body").html());
  }

  return bylUpraven;
}

const upravenoSoubory = prochazetSlozky(directoryPath);
console.log("Upravené soubory:");
console.log(upravenoSoubory);

if (upravenoSoubory.length > 0) {
  console.log(true);
} else {
  console.log(false);
}
