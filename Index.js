const fs = require('fs') // By Zelekie

module.exports = function Socialize(mod) {

	const user = {
		canEmote: true, // Avoids a small client bug and meaningless spam to the server
		currentEmote: 0,
		isEmoting: false,
		emotePromise: 0,
		emoteMessagePromise: null,
		emoteMessageDelay: 0
		// isMounted / mod.game.me.mounted
	}

	mod.hook('C_PLAYER_LOCATION', 5, event => { user.canEmote = (event.type === 7) })

	mod.hook('S_SOCIAL', 1, { order: 10 }, event => {
		if (!mod.game.me.is(event.target)) return
		if (mod.settings.clientsided_mode || mod.settings.emote_emulation) return false
	})

	mod.hook('C_SOCIAL', 1, { order: 10 }, event => {
		cAnime(event.emote, event.unk)
		return false
	})

	// The idk how to else do it to check incoming channel in msgs thing
	mod.hook('C_CHAT', 1, { filter: { silenced: true } }, event => {
		if (event.message.includes(user.emoteMessagePromise)) {
			cAnime(user.emotePromise)
			setTimeout(() => { toServerMessage(event.channel) }, user.emoteMessageDelay);
		}
	})
	// same thing but in whispers
	mod.hook('C_WHISPER', 1, { filter: { silenced: true } }, event => {
		if (event.message.includes(user.emoteMessagePromise)) {
			cAnime(user.emotePromise)
			setTimeout(() => { toServerWhisper(event.target) }, user.emoteMessageDelay);
		}
	})

	// do functional things code
	function cAnime(SocialId, noPredefinedMessage) {
		if (!user.canEmote) return // but can we
		// ok we can
		if (mod.settings.clientsided_mode) return sAnime(SocialId) // i wanna be sneaky!
		mod.send('C_SOCIAL', 1, { emote: SocialId, unk: noPredefinedMessage || mod.settings.no_emote_message_mode })
		// but can we be speedy or slowy
		if (mod.settings.emote_emulation === true) return sAnime(SocialId)
		if (mod.settings.emote_emulation) // no check for other stuff or in command because we trust the user! c: for now...i hope
			setTimeout(() => { sAnime(SocialId) }, mod.settings.emote_emulation)
	}

	function sAnime(SocialId, forceAnimation) {
		mod.send('S_SOCIAL', 1, {
			target: mod.game.me.gameId,
			animation: SocialId,
			unk1: 0,
			unk2: forceAnimation || 0
		})
	}

	function toServerMessage(Ch) {
		mod.send('C_CHAT', 1, {
			channel: Ch,
			message: user.emoteMessagePromise
		})
		user.emoteMessagePromise = null
	}

	function toServerWhisper(Target) {
		mod.send('C_WHISPER', 1, {
			target: Target,
			message: user.emoteMessagePromise
		})
		user.emoteMessagePromise = null
	}

	mod.command.add('emosets', {
		emulation: {
			on() {
				mod.settings.emote_emulation = true
				mod.command.message('Emote emulation enabled.')
			},
			off() {
				mod.settings.emote_emulation = false
				mod.command.message('Emote emulation disabled.')
			},
			$default(PingValue) {
				const val = +PingValue
				if (!val) return mod.command.message('Innapropiate or missing ping value.')
				mod.command.message(`Emote emulation set to ${val}ms.`)
				mod.settings.emote_emulation = val
			},
			$none() { mod.command.message(`Something went wrong!, i don't know what but chances are that your misstyped something!`) }
		},
		clientsided: {
			on() {
				mod.settings.clientsided_mode = true
				mod.command.message('Only clientsided mode enabled.')
			},
			off() {
				mod.settings.clientsided_mode = false
				mod.command.message('Only clientsided mode disabled.')
			},
			$default() { mod.command.message(`Something went wrong!, i don't know what but chances are that your misstyped something!`) },
		},
		nomessage: {
			on() {
				mod.settings.no_emote_message_mode = true
				mod.command.message('Only no emote message mode enabled.')
			},
			off() {
				mod.settings.no_emote_message_mode = false
				mod.command.message('Only no emote message mode disabled.')
			},
			$default() { mod.command.message(`Something went wrong!, i don't know what but chances are that your misstyped something!`) },
		},
		$default() { mod.command.message(`Something went wrong!, i don't know what but chances are that your misstyped something!`) },
		$none() {
			mod.command.message('Current settings')
			mod.command.message(`Clientsided mode: ${mod.settings.clientsided_mode}.`)
			mod.command.message(`No emote message mode: ${mod.settings.no_emote_message_mode}.`)
			mod.command.message(`Emote emulation: ${mod.settings.emote_emulation}.`)
		}
	})

	mod.command.add('emo', {
		$default(id, type) {
			const socialId = +id
			if (socialId === NaN) return mod.command.message('Invalid emote id input. Use numbers.')

			if (!type) return mod.settings.clientsided_mode ? sAnime(socialId) : cAnime(socialId) // Lower are common npc ids, higher doesn't exist.

			if (type == 'c') return sAnime(socialId)
			if (type == 's') return cAnime(socialId)
			else mod.command.message(`Wrong arguments, try again!`)
		},
		$none() { mod.command.message(`Usage: emo 'emoteId' 'type'(optional)`) },
	})
	// kms
	mod.command.add('emomsg', (id, message, delay) => {
		user.emoteMessagePromise = message
		user.emotePromise = id
		if (delay) user.emoteMessageDelay = delay
	})
}