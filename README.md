#### What it do

The main purpose on this module is on unlocking emotes that would else not be usable in same manner or not at all, and grant any thinkeablea feature possible to add(soon:tm:).

#### Commands

* ***`emo`*** *`emote id`* + *`type(optional)`* will dispatch ***any*** normally usable emote to the server, ids can be found on `Emotes.txt`. **type** can either be ***c*** or ***s*** for indicating clientsided and serversided respectively.
######
* ***`emosmg`*** *`emote id` + `"message"` + `delay(optional)`* will do the same as *`emo`* but also send a **message** with a **delay** of your choice, message should be expressed as showed, such as ***"example 1"*** or ***\`example 2\`*** due to shitty coding. The message will be sent through the channel in which the command was accessed from so use it accordingly.

***Note:*** *`delay` will default to the last used value if empty.*
######

* ***`emosets`*** *`[Arguments]`* *If no arguments are found it will display the current settings.*
  - *`clientsided` + `[On/Off]`* will turn on and off the clientsided mode. *This also disables incoming iddle emotes from the server!.*
  - *`nomessage` + `[On/Off]`* will turn on and off the no emote message mode. *Do remember that this a serversided setting.*
  - *`emulation` + `[On/Off/Number]`* Bools emote prediction, emulating the given delay if a number.

Settings will be automatically saved when exitting the game.

#### To do:

- [] Idk.

#### Credits

* **Saegusa:** for inspiring me to do this section and reference credits section.
* **Caali:** for the autoupdater and two random defs.
* **SaltyMonkey:** for random help.