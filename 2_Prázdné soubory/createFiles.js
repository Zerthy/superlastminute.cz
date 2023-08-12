const fs = require("fs");
const path = require("path");

// Načti data z fileStructure.json
let data = JSON.parse(fs.readFileSync("fileStructure.json", "utf8"));

function createFilesAndDirectories(data, currentPath = "") {
  for (let key in data) {
    if (key === "files") {
      data[key].forEach((file) => {
        let filePath = path.join(currentPath, file);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, "", "utf8");
        }
      });
    } else {
      let newPath = path.join(currentPath, key);
      if (!fs.existsSync(newPath)) {
        fs.mkdirSync(newPath, { recursive: true });
      }
      createFilesAndDirectories(data[key], newPath);
    }
  }
}

createFilesAndDirectories(data);
