import puppeteer from "puppeteer";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { SourceMapConsumer } from "source-map";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function resolveSourcePath(url, line, column) {
  try {
    // Try to load the sourcemap for this JS file
    const mapUrl = url + ".map"; // Next.js always generates *.js.map
    const res = await fetch(mapUrl);
    if (!res.ok) return url;

    const rawMap = await res.json();
    const consumer = await new SourceMapConsumer(rawMap);

    const pos = consumer.originalPositionFor({ line, column });
    consumer.destroy();

    if (pos && pos.source) {
      return pos.source; // returns "node_modules/@mui/material/Button/Button.js"
    }
  } catch (err) {
    // ignore and fallback
  }
  return url;
}

async function runCoverage() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await Promise.all([page.coverage.startJSCoverage(), page.coverage.startCSSCoverage()]);

  await page.goto("http://localhost:3000/forgot-password", { waitUntil: "networkidle0" });

  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ]);

  const rows = [["File", "Type", "Total Bytes", "Used Bytes", "Unused Bytes", "Unused %"]];

  for (const entry of [...jsCoverage, ...cssCoverage]) {
    const usedBytes = entry.ranges.reduce((sum, range) => sum + range.end - range.start, 0);
    const totalBytes = entry.text.length;
    const unusedBytes = totalBytes - usedBytes;
    const percentUnused = ((unusedBytes / totalBytes) * 100).toFixed(2);

    // Try to resolve with source maps (only for JS files)
    let finalUrl = entry.url;
    if (entry.url.endsWith(".js")) {
      // Pick the first range just to get a mapping
      const firstRange = entry.ranges[0] || { start: 0 };
      const textBefore = entry.text.slice(0, firstRange.start);
      const line = textBefore.split("\n").length;
      const column = textBefore.length - textBefore.lastIndexOf("\n");

      finalUrl = await resolveSourcePath(entry.url, line, column);
    }

    rows.push([
      finalUrl,
      entry.url.endsWith(".css") ? "CSS" : "JS",
      totalBytes,
      usedBytes,
      unusedBytes,
      percentUnused + "%",
    ]);
  }

  const outputPath = join(__dirname, "coverage-report.csv");
  const csv = rows.map((r) => r.join(",")).join("\n");
  writeFileSync(outputPath, csv, "utf-8");

  console.log(`✅ Coverage report saved to ${outputPath}`);

  await browser.close();
}

runCoverage();