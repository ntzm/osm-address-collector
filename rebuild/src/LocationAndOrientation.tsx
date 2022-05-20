import { Button } from "@mui/material";
import { useEffect } from "react";
import { TimedPosition } from "./types";

interface PositionAndOrientationProps {
  onNewPosition: (position: TimedPosition) => void;
}

function PositionAndOrientation(props: PositionAndOrientationProps) {
  useEffect(() => {});

  function startRecordingPosition() {
    navigator.geolocation.watchPosition(
      (position) => {
        props.onNewPosition({
          latitutde: position.coords.latitude,
          longitude: position.coords.longitude,
          time: new Date(),
        });
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  }

  return <></>;
}

export default PositionAndOrientation;
