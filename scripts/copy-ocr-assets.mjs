import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { mkdir, copyFile, readdir, writeFile } from "node:fs/promises";
const require = createRequire(import.meta.url),
  root = process.cwd();
const moduleRoot = (name) => dirname(require.resolve(`${name}/package.json`));
const dest = join(root, "public/ocr");
await mkdir(join(dest, "core"), { recursive: true });
await mkdir(join(dest, "lang"), { recursive: true });
await copyFile(
  join(moduleRoot("tesseract.js"), "dist/worker.min.js"),
  join(dest, "worker.min.js"),
);
const core = moduleRoot("tesseract.js-core");
for (const name of await readdir(core))
  if (name.endsWith(".wasm.js"))
    await copyFile(join(core, name), join(dest, "core", name));
for (const lang of ["ben", "eng"])
  await copyFile(
    join(
      moduleRoot(`@tesseract.js-data/${lang}`),
      "4.0.0_best_int",
      `${lang}.traineddata.gz`,
    ),
    join(dest, "lang", `${lang}.traineddata.gz`),
  );
await copyFile(
  join(moduleRoot("tesseract.js"), "LICENSE.md"),
  join(dest, "TESSERACT-LICENSE.txt"),
).catch(() => {});
await writeFile(
  join(dest, "NOTICE.txt"),
  "OCR powered by Tesseract.js and Tesseract.js-core (Apache-2.0). Bengali and English model files are distributed from @tesseract.js-data/ben and @tesseract.js-data/eng packages. Assets are served from this site; selected images are processed locally in the browser.\n",
);
console.log("Local OCR assets ready");
