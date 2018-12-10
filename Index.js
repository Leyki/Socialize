const Command = require('command'), // By Zelekie > //w//>
    fs = require('fs')

module.exports = function Socialize(dispatch) {

    const command = Command(dispatch),
        CONFIG_PATH = __dirname + '\\config.json',
        debug = false // to do, delet
    //groundLoc = { x: null, y: null, z: null, w: null },
    //avEmotes = [49, 50, 51, 52] // need to dispatch emotes based on race

    let gameId,
        emoMessaging = false,
        mounted = false,
        currentEmote = null,
        //setEmoteForItem = 14, // to config
        itemEmote = null,
        canEmote = true, // Avoids a small client bug and meaningless spam to the server
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
            //assistCostumeSwitchingGlitch // To do, command + getcostume, etc.
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
            setTimeout(() => { console.log('[Socialize] Created and loaded new configuration file.!'); console.log(config) }, 10050)
            if (debug) console.log('[Socialize] Version Mismatch, creating and loading new one...')
        }
        else {
            loadConfigurationFile()
            if (debug) console.log('[Socialize] Else, loading...')
        }
    }

    function createConfigurationFile() { // thx thx salty
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, '\t'))
        if (debug) setTimeout(() => { console.log('[Socialize] Sucessfully created configuration file!'); console.log(config) }, 10000)
    }

    function loadConfigurationFile() {
        try {
            config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
            if (debug) setTimeout(() => { console.log('[Socialize] Sucessfully loaded configuration file!'); console.log(config) }, 10000)
        }
        catch (err) {
            throw Error(`[Socialize] ${err}`)
        }
    }

    // do things code
    dispatch.hook('S_LOGIN', 10, event => {
        gameId = event.gameId
        /*dispatch.toClient('S_AVAILABLE_SOCIAL_LIST', 1, {
            emotes: [{ id: avEmotes }]
        })*/
    })

    dispatch.hook('C_PLAYER_LOCATION', 5, event => { if (config.emoteEmulation) canEmote = (event.type == 7) })
    /*dispatch.hook('S_AVAILABLE_SOCIAL_LIST', 1, event => {
        if (log) {
            console.log('S_AVAILABLE_SOCIAL_LIST')
            console.log(event.emotes)
        }
    })*/

    dispatch.hook('S_SOCIAL', 1, { order: 10 }, event => {
        if (config.emoteEmulation && !emoMessaging && isMe(event.target)) return false
        if (emoMessaging) emoMessaging = false
    })

    dispatch.hook('C_SOCIAL', 1, { order: 10 }, event => {
        if (canEmote == false) return false
        if (config.emoteEmulation) {
            emoteToUse = event.emote, cAnime()
            if (debug) command.message('Emote:' + emoteToUse)
            return false
        }
        //if (mountProtection && mounted) can([31, 32, 33, 34, 35, 36])
    })

    dispatch.hook('C_CHAT', 1, { filter: { silenced: true } }, event => {
        if (event.message.includes(emoMessage)) {
            cAnime()
            setTimeout(toServerMessage(event.channel), config.messageDelay)
        }
    })

    dispatch.hook('C_WHISPER', 1, { filter: { silenced: true } }, event => {
        if (event.message.includes(emoMessage)) {
            cAnime()
            setTimeout(toServerWhisper(event.target), config.messageDelay)
        }
    })

    // do functional things code
    function cAnime() {
        if (canEmote) {
            dispatch.toServer('C_SOCIAL', 1, {
                emote: emoteToUse,
                unk: 0
            })
            if (!emoMessaging) {
                if (config.emoteEmulation && config.emulatePing == 0) sAnime()
                else if (config.emulatePing != 0) setTimeout(sAnime, config.emulatePing)
            }
        }
    }

    function sAnime() {
        dispatch.toClient('S_SOCIAL', 1, {
            target: gameId,
            animation: emoteToUse,
            unk1: 0,
            unk2: 0
        })
    }

    function toServerMessage(Ch) {
        dispatch.toServer('C_CHAT', 1, {
            channel: Ch,
            message: emoMessage

        })
    }

    function toServerWhisper(Target) {
        dispatch.toServer('C_WHISPER', 1, {
            target: Target,
            message: emoMessage
        })
    }

    function isMe(GameId) { return gameId.equals(GameId) }

    // Commands things code
    command.add('emoconfig', (Case1, Case2) => {
        Case1 = Case1.toLowerCase()
        switch (Case1) {
            case 'info':
                console.log('[Socialize] Current Configuration file'); console.log(config)
                command.message('[Socialize] Printed Current Configuration file to console!')
                break
            case 'ping':
                if (Case2 == undefined) break
                config.emulatePing = Case2
                command.message('[Socialize] Ping set to ' + Case2 + '.')
                break
            case 'clientside':
                config.clientSidedMode = !config.clientSidedMode
                command.message('[Socialize] Clientsided mode ' + ((config.clientSidedMode) ? 'enabled.' : 'disabled.'))
                break
            case 'emulate':
                config.emoteEmulation = !config.emoteEmulation
                command.message('[Socialize] Emote emulation ' + ((config.emoteEmulation) ? 'enabled.' : 'disabled.'))
                break
            case 'save':
                createConfigurationFile()
                command.message('[Socialize] Configuration file saved!')
                break
            case 'load':
                loadConfigurationFile()
                command.message('[Socialize] Configuration file loaded!')
                break
            case undefined:
            default: command.message('[Socialize] Invalid command input.')
        }
    })

    command.add('emo', (emote, type) => {
        emoteToUse = emote
        if (type != undefined) {
            if (type == 'c') return sAnime()
            if (type == 's') return cAnime()
            else if (type != 'c' && type != 's') command.message('[Socialize] Invalid argument!')
        }
        else (config.clientSidedMode) ? sAnime() : cAnime()
    })

    command.add('emomsg', (emote, message, delay) => {
        if (delay != undefined) config.messageDelay = delay
        emoteToUse = emote
        emoMessage = message
        emoMessaging = true
    })

    // blend emote x y
    /*command.add('!setitem', () => {
     
    })
     
    command.add('!spam', () => {
     
    })*/

    /*command.add('ebin', (emote) => {
        dispatch.toClient('S_AVAILABLE_SOCIAL_LIST', 1, {
            emotes: [{ id: emote }]
        })
    })*/

    // Boring
    dispatch.hook('S_MOUNT_VEHICLE', 2, event => { if (isMe(event.gameId)) mounted = true })
    dispatch.hook('S_UNMOUNT_VEHICLE', 2, event => { if (isMe(event.gameId)) mounted = false })
} // Thx to Saltymemes and Caali for letting me read their code and even steal some bits (?), also :b:inkie
// /! craftw, fund, etc.