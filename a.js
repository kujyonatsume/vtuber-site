import { readdirSync, statSync, readFileSync, writeFileSync } from "fs";
import { join, relative } from "path";

const rootDir = "."; // 專案根目錄
const outputFile = "all_files.txt";
const fileList = [];
function walk(dir) {
  for (const file of readdirSync(dir)) {
    if (
      file.startsWith(".") ||
      file == "node_modules" ||
      file == "a.js" ||
      file == "package-lock.json"
    )
      continue;
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) walk(fullPath);
    else if (
      file.endsWith(".ts") ||
      file.endsWith(".js") ||
      file.endsWith(".vue")
    )
      fileList.push(fullPath);
  }
}

function main() {
  walk(rootDir);
  let output = "";

  for (const file of fileList) {
    const relPath = relative(rootDir, file);
    const content = readFileSync(file, "utf-8");
    output += `==== ${relPath} ====\n${content}\n\n`;
  }

  writeFileSync(outputFile, output);
  console.log(`完成，輸出到 ${outputFile}`);
}

main();
