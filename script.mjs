import guessNextNumber from "./guessNextNumber.mjs";

const VERSION = "alpha";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

const onClick = ($el, cb) => {
  $el.addEventListener("touchstart", (e) => {
    e.preventDefault();
    cb(e);
  });
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
SETTINGS - Info
*/

const $orientationProvider = document.getElementById("orientation-provider");

/*
SETTINGS - Distance
*/

const $distance = document.getElementById("distance");
let distance = Number(localStorage.getItem("distance") ?? 10);
$distance.value = distance;

$distance.addEventListener("blur", () => {
  distance = Number($distance.value);
  localStorage.setItem("distance", distance);
});

/*
SETTINGS - Custom tags
*/

let customTags = JSON.parse(localStorage.getItem("customTags") ?? "{}");
const $customTagContainer = document.getElementById("custom-tags");

const $addCustomTag = document.getElementById("add-custom-tag");

const updateCustomTags = () => {
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
  container.classList.add("custom-tag");

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
  keyInput.autocapitalize = "no";
  keyInput.classList.add("key-input");

  const valueInput = document.createElement("input");
  valueInput.type = "text";
  valueInput.value = value;
  valueInput.placeholder = "Value";
  valueInput.classList.add("value-input");

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
  container.classList.add("skip-number");

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
  input.classList.add("number-input");

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
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
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

const getOsmFile = () => {
  const xml = document.implementation.createDocument("", "", null);
  const osm = xml.createElement("osm");
  osm.setAttribute("version", "0.6");
  osm.setAttribute("generator", `OSM Address Collector ${VERSION}`);

  addresses.forEach((address, i) => {
    const node = xml.createElement("node");
    node.setAttribute("id", -surveyStart.getTime() - i);
    node.setAttribute("version", 1);
    node.setAttribute("lat", address.latitude);
    node.setAttribute("lon", address.longitude);

    const tag = xml.createElement("tag");

    let numberOrName = address.numberOrName;

    if (isNaN(numberOrName)) {
      tag.setAttribute("k", "addr:housename");
    } else {
      numberOrName = Number(numberOrName);
      tag.setAttribute("k", "addr:housenumber");
    }

    tag.setAttribute("v", numberOrName);

    node.append(tag);

    Object.entries(address.customTags).forEach(([key, value]) => {
      if (value === "") {
        return;
      }

      const customTag = xml.createElement("tag");
      customTag.setAttribute("k", key);
      customTag.setAttribute("v", value);

      node.append(customTag);
    });

    osm.append(node);
  });

  notes.forEach((note, i) => {
    const node = xml.createElement("node");
    node.setAttribute("id", -surveyStart.getTime() - addresses.length - i);
    node.setAttribute("version", 1);
    node.setAttribute("lat", note.latitude);
    node.setAttribute("lon", note.longitude);

    const tag = xml.createElement("tag");
    tag.setAttribute("k", "note");
    tag.setAttribute("v", note.content);

    node.append(tag);
    osm.append(node);
  });

  xml.append(osm);

  return new XMLSerializer().serializeToString(xml);
};

onClick(document.getElementById("done"), async () => {
  downloadBlob(
    `${getFormattedDate()}.osm`,
    new Blob([getOsmFile()], { type: "application/vnd.osm+xml" })
  );
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