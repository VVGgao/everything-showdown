import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);

test("production scripts use the Vercel-native Next.js runtime", () => {
  assert.equal(packageJson.name, "everything-showdown");
  assert.equal(packageJson.scripts.dev, "next dev");
  assert.equal(packageJson.scripts.build, "next build");
  assert.equal(packageJson.scripts.start, "next start");
  assert.ok(packageJson.dependencies.next);
  assert.equal(packageJson.devDependencies.vinext, undefined);
  assert.equal(packageJson.devDependencies["@cloudflare/vite-plugin"], undefined);
  assert.equal(packageJson.devDependencies["@openai/sites-vite-plugin"], undefined);
  assert.equal(packageJson.dependencies["drizzle-orm"], undefined);
  assert.equal(packageJson.devDependencies["drizzle-kit"], undefined);
  assert.equal(packageJson.scripts["db:generate"], undefined);
});
