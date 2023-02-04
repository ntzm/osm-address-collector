# [OSM Address Collector](https://ntzm.github.io/osm-address-collector/)

An easy way to survey addresses for [OSM](https://www.openstreetmap.org/), inspired by [Keypad Mapper](https://wiki.openstreetmap.org/wiki/Keypad-Mapper_3)

![](https://user-images.githubusercontent.com/3888578/204909727-d6ba792c-4756-419c-964c-36aa0afc32ec.png)

## Features

- Easily record building numbers or names as you're walking or cycling
- Supports text notes
- Works offline
- Customisable tags for address nodes

## Device Compatibility

| Device + Browser      | Compatible? | GPS        | Orientation          | File download | Notes                                               |
|-----------------------|-------------|------------|----------------------|---------------|-----------------------------------------------------|
| **Chrome Android**    | Yes         | Yes        | Yes - Absolute       | Yes           |                                                     |
| **Safari iOS**        | Yes         | Yes        | Yes - Webkit Heading | Yes           | [iOS compatibility notes](#ios-compatibility-notes) |
| **Chrome iOS**        | Yes         | Yes        | Yes - Webkit Heading | Yes           | [iOS compatibility notes](#ios-compatibility-notes) |
| Google Search App iOS | No          | Yes        | Yes - Webkit Heading | No            | File download not supported                         |
| Everything else       | Not tested  | Not tested | Not tested           | Not tested    |                                                     |

## Workflow

(video coming soon)

1. Press **Start**
1. Navigate to a building that needs a number or name
1. Enter the number using the keypad or the name device's keyboard
1. Press the direction key to indicate where the building is location in comparison to the device's orientation
1. Repeat from step 2 until you have finished your survey
1. Press **Done** to download the generated `.osm` file
1. Share this file however you like, such as uploading to cloud storage
1. On your computer, download the `.osm` file
1. Open its contents in JOSM or any other editor that supports `.osm`
   (In JOSM, if you open the `.osm` file then download data, it will merge the layers)
1. Depending on preferences you can do any of the following:
   - Merge the generated address nodes with the building areas
     (in JOSM you can merge by selecting the address node and the building and pressing <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>G</kbd>)
   - Leave the address nodes separate to the building areas
     (useful if there multiple addresses per building or if the building areas don't exist)

You can use **Pause** at any time to pause the GPS recording.

Satellite icon shows your location accuracy in metres.

History icon shows your last two action.

Press the note icon to add a text note.

## Settings

Click the top row with the icons on to open the settings.

Settings are saved in browser local storage so they will be the same when you come back to the site.

Distance - how far to move the address node from your current location (default 10m)
(e.g. if you press 4 then left arrow, the address node will be 10m to your left)

Street - what to fill `addr:street` with.
You can press the "Update streets" button to get the nearest streets to you.

Custom tags can be added, modified and removed.
These apply as you are surveying so you can change them halfway through and it will only apply to addresses you add after you change them.

In some countries certain numbers aren't normally given to houses, such as number 13 in the UK.
You can add numbers to skip when guessing the next number.

You can see the orientation provider as well, this describes the way we get your current orientation:

- None: no orientation available - you will not be able to record addresses with an orientation
- GPS heading: the direction you are travelling in between GPS position updates - this isn't super accurate so is a fallback
- Webkit compass heading: the direction your iOS device is pointing
- Device orientation: the direction your device is pointing

You can also see your current orientation according to the orientation provider.

### iOS Compatibility Notes

- Ensure that precise location services are enabled for the browser
- When the site asks for orientation and motion permissions, ALLOW! Otherwise you will have to clear your Safari cache

### Absolute orientation is not supported sometimes

Some browsers (Firefox) don't have a way of accessing absolution orientation of the device so GPS heading will be used instead.
This isn't ideal as it's much less accurate.
Please consider using a different browser for this application.
