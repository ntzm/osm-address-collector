import findNearestStreets from "./findNearestStreets.mjs";
import guessNextNumber from "./guessNextNumber.mjs";
import { getOsmFile } from "./osmXml.mjs";

const VERSION = "1.0.0";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

const onClick = ($el, cb) => {
  $el.addEventListener("click", cb);
};

const $container = document.getElementById("main");

/*
HISTORY
*/

const $history = document.getElementById("history");

const addAction = (action) => {
  const item = document.createElement("li");
  item.textContent = action;
  $history.prepend(item);

  if ($history.children.length > 2) {
    $history.removeChild($history.lastChild);
  }
};

/*
SETTINGS
*/

const $settings = document.getElementById("settings");

onClick(document.getElementById("info-row"), () => {
  $settings.style.display = "block";
});

onClick(document.getElementById("close-settings"), () => {
  $settings.style.display = "none";
});

/*
SETTINGS - Advanced
*/

document.getElementById("setting-advanced").addEventListener("click", () => {
  alert(
`Orientation is used to throw address nodes in the correct direction.
Orientation provider shows the method to get your device's orientation.
Orientation shows your device's current orientation.

We use Overpass API to find streets nearby to you.
You can customise the timeout and the endpoint here.
Do not change the endpoint unless you know what you are doing!`
);
});

let overpassTimeout = Number(localStorage.getItem("overpassTimeout") ?? 10_000);
const $overpassTimeout = document.getElementById("overpass-timeout");
$overpassTimeout.value = overpassTimeout;

$overpassTimeout.addEventListener("blur", () => {
  overpassTimeout = Number($overpassTimeout.value);
  localStorage.setItem("overpassTimeout", overpassTimeout);
});

let overpassEndpoint = localStorage.getItem("overpassEndpoint") ?? "https://maps.mail.ru/osm/tools/overpass/api/interpreter";
const $overpassEndpoint = document.getElementById("overpass-endpoint");
$overpassEndpoint.value = overpassEndpoint;

$overpassEndpoint.addEventListener("blur", () => {
  overpassEndpoint = $overpassEndpoint.value;
  localStorage.setItem("overpassEndpoint", overpassEndpoint);
});

/*
SETTINGS - Info
*/

const $orientationProvider = document.getElementById("orientation-provider");

/*
SETTINGS - General
*/

document.getElementById("setting-general").addEventListener("click", () => {
  alert(
`Choose a distance to throw address nodes from your current position.
If you add an address node by pressing the left arrow key, it will throw the node to your left by this amount.`
);
});

const $distance = document.getElementById("distance");
let distance = Number(localStorage.getItem("distance") ?? 10);
$distance.value = distance;

const $distanceDisplay = document.getElementById("distance-display");
$distanceDisplay.textContent = distance;

$distance.addEventListener("input", () => {
  distance = Number($distance.value);
  $distanceDisplay.textContent = distance;
  localStorage.setItem("distance", distance);
});

/*
SETTINGS - Street
*/

document.getElementById("setting-street").addEventListener("click", () => {
  alert(
`Add a street to address nodes.
The street you choose will only be applied to addresses going forward.
You can type in the street name manually, or click "Get streets" to retrieve a list of streets near to you.
You can change the distance it will look for nearby streets with the "Street search distance" slider.`
);
});

const $streets = document.getElementById("streets");
const $street = document.getElementById("street");
const $updateStreets = document.getElementById("update-streets");
const $updateStreetsStatus = document.getElementById("update-streets-status");

let streetSearchDistance = Number(localStorage.getItem("street-search-distance") ?? 10);
const $streetSearchDistance = document.getElementById("street-search-distance");
$streetSearchDistance.value = streetSearchDistance;

const $streetSearchDistanceDisplay = document.getElementById("street-search-distance-display");
$streetSearchDistanceDisplay.textContent = streetSearchDistance;

$streetSearchDistance.addEventListener("input", () => {
  const tempStreetSearchDistance = Number($streetSearchDistance.value);
  streetSearchDistance = tempStreetSearchDistance;
  $streetSearchDistanceDisplay.textContent = streetSearchDistance;
  localStorage.setItem("street-search-distance", streetSearchDistance);
});

$street.addEventListener("focus", () => {
  $street.value = "";
});

onClick($updateStreets, async () => {
  if (currentPosition === null) {
    $updateStreetsStatus.textContent = "GPS required";
    $updateStreetsStatus.classList.add("status--bad");
    return;
  }

  $updateStreets.disabled = true;
  $updateStreetsStatus.textContent = "Updating streets...";
  $updateStreetsStatus.classList.remove("status--good", "status--bad");

  let nearestStreets;

  try {
    nearestStreets = await findNearestStreets(
      currentPosition,
      streetSearchDistance,
      overpassEndpoint,
      overpassTimeout,
    );
  } catch (error) {
    let message = error.message;

    if (error.name === "AbortError") {
      message = "Timed out";
    }

    $updateStreetsStatus.textContent = `Overpass error: ${message}`;
    $updateStreetsStatus.classList.add("status--bad");
    return;
  } finally {
    $updateStreets.disabled = false;
  }

  $updateStreetsStatus.textContent = `Found ${nearestStreets.length} street${nearestStreets.length === 1 ? '' : 's'}`;
  $updateStreetsStatus.classList.add("status--good");

  $streets.replaceChildren(
    ...nearestStreets.map((street) => {
      const $option = document.createElement("option");
      $option.value = street;
      return $option;
    })
  );
});

/*
SETTINGS - Custom tags
*/

document.getElementById("setting-custom-tags").addEventListener("click", () => {
  alert(
`Add custom OSM tags to each address node.
The tags you add will only be applied to addresses going forward.`
);
});

let customTags = JSON.parse(localStorage.getItem("customTags") ?? "{}");
const $customTagContainer = document.getElementById("custom-tags");

const $addCustomTag = document.getElementById("add-custom-tag");

const updateCustomTags = (e) => {
  if (e && e.target.classList.contains("key-input") && e.target.value === "addr:street") {
    alert("Please use the street setting above to set the street instead of the custom tags");
  }

  customTags = Object.fromEntries(
    [...document.querySelectorAll(".custom-tag")].map(($tag) => [
      $tag.querySelector(".key-input").value,
      $tag.querySelector(".value-input").value,
    ])
  );

  localStorage.setItem("customTags", JSON.stringify(customTags));
};

const addCustomTag = (key, value) => {
  const container = document.createElement("div");
  container.classList.add("custom-tag", "setting-list__row");

  const removeButton = document.createElement("button");
  removeButton.textContent = "x";

  onClick(removeButton, () => {
    container.remove();
    updateCustomTags();
  });

  const keyInput = document.createElement("input");
  keyInput.type = "text";
  keyInput.value = key;
  keyInput.placeholder = "Key";
  keyInput.autocapitalize = "none";
  keyInput.setAttribute("list", "tag-keys");
  keyInput.classList.add("key-input", "setting-input", "setting-list__input");

  const valueInput = document.createElement("input");
  valueInput.type = "text";
  valueInput.value = value;
  valueInput.placeholder = "Value";
  valueInput.classList.add("value-input", "setting-input", "setting-list__input");

  keyInput.addEventListener("blur", updateCustomTags);
  valueInput.addEventListener("blur", updateCustomTags);

  container.append(removeButton);
  container.append(keyInput);
  container.append(valueInput);

  $customTagContainer.append(container);
};

Object.entries(customTags).forEach(([key, value]) => addCustomTag(key, value));

onClick($addCustomTag, () => addCustomTag("", ""));

/*
SETTINGS - SKIP NUMBERS
*/

document.getElementById("setting-skip-numbers").addEventListener("click", () => {
  alert(
`Choose some numbers to skip when the app tries to guess the next number in the sequence.
For example, in the UK the number 13 is often skipped.`
);
});

let skipNumbers = JSON.parse(localStorage.getItem("skipNumbers") ?? "[]");
const $skipNumbersContainer = document.getElementById("skip-numbers");

const $addSkipNumber = document.getElementById("add-skip-number");

const updateSkipNumbers = () => {
  skipNumbers = [...document.querySelectorAll(".skip-number")]
    .map(($tag) => $tag.querySelector(".number-input").value)
    .filter((value) => value !== "")
    .map(Number);

  localStorage.setItem("skipNumbers", JSON.stringify(skipNumbers));
};

const addSkipNumber = (number) => {
  const container = document.createElement("div");
  container.classList.add("skip-number", "setting-list__row");

  const removeButton = document.createElement("button");
  removeButton.textContent = "x";

  onClick(removeButton, () => {
    container.remove();
    updateSkipNumbers();
  });

  const input = document.createElement("input");
  input.type = "number";
  input.value = number;
  input.placeholder = "Number";
  input.classList.add("number-input", "setting-input", "setting-list__input");

  input.addEventListener("blur", updateSkipNumbers);

  container.append(removeButton);
  container.append(input);

  $skipNumbersContainer.append(container);
}

skipNumbers.forEach((skipNumber) => addSkipNumber(skipNumber));

onClick($addSkipNumber, () => addSkipNumber(""));

/*
RECORDING
*/

const degreesToRadians = (degrees) => (degrees * Math.PI) / 180;
const radiansToDegrees = (radians) => (radians * 180) / Math.PI;
const move = (coords, bearing, amountKm) => {
  const radiusOfEarthKm = 6378.1;
  const bearingRadians = degreesToRadians(bearing);

  const latitudeRadians = degreesToRadians(coords.latitude);
  const longitudeRadians = degreesToRadians(coords.longitude);

  const movedLatitudeRadians = Math.asin(
    Math.sin(latitudeRadians) * Math.cos(amountKm / radiusOfEarthKm) +
      Math.cos(latitudeRadians) *
        Math.sin(amountKm / radiusOfEarthKm) *
        Math.cos(bearingRadians)
  );
  const movedLongitudeRadians =
    longitudeRadians +
    Math.atan2(
      Math.sin(bearingRadians) *
        Math.sin(amountKm / radiusOfEarthKm) *
        Math.cos(latitudeRadians),
      Math.cos(amountKm / radiusOfEarthKm) -
        Math.sin(latitudeRadians) * Math.sin(movedLatitudeRadians)
    );

  return {
    latitude: radiansToDegrees(movedLatitudeRadians),
    longitude: radiansToDegrees(movedLongitudeRadians),
  };
};

const saveAddresses = (a) =>
  localStorage.setItem("addresses", JSON.stringify(a));

const getSavedAddresses = () =>
  JSON.parse(localStorage.getItem("addresses") ?? '[]');

const $currentNumberOrName = document.getElementById("current-number-or-name");
let addresses = [];
let lastSkippedNumbers = [];
let numberIsGuessed = false;
let currentPosition = null;
let currentOrientation = null;

const savedAddresses = getSavedAddresses();

if (savedAddresses.length > 0) {
  if (confirm(`You have ${savedAddresses.length} unsaved addresses from previous session, do you want to load them?`)) {
    addresses = savedAddresses;
  } else {
    saveAddresses([]);
  }
}

$currentNumberOrName.addEventListener("focus", (e) => {
  if (numberIsGuessed) {
    $currentNumberOrName.classList.remove("guessed");
    $currentNumberOrName.value = "";
  }
});

[...document.getElementsByClassName("append")].forEach((append) => {
  onClick(append, () => {
    if (numberIsGuessed) {
      numberIsGuessed = false;
      lastSkippedNumbers = [];
      $currentNumberOrName.classList.remove("guessed");
      $currentNumberOrName.value = "";
    }

    $currentNumberOrName.value = $currentNumberOrName.value.concat(
      append.dataset.number
    );
  });
});

[...document.getElementsByClassName("submit")].forEach((submit) => {
  onClick(submit, () => {
    if (currentPosition === null) {
      alert("No GPS");
      return;
    }

    const numberOrName = $currentNumberOrName.value;

    if (numberOrName === "") {
      alert("No number or name");
      return;
    }

    let bearing = currentOrientation;

    if (bearing === null) {
      alert("No orientation available");
      return;
    }

    const direction = submit.dataset.direction;

    if (direction === "L") {
      bearing -= 90;
    }

    if (direction === "R") {
      bearing += 90;
    }

    bearing %= 360;

    if (bearing < 0) {
      bearing += 360;
    }

    const newPosition = move(currentPosition, bearing, distance / 1000);

    addresses.push({
      latitude: newPosition.latitude,
      longitude: newPosition.longitude,
      numberOrName: numberOrName,
      customTags,
      direction,
      skippedNumbers: lastSkippedNumbers,
      street: $street.value,
    });
    saveAddresses(addresses);

    addAction(`+ ${direction} ${numberOrName}`);

    let guessedNextNumber;
    [guessedNextNumber, lastSkippedNumbers] = guessNextNumber(addresses, skipNumbers);

    if (!guessedNextNumber) {
      $currentNumberOrName.value = "";
      return;
    }

    $currentNumberOrName.value = guessedNextNumber;
    $currentNumberOrName.classList.add("guessed");
    numberIsGuessed = true;
  });
});

/*
GPS
*/

const $startOrPause = document.getElementById("start-or-pause");
let started = false;
let watchId;
const $accuracy = document.getElementById("accuracy");
const positions = [];

onClick($startOrPause, async () => {
  if (started) {
    $startOrPause.textContent = "Start";
    currentPosition = null;
    navigator.geolocation.clearWatch(watchId);
    $accuracy.textContent = "N/A";
    $accuracy.style.color = "#333";
    started = false;
    $container.classList.remove("started");
    addAction("Paused");
    return;
  }

  // On iOS you must request permission
  // You can only request permission after a user action
  if (typeof DeviceOrientationEvent?.requestPermission === "function") {
    await DeviceOrientationEvent.requestPermission();
  }

  $startOrPause.textContent = "Starting";
  addAction("Started");

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      currentPosition = position.coords;

      positions.push({
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        time: new Date(),
      });

      const acc = Math.round(currentPosition.accuracy);
      $accuracy.textContent = `${acc}m`;

      $startOrPause.textContent = "Pause";
      started = true;
      $container.classList.add("started");

      if (acc < 10) {
        $accuracy.style.color = "#c1e1c1";
      } else if (acc < 20) {
        $accuracy.style.color = "#ffb347";
      } else {
        $accuracy.style.color = "#ff6961";
      }

      // If we aren't able to get the orientation from the device, fall back to the heading
      if (!isOrientationExact) {
        const heading = currentPosition.heading;

        // Some geolocation methods don't support heading
        if (heading === null) {
          return;
        }

        // If we haven't moved, heading can be NAN
        if (isNaN(heading)) {
          return;
        }

        updateOrientation(heading, "GPS heading", false);
      }
    },
    (e) => {
      $startOrPause.textContent = "Start";

      if (e.code === e.PERMISSION_DENIED) {
        alert(`GPS permission denied: ${e.message}`);
        return;
      }

      if (e.code === e.POSITION_UNAVAILABLE) {
        alert(`GPS position unavailable: ${e.message}`);
        return;
      }

      if (e.code === e.TIMEOUT) {
        alert(`GPS position timeout: ${e.message}`);
        return;
      }
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
    }
  );
});

/*
DONE
*/

const surveyStart = new Date();

const downloadBlob = (name, blob) => {
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", name);
  link.style.display = "none";
  document.body.append(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const getFormattedDate = () =>
  new Date().toISOString().slice(0, 19).replace("T", "-").replace(/:/g, "");

onClick(document.getElementById("done"), async () => {
  if (addresses.length > 0) {
    const contents = getOsmFile(
      document.implementation,
      (xml) => new XMLSerializer().serializeToString(xml),
      addresses,
      notes,
      surveyStart,
    );

    downloadBlob(
      `${getFormattedDate()}.osm`,
      new Blob([contents], { type: "application/vnd.osm+xml" })
    );
  }

  saveAddresses([]);

  window.location.reload();
});

/*
CLEAR
*/

onClick(document.getElementById("clear"), () => {
  $currentNumberOrName.value = "";
});

/*
ORIENTATION
*/

const $orientation = document.getElementById("orientation");
let isOrientationExact = false;

const invertBearing = (bearing) => Math.abs(bearing - 360);

const updateOrientation = (orientation, provider, isExact) => {
  currentOrientation = Math.round(orientation);
  $orientation.textContent = `${currentOrientation}°`;
  $orientationProvider.textContent = provider;
  isOrientationExact = isExact;
};

window.addEventListener("deviceorientationabsolute", (e) => {
  updateOrientation(
    invertBearing(e.alpha),
    "Absolute device orientation",
    true
  );
});

const maybeAbsoluteDeviceOrientationHandler = (e) => {
  if (e.webkitCompassHeading) {
    updateOrientation(e.webkitCompassHeading, "Webkit compass heading", true);
    return;
  }

  if (e.absolute) {
    updateOrientation(invertBearing(e.alpha), "Device orientation", true);
    return;
  }

  window.removeEventListener(
    "deviceorientation",
    maybeAbsoluteDeviceOrientationHandler
  );
};

window.addEventListener(
  "deviceorientation",
  maybeAbsoluteDeviceOrientationHandler
);

/*
UNDO
*/

onClick(document.getElementById("undo"), () => {
  const address = addresses.pop();
  if (address !== undefined) {
    saveAddresses(addresses);
    addAction(`- ${address.direction} ${address.numberOrName}`);
  }
});

/*
NOTE
*/

const notes = [];
const $addNote = document.getElementById("add-note");
const $noteWriter = document.getElementById("note-writer");
const $noteContent = document.getElementById("note-content");
const $saveNote = document.getElementById("save-note");
const $closeNoteWriter = document.getElementById("close-note-writer");

onClick($addNote, () => {
  if (currentPosition === null) {
    alert("No GPS");
    return;
  }

  $noteWriter.style.display = "flex";
});

onClick($saveNote, () => {
  notes.push({
    latitude: currentPosition.latitude,
    longitude: currentPosition.longitude,
    content: $noteContent.value,
  });
  $noteContent.value = "";
  $noteWriter.style.display = "none";

  addAction("+ note");
});

onClick($closeNoteWriter, () => {
  $noteContent.value = "";
  $noteWriter.style.display = "none";
});
