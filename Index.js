const fs = require('fs') // By Zelekie

module.exports = function Socialize(mod) {

	const CONFIG_PATH = __dirname + '\\config.json'

	const user = {
		canEmote: true, // Avoids a small client bug and meaningless spam to the server
		isEmoting: false,
		isEmoMessaging: false,
		// isMounted / mod.game.me.mounted
	}

	let currentEmote = null,
		itemEmote = null,
		emoteToUse = null,
		emoMessage,
		//spamming = false

		// Default config, edits go in config.json!
		config = {
			version: 1.1,                // Mismatches will overwrite the file for simplicity.
			clientSidedMode: false, // enables and disables clientsided mode
			//blindMode = { console: false, cmdMessages: false }, // Disables any ingame command message and/or console logs.
			emoteEmulation: false, // Simulates emotes, be ware that your client won't be synched with others.
			emulatePing: 0,     // If for whatever reason you want this, 0 will disable it. It's a bit interesting how ping affects sit/stand up, idk how it looks server side
			messageDelay: 300 // Same as above
			//randomizeIntervalTimers = true // This is to make spam more "human" like or something i guess.
			//assistCostumeSwitchingGlitch // To do, mod.command + getcostume, etc.
			//autoTeaBagOnDeadBodies      // Yes.
			//autoTeaBagAddedNames = ["Juanito", "Fippito", "Marcelito"]
			//mountProtection: true, // Disables emote usage when mounted(Aside from the ones that don't dismount).
			//addFundEmoteToChat = { enabled: true, msgTrigger: 'fund me plox', itemTrigger: 6560 }, // Minor Replenishment Potable
			//stopTheEmotion = { me: null, others: null, npcs: null }, //
		} // Anything commented is just ideas, doesn't mean i'd do them :>... or have the brain to do them > .<

	// manage config files
	if (!fs.existsSync(CONFIG_PATH)) {
		createConfigurationFile()
		loadConfigurationFile()
	}
	else {
		let userConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
		if (config.version != userConfig.version) {
			createConfigurationFile()
			loadConfigurationFile()
			setTimeout(() => { console.log('Created and loaded new configuration file.!'); console.log(config) }, 10050)
		}
		else loadConfigurationFile()
	}

	function createConfigurationFile() { // thx thx salty
		fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, '\t'))
	}

	function loadConfigurationFile() {
		try { config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')) }
		catch (err) { throw Error(`${err}`) }
	}

	mod.hook('C_PLAYER_LOCATION', 5, event => { if (config.emoteEmulation) user.canEmote = (event.type == 7) })

	mod.hook('S_SOCIAL', 1, { order: 10 }, event => {
		if (config.emoteEmulation && !user.isEmoMessaging && mod.game.me.is(event.target)) return false
		if (user.isEmoMessaging) user.isEmoMessaging = false
	})

	mod.hook('C_SOCIAL', 1, { order: 10 }, event => {
		if (user.canEmote == false) return false
		if (config.emoteEmulation) {
			emoteToUse = event.emote, cAnime()
			return false
		}
	})

	mod.hook('C_CHAT', 1, { filter: { silenced: true } }, event => {
		if (event.message.includes(emoMessage)) {
			cAnime()
			setTimeout(toServerMessage(event.channel), config.messageDelay)
		}
	})

	mod.hook('C_WHISPER', 1, { filter: { silenced: true } }, event => {
		if (event.message.includes(emoMessage)) {
			cAnime()
			setTimeout(toServerWhisper(event.target), config.messageDelay)
		}
	})

	// do functional things code
	function cAnime() {
		if (user.canEmote) {
			mod.send('C_SOCIAL', 1, {
				emote: emoteToUse,
				unk: 0
			})
			if (!user.isEmoMessaging) {
				if (config.emoteEmulation && config.emulatePing == 0) sAnime()
				else if (config.emulatePing != 0) setTimeout(sAnime, config.emulatePing)
			}
		}
	}

	function sAnime() {
		mod.send('S_SOCIAL', 1, {
			target: mod.game.me.gameId,
			animation: emoteToUse,
			unk1: 0,
			unk2: 0
		})
	}

	function toServerMessage(Ch) {
		mod.send('C_CHAT', 1, {
			channel: Ch,
			message: emoMessage

		})
	}

	function toServerWhisper(Target) {
		mod.send('C_WHISPER', 1, {
			target: Target,
			message: emoMessage
		})
	}

	// Commands things code
	mod.command.add('emoconfig', (Case1, Case2) =>{
		Case1 = Case1.toLowerCase()
		switch (Case1) {
			case 'info':
				console.log('Current Configuration file'); console.log(config)
				mod.command.message('Printed Current Configuration file to console!')
				break
			case 'ping':
				if (Case2 == undefined) break
				config.emulatePing = Case2
				mod.command.message('Ping set to ' + Case2 + '.')
				break
			case 'clientside':
				config.clientSidedMode = !config.clientSidedMode
				mod.command.message('Clientsided mode ' + ((config.clientSidedMode) ? 'enabled.' : 'disabled.'))
				break
			case 'emulate':
				config.emoteEmulation = !config.emoteEmulation
				mod.command.message('Emote emulation ' + ((config.emoteEmulation) ? 'enabled.' : 'disabled.'))
				break
			case 'save':
				createConfigurationFile()
				mod.command.message('Configuration file saved!')
				break
			case 'load':
				loadConfigurationFile()
				mod.command.message('Configuration file loaded!')
				break
			case undefined:
			default: mod.command.message('Invalid mod.command input.')
		}
	})

	mod.command.add('emo', (emote, type) => {
		emoteToUse = emote
		if (type != undefined) {
			if (type == 'c') return sAnime()
			if (type == 's') return cAnime()
			else if (type != 'c' && type != 's') mod.command.message('Invalid argument!')
		}
		else (config.clientSidedMode) ? sAnime() : cAnime()
	})

	mod.command.add('emomsg', (emote, message, delay) => {
		if (delay != undefined) config.messageDelay = delay
		emoteToUse = emote
		emoMessage = message
		user.isEmoMessaging = true
	})

	// blend emote x y
	/*mod.command.add('!setitem', () => {
	 
	})
	 
	mod.command.add('!spam', () => {
	 
	})*/

	/*mod.command.add('ebin', (emote) => {
			mod.send('S_AVAILABLE_SOCIAL_LIST', 1, {
					emotes: [{ id: emote }]
			})
	})*/
}