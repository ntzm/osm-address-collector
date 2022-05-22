import "./App.css";
import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import Keypad from "./Keypad";
import Menu from "./Menu";
import Notes from "./Notes";
import { EventRecord, Position, Event, CustomTag } from "./types";
import { HashRouter, Route, Routes } from "react-router-dom";
import CustomTags from "./CustomTags";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { EventType } from "./enums";
import SettingsPage from "./features/settings/SettingsPage";
import { useSelector } from "react-redux";
import { selectDarkMode } from "./features/settings/slice";

function useStickyState<T>(
  defaultValue: T,
  key: string
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function App() {
  const [customTags, setCustomTags] = useStickyState<CustomTag[]>(
    [],
    "customTags"
  );

  function addCustomTag(tag: CustomTag) {
    setCustomTags(customTags.concat(tag));
  }

  function changeCustomTagKey(key: string, id: number) {
    const newTags = [...customTags];
    newTags[id].key = key;
    setCustomTags(newTags);
  }

  function changeCustomTagValue(value: string, id: number) {
    const newTags = [...customTags];
    newTags[id].value = value;
    setCustomTags(newTags);
  }

  function deleteCustomTag(id: number) {
    setCustomTags(customTags.filter((_, i) => i !== id));
  }

  const darkMode = useSelector(selectDarkMode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Routes>
          <Route
            path="/"
            element={<Main customTagCount={customTags.length} />}
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/custom-tags"
            element={
              <CustomTags
                tags={customTags}
                onAdd={addCustomTag}
                onChangeKey={changeCustomTagKey}
                onChangeValue={changeCustomTagValue}
                onDelete={deleteCustomTag}
              />
            }
          />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

interface MainProps {
  customTagCount: number;
}

function Main(props: MainProps) {
  const actions: EventRecord[] = [];

  const [latestPosition, setLatestPosition] = useState<Position>({
    latitutde: 0,
    longitude: 0,
  });

  function handleEvent(action: Event) {
    if (action.type === EventType.NewPosition) {
      setLatestPosition(action.position);
    }

    const record: EventRecord = {
      time: new Date(),
      position: latestPosition,
      event: action,
    };

    console.log(record);

    actions.push(record);
  }

  return (
    <Container maxWidth="sm">
      <Menu customTagCount={props.customTagCount} />

      <Box mt={10}>
        <Keypad onEvent={handleEvent} />
        <Notes onEvent={handleEvent} />
      </Box>
    </Container>
  );
}

export default App;
