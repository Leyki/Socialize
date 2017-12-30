#### Autoupdater

The module is compatible with Caali's proxy so enjoy autoupdates as well as it being built to send notices on updates and the ability to check last commit version in game.

Each time you get a new update the last commit will be displayed in the console when loading the module, if you miss it though or just casually want to check in game, you can access the command *`emocommit`*.

#### Commands

* ***`emo`*** *`emote id`* + *`type(optional)`* will dispatch ***any*** normally usable emote to the server, ids can be found on `Emotes.txt`. **type** can either be ***c*** or ***s*** for indicating clientsided and serversided respectively.
######
* ***`emosmg`*** *`emote id` + `"message"` + `delay(optional)`* will do the same as *`emo`* but also send a **message** with a **delay** of your choice, message should be expressed as showed, such as ***"example 1"*** or ***\`example 2\`*** due to shitty coding. The message will be sent through the channel in which the command was accesed so use it accordingly.

***Note:*** *`delay` will default to the last used value if empty.*
######

* ***`emoconfig`*** *`[Arguments]`*
  - *`info`* will print the current configuration file to the console.
  - *`clientside`* will turn on and off the clientsided mode.
  - *`ping` + `value`* will change the ping emulation to the desired value with 0 disabling it.
  - *`emulate`* will turn on and off the emote emulation.
  - *`save`* will save the current configuration file for future usage.
  - *`load`* will load edits directly from the .json file, if you prefer to edit configs that way.

***Note:*** *the config will be generated once the script loads and it will be overwritten if needed when updating the script for simplicity.*

~~The code is messy and the readme ugly but i just wanted to release it for now since i delayed it for so long already.~~