
### Commands

* `emo` `emote id` will dispatch *any* normally usable emote to the server, ids can be found on `emotes.txt`

* `emosmg` `emote id` `delay` `"message"` will do the same as `emo` but send also send a message and delay of your choice, delay must be 0 if empty and message should be expressed as showed, with "example 1" or \`\` due to shitty coding.


* `emoconfig`
             `info` will print the current configuration file to the console.
             `ping` + `value` will change the ping emulation to the desired value with 0 disabling it.
             `emulate` will turn on and off the emote emulation.
             `save` will save the current configuration file for future usage.
             `load` will load edits directly from the .json file, if you prefer to edit configs that way.

*Note: the config will be generated once the script loads and it will be overwritten if needed when updating the script for simplicity.*

The code is messy and the readme ugly but i just wanted to release it for now since i delayed it for so long already.