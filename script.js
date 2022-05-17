const $lastAction = document.getElementById("last-action");

/*
SETTINGS
*/

const $settings = document.getElementById("settings");

document.getElementById("info-row").addEventListener("click", () => {
  $settings.style.display = "block";
});

document.getElementById("close-settings").addEventListener("click", () => {
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

  removeButton.addEventListener("click", () => {
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

  container.appendChild(removeButton);
  container.appendChild(keyInput);
  container.appendChild(valueInput);

  $customTagContainer.appendChild(container);
};

Object.entries(customTags).forEach(([key, value]) => addCustomTag(key, value));

$addCustomTag.addEventListener("click", () => addCustomTag("", ""));

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

const $currentNumberOrName = document.getElementById("current-number-or-name");
const addresses = [];
let currentPosition = null;
let currentOrientation = null;

[...document.getElementsByClassName("append")].forEach((append) => {
  append.addEventListener("click", () => {
    $currentNumberOrName.value = $currentNumberOrName.value.concat(
      append.dataset.number
    );
  });
});

[...document.getElementsByClassName("submit")].forEach((submit) => {
  submit.addEventListener("click", () => {
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
    });

    $lastAction.textContent = `Added ${direction} ${numberOrName}`;

    $currentNumberOrName.value = "";
  });
});

/*
GPS
*/

const $startOrPause = document.getElementById("start-or-pause");
let started = false;
let watchId;
const $accuracy = document.getElementById("accuracy");

$startOrPause.addEventListener("click", async () => {
  if (started) {
    $startOrPause.textContent = "Start";
    navigator.geolocation.clearWatch(watchId);
    $accuracy.textContent = "N/A";
    $accuracy.style.color = "#333";
    started = false;
    return;
  }

  // On iOS Safari you must request permission
  // You can only request permission after a user action
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    await DeviceOrientationEvent.requestPermission();
  }

  $startOrPause.textContent = "Starting";

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      currentPosition = position.coords;
      const acc = Math.round(currentPosition.accuracy);
      $accuracy.textContent = `${acc}m`;

      $startOrPause.textContent = "Pause";
      started = true;

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

const downloadFile = (name, contents, type) => {
  const file = new Blob([contents], { type });

  const link = document.createElement("a");
  const url = URL.createObjectURL(file);
  link.setAttribute("href", url);
  link.setAttribute("download", name);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const getFormattedDate = () =>
  new Date().toISOString().slice(0, 19).replace("T", "-").replace(/:/g, "");

document.getElementById("done").addEventListener("click", () => {
  if (addresses.length === 0) {
    alert("No addresses recorded");
    return;
  }

  const xml = document.implementation.createDocument("", "", null);
  const osm = xml.createElement("osm");
  osm.setAttribute("version", "0.6");
  osm.setAttribute("generator", "AddressCollector testing");

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

    node.appendChild(tag);

    Object.entries(address.customTags).forEach(([key, value]) => {
      if (value === "") {
        return;
      }

      const customTag = xml.createElement("tag");
      customTag.setAttribute("k", key);
      customTag.setAttribute("v", value);

      node.appendChild(customTag);
    });

    osm.appendChild(node);
  });

  xml.appendChild(osm);

  const xmlString = new XMLSerializer().serializeToString(xml);

  downloadFile(
    `${getFormattedDate()}.osm`,
    xmlString,
    "application/vnd.osm+xml"
  );
});

/*
CLEAR
*/

document.getElementById("clear").addEventListener("click", () => {
  $currentNumberOrName.value = "";
});

/*
ORIENTATION
*/

const $orientation = document.getElementById("orientation");
const $orientationIcon = document.getElementById("orientation-icon");
let isOrientationExact = false;

const invertBearing = (bearing) => Math.abs(bearing - 360);

const updateOrientation = (orientation, provider, isExact) => {
  currentOrientation = Math.round(orientation);
  $orientation.textContent = `${currentOrientation}°`;
  $orientationIcon.style.transform = `rotate(${invertBearing(
    currentOrientation
  )}deg)`;
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

document.getElementById("undo").addEventListener("click", () => {
  const address = addresses.pop();
  if (address !== undefined) {
    $lastAction.textContent = `Undid ${address.direction} ${address.numberOrName}`;
  }
});
