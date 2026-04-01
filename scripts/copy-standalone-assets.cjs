/**
 * Con output: 'standalone', Next no incluye public/ ni .next/static dentro de
 * .next/standalone. Sin esta copia, imágenes y CSS devuelven HTML (404) y parece
 * que "no carga el CSS". Misma idea que en el Dockerfile (COPY public + static).
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const standaloneDir = path.join(root, ".next", "standalone");
const publicSrc = path.join(root, "public");
const staticSrc = path.join(root, ".next", "static");
const publicDest = path.join(standaloneDir, "public");
const staticDest = path.join(standaloneDir, ".next", "static");

if (!fs.existsSync(standaloneDir)) {
  console.warn(
    "[copy-standalone-assets] No existe .next/standalone. Ejecuta antes: npm run build",
  );
  process.exit(0);
}

if (fs.existsSync(publicSrc)) {
  fs.cpSync(publicSrc, publicDest, { recursive: true });
  console.log("[copy-standalone-assets] public -> .next/standalone/public");
} else {
  console.warn("[copy-standalone-assets] Falta la carpeta public/");
}

if (fs.existsSync(staticSrc)) {
  fs.mkdirSync(path.dirname(staticDest), { recursive: true });
  fs.cpSync(staticSrc, staticDest, { recursive: true });
  console.log(
    "[copy-standalone-assets] .next/static -> .next/standalone/.next/static",
  );
} else {
  console.warn("[copy-standalone-assets] Falta .next/static (¿build incompleto?)");
}
