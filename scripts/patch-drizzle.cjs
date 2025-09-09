// scripts/patch-drizzle.js
const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "..", "node_modules", "drizzle-orm");

function ensureRedirect(folder) {
  const jsPath = path.join(folder, "index.js");
  const cjsPath = path.join(folder, "index.cjs");

  if (fs.existsSync(cjsPath) && !fs.existsSync(jsPath)) {
    fs.writeFileSync(
      jsPath,
      `module.exports = require("./index.cjs");\n`,
      "utf8"
    );
    console.log(`✅ Created redirect: ${jsPath}`);
  }
}

if (fs.existsSync(baseDir)) {
  // patch root
  ensureRedirect(baseDir);

  // patch semua subfolder
  fs.readdirSync(baseDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .forEach((dir) => {
      ensureRedirect(path.join(baseDir, dir.name));
    });
} else {
  console.warn("⚠️ drizzle-orm not found, skipping patch.");
}
