
##### Commands

* ***`emo`*** *`emote id`* will dispatch *any* normally usable emote to the server, ids can be found on `Emotes.txt`
######
* ***`emosmg`*** *`emote id` + `delay` + `"message"`* will do the same as *`emo`* but also send a **message** with a **delay** of your choice, delay must be **0** if unwanted and message should be expressed as showed, such as ***"example 1"*** or ***\`example 2\`*** due to shitty coding. The message will be sent through the channel in which the command was accesed so use it accordingly. Whispers no work yet, btw.
######

* ***`emoconfig`*** *`[Arguments]`*
  - *`info`* will print the current configuration file to the console.
  - *`ping` + `value`* will change the ping emulation to the desired value with 0 disabling it.
  - *`emulate`* will turn on and off the emote emulation.
  - *`save`* will save the current configuration file for future usage.
  - *`load`* will load edits directly from the .json file, if you prefer to edit configs that way.

***Note:*** *the config will be generated once the script loads and it will be overwritten if needed when updating the script for simplicity.*

The code is messy and the readme ugly but i just wanted to release it for now since i delayed it for so long already.