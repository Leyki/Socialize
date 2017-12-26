const Command = require('command'), // By Zelekie > //w//>
    fs = require('fs')

module.exports = function Socialize(dispatch) {

    const command = Command(dispatch),
        CONFIG_PATH = __dirname + '\\config.json',
        debug = false // to do, delet
    //groundLoc = { x: null, y: null, z: null, w: null },
    //avEmotes = [49, 50, 51, 52] // need to dispatch emotes based on race

    let cid,
        emoMessaging = false,
        mounted = false,
        currentEmote = null,
        //setEmoteForItem = 14, // to config
        itemEmote = null,
        canEmote = true, // Avoids a small client bug and meaningless spam to the server
        emoteToUse = null,
        emoMessage,
        chlu = 0
    //spamming = false

    // Default config, edits go in config.json!
    let config = {
        version: 1,                // Mismatches will overwrite the file for simplicity.
        //clientsidedMode = false // This should in theory turn
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

    // Version check, config updater, creator, etc.
    if (!fs.existsSync(CONFIG_PATH)) {
        createConfigurationFile()
        loadConfigurationFile()
    }
    else if (fs.existsSync(CONFIG_PATH)) {
        let userConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); console.log(userConfig); console.log(config)
        if (config.version != userConfig.version) {
            createConfigurationFile()
            loadConfigurationFile()
            if (debug) console.log('[Socialize] Version Mismatch, creating and loading new one...')
        }
        else {
            loadConfigurationFile()
            if (debug) console.log('Socialize Elsing...')
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
    dispatch.hook('S_LOGIN', 9, event => {
        cid = event.gameId
        /*dispatch.toClient('S_AVAILABLE_SOCIAL_LIST', 1, {
            emotes: [{ id: avEmotes }]
        })*/
    })

    dispatch.hook('C_PLAYER_LOCATION', 2, event => {
        if (config.emoteEmulation) canEmote = (event.type == 7)
        //groundLoc.x = event.x
        //groundLoc.y = event.y
        //groundLoc.z = event.z
        //groundLoc.w = event.w
        //groundMovType = event.type
    })

    /*dispatch.hook('S_AVAILABLE_SOCIAL_LIST', 1, event => {
        if (log) {
            console.log('S_AVAILABLE_SOCIAL_LIST')
            console.log(event.emotes)
        }
    })*/

    dispatch.hook('S_SOCIAL', 1, { order: 10 }, event => {
        if (config.emoteEmulation && !emoMessaging && event.target.equals(cid)) return false
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
        chlu = event.channel
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
            target: cid,
            animation: emoteToUse,
            unk1: 0,
            unk2: 0
        })
    }

    function toServerMessage() {
        dispatch.toServer('C_CHAT', 1, {
            channel: chlu,
            message: emoMessage

        })
    }

    // Commands things code
    command.add('emoconfig', (wut, secondary) => {
        let wutStr = wut.toString()
        if (wutStr == 'info') {
            console.log('[Socialize] Current Configuration file'); console.log(config)
            command.message('[Socialize] Printed Configuration file to console!')
        }
        if (wutStr == 'ping') {
            config.emulatePing = secondary
            command.message('[Socialize] Ping set to ' + secondary + '.')
        }
        if (wutStr == 'emulate') {
            config.emoteEmulation = !config.emoteEmulation
            command.message('[Socialize] Emote emulation ' + ((config.emoteEmulation) ? 'enabled.' : 'disabled.'))
        }
        if (wutStr == 'save') {
            createConfigurationFile()
            command.message('[Socialize] Configuration file saved!')
        }
        if (wutStr == 'load') {
            loadConfigurationFile()
            command.message('[Socialize] Configuration file loaded!')
        }
        //command.message('[Socialize] Invalid command!')
    })

    command.add('emo', (emote, type) => {
        emoteToUse = emote
        cAnime()
    })

    command.add('emomsg', (emote, delay, message) => { // to do, add ch, regEX?!?!??!?!"3!2'3" or edit commands...or actually learn to use it :thonk:.... or eval.. or don't do anything and let ' ' handle it
        emoMessaging = true
        setTimeout(() => { emoMessaging = false }, 1400)
        emoMessage = message
        config.messageDelay = delay
        emoteToUse = emote
        cAnime()
        setTimeout(toServerMessage, config.messageDelay)
    })

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
    dispatch.hook('S_MOUNT_VEHICLE', 1, event => {
        if (event.target.equals(cid)) mounted = true
    })
    dispatch.hook('S_UNMOUNT_VEHICLE', 1, event => {
        if (event.target.equals(cid)) mounted = false
    })
} // Thx to Saltymemes and Caali for letting me read their code and even steal some bits (?), also :b:inkie
// /! craftw, fund, etc.