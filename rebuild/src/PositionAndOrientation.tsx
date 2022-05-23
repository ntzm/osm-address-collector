import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { addPosition } from "./features/positions/slice";

function PositionAndOrientation() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        dispatch(
          addPosition({
            latitutde: pos.coords.latitude,
            longitude: pos.coords.longitude,
          })
        );
      },
      (e) => {
        console.error(e);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  });

  return null;
}

export default PositionAndOrientation;
