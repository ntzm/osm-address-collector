import { it } from "node:test";
import assert from "node:assert/strict";
import { createBoundingBox, move } from "../geo.mjs";

it("moves position", () => {
  assert.deepEqual(
    move({
      latitude: 51.50974,
      longitude: -0.11514,
    }, 45, 50),
    {
      latitude: 51.51005760130748,
      longitude: -0.11462969469105422,
    },
  );
})

it("creates a bounding box", () => {
  const boundingBox = createBoundingBox({
    latitude: 51.50974,
    longitude: -0.11514,
  }, 10);

  assert.deepEqual(boundingBox, [
    51.50969508423578,
    -0.1152121675657886,
    51.50978491576421,
    -0.1150678324342114,
  ]);
});
