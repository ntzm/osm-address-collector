import { it } from "node:test";
import assert from "node:assert/strict";
import createBoundingBox from "../createBoundingBox.mjs";

it("creates a bounding box", () => {
  const boundingBox = createBoundingBox({
    latitude: 51.50974,
    longitude: -0.11514,
  }, 10);

  assert.deepEqual([
    51.509695084235794,
    -0.11521216756578864,
    51.50978491576421,
    -0.11506783243421137,
  ], boundingBox);
});
