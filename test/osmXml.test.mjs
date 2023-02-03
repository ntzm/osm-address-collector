import { it } from "node:test";
import assert from "node:assert/strict";
import { getOsmFile } from "../osmXml.mjs";
import { JSDOM } from "jsdom";
import serialize from "w3c-xmlserializer";

const implementation = new JSDOM().window.document.implementation;

function collapse(string) {
  return string
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line)
    .join("");
}

it("creates an OSM XML file", () => {
  const addresses = [
    {
      latitude: 1,
      longitude: 2,
      numberOrName: "52",
      customTags: {},
      direction: "L",
      skippedNumbers: [],
      street: "Foo Road",
    },
    {
      latitude: 2,
      longitude: 3,
      numberOrName: "52a",
      customTags: {
        "addr:village": "Minton",
      },
      direction: "R",
      skippedNumbers: [],
      street: "Foo Street",
    },
    {
      latitude: 3,
      longitude: 4,
      numberOrName: "Apple Cottage",
      customTags: {
        "addr:village": "Minton",
        "addr:city": "Bimbom",
      },
      direction: "F",
      skippedNumbers: [],
      street: "Bar Road",
    },
  ];

  const notes = [
    {
      latitude: 1,
      longitude: 2,
      content: "Foo",
    },
  ];

  const surveyStart = new Date(Date.UTC(2020, 0, 1, 0, 0, 0, 0));

  assert.equal(
    getOsmFile(implementation, serialize, addresses, notes, surveyStart),
    collapse(`
      <osm version="0.6" generator="OSM Address Collector">
        <node id="-1577836800000" version="1" lat="1" lon="2">
          <tag k="addr:housenumber" v="52"/>
          <tag k="addr:street" v="Foo Road"/>
        </node>
        <node id="-1577836800001" version="1" lat="2" lon="3">
          <tag k="addr:housenumber" v="52a"/>
          <tag k="addr:street" v="Foo Street"/>
          <tag k="addr:village" v="Minton"/>
        </node>
        <node id="-1577836800002" version="1" lat="3" lon="4">
          <tag k="addr:housename" v="Apple Cottage"/>
          <tag k="addr:street" v="Bar Road"/>
          <tag k="addr:village" v="Minton"/>
          <tag k="addr:city" v="Bimbom"/>
        </node>
        <node id="-1577836800003" version="1" lat="1" lon="2">
          <tag k="note" v="Foo"/>
        </node>
      </osm>
    `),
  );
});
