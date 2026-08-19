import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("production build emits an EdgeOne-deployable static homepage", async () => {
  const homepage = await readFile(
    new URL("../out/index.html", import.meta.url),
    "utf8",
  );

  assert.match(homepage, /<!DOCTYPE html>/i);
  assert.match(homepage, /万物对决/);
});
