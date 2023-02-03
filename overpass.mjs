const OVERPASS_ENDPOINT = 'https://maps.mail.ru/osm/tools/overpass/api/interpreter';

const TIMEOUT_MILLISECONDS = 10_000;

export default async function overpassQuery(query) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MILLISECONDS);

  const response  = await fetch(
    `${OVERPASS_ENDPOINT}?data=${encodeURIComponent(query)}`,
    { signal: controller.signal }
  );

  clearTimeout(timeoutId);

  const body = await response.json();

  return body.elements;
}
