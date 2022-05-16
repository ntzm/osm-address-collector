# OSM Address Collector

## Workflow

1. Press **Start**
1. Navigate to a building that needs a number or name
1. Enter the number using the keypad or the name device's keyboard
1. Press the direction key to indicate where the building is location in comparison to the device's orientation
1. Repeat from step 2 until you have finished your survey
1. Press **Done** to download the generated `.osm` file
1. Share this file however you like, such as uploading to cloud storage
1. On your computer, download the `.osm` file and open it in JOSM or any other editor that supports `.osm` files
   (In JOSM, if you open the `.osm` file then download data, it will merge the layers)
1. Depending on preferences you can do any of the following:
   - Merge the generated address nodes with the building areas
     (in JOSM you can merge by selecting the address node and the building and pressing <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>G</kbd>)
   - Leave the address nodes separate to the building areas
     (useful if there multiple addresses per building or if the building areas don't exist)

You can use **Pause** at any time to pause the GPS recording.

## Device Compatibility

|         | Android | iOS        |
| ------- | ------- | ---------- |
| Chrome  | Yes     | No         |
| Safari  | N/A     | No         |
| Firefox | No      | Not tested |
