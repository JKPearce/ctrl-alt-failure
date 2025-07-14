import { readFile, writeFile } from "fs/promises";
import path from "path";

export async function loadJSON(filename) {
  const filePath = path.join(process.cwd(), "/src/data", filename);
  const fileData = await readFile(filePath, "utf-8");
  return fileData ? JSON.parse(fileData) : [];
}

export async function saveJSON(filename, data) {
  const filePath = path.join(process.cwd(), "/src/data", filename);
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}
