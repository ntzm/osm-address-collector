import { createContext } from "react";
import { ContextSettings } from "./types";

const SettingsContext = createContext<ContextSettings>({
  // these get overwritten anyway
  throwDistance: 10,
  vibrate: true,
  recordTrace: true,
  darkMode: false,
  setSettings: () => {},
});

export default SettingsContext;
