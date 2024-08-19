import * as Tone from 'tone'

export class ConfigureAudioDevices {

    #selectInputDevices
    #selectOutputDevices
    #outputDevices
    #inputDevices
    #webAudioContext
    #toneAudioContext
    #mic

    constructor() {
        this.#selectInputDevices = document.querySelector('select#input-devices')
        this.#selectOutputDevices = document.querySelector('select#output-devices')
        this.#outputDevices = {}
        this.#inputDevices = {}
        this.#toneAudioContext = Tone.getContext()
        this.#webAudioContext = new AudioContext({
            latencyHint: "interactive",
            lookAhead: 0.05 // ?? is less possible??
        })
        Tone.setContext(this.#webAudioContext)
        this.#toneAudioContext.lookAhead = 0.05
        this.#mic = new Tone.UserMedia()
    }
    get selectInputDevices() {
        return this.#selectInputDevices
    }
    get selectOutputDevices() {
        return this.#selectOutputDevices
    }
    get mic() {
        return this.#mic
    }
    addOutputDevice(newDevice) {
        this.#outputDevices.push({newDevice})
        inputDevices[devices[i].label] = devices[i].deviceId

    }
    async organiseDevices() {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        const devices = await navigator.mediaDevices.enumerateDevices()

        for (let i = 0; i < devices.length; i++) {
            if (devices[i].label.includes('Default')) {
                continue
            }
            if (devices[i].kind == "audioinput") {
                this.#inputDevices[devices[i].label] = devices[i].deviceId
            }
            if (devices[i].kind == "audiooutput") {
                this.#outputDevices[devices[i].label] = devices[i].deviceId
            }
        }

        this.#populateSelectAudioDevices(this.#inputDevices, this.#selectInputDevices)
        this.#populateSelectAudioDevices(this.#outputDevices, this.#selectOutputDevices)
    }

    #populateSelectAudioDevices(deviceArray, selectTag) {
        selectTag.size = Object.keys(deviceArray).length
        for (let i = 0; i < Object.keys(deviceArray).length; i++) {
            const option = document.createElement('option')
            option.textContent = Object.keys(deviceArray)[i]
            option.value = Object.values(deviceArray)[i]
            selectTag.appendChild(option)
        }
    }

    changeOutputDevice() {
        this.#webAudioContext.setSinkId(this.#selectOutputDevices.value)
        this.#toneAudioContext.lookAhead = 0.05 // ?? is less possible??
    }

    changeInputDevice() {
        this.#mic.close()
        this.#mic.open(this.#selectInputDevices.value)
        // this.#mic.connect(fxChainInput) // should already be connected
            // we're just changing the device, right??
    }
}

export class ConfigureAudioFX {

    #fxChain
    #DCMeterOut
    #DCMeterIn

    constructor() {
        this.#fxChain = []
        this.#DCMeterIn = new Tone.DCMeter
        this.#DCMeterOut = new Tone.DCMeter
        this.#DCMeterIn.connect(this.#DCMeterOut)
        this.#DCMeterOut.toDestination()
    }
    connectToFXChain(mic) {
        mic.connect(this.#DCMeterIn)
    }

    // FXs
    addEffectToChain() {
        // is it possible to list out all of them and their parameters so that 
        // I can fuck with them in a fucky interface just to get a feel (or to 
        // leave it that janky and then polish up the jank a little??!!??!!)
    }
    removeEffectFromChain() {

    }
}

export class ConfigureMIDIDevices {

    #connectedMIDIDevices
    #midi

    constructor() {
        this.#connectedMIDIDevices = document.querySelector('ul#connected-midi-devices')
        this.#midi
    }

    async organiseDevices() {
        this.#midi = await navigator.requestMIDIAccess()
        this.#populateConnectedMIDIDevices()

        // show dialog and update Connected MIDI Devices when device is connected/disconnected
        this.#midi.onstatechange = (event) => {
            this.#populateConnectedMIDIDevices()
            const dialog = document.createElement('dialog')
            const message = document.createElement('p')
            const closeMessage = document.createElement('p')
            message.textContent = `${event.port.manufacturer} ${event.port.name} was ${event.port.state}`
            closeMessage.textContent = `press esc to close this dialog`
            dialog.appendChild(message).appendChild(closeMessage)
            document.body.appendChild(dialog)
            dialog.showModal()
        }

        // MIDItoNotesBinding()
    }
    #populateConnectedMIDIDevices() {
        while (this.#connectedMIDIDevices.firstChild) {
            this.#connectedMIDIDevices.removeChild(this.#connectedMIDIDevices.lastChild);
        }
        this.#midi.inputs.forEach((midiInput) => {
            const li = document.createElement('li')
            li.textContent = `${midiInput.manufacturer} ${midiInput.name}`
            this.#connectedMIDIDevices.appendChild(li)
        })
    }

    // --- NEXT HERE

    MIDItoNotesBinding() {
        // make MIDI messages work
        midi.inputs.values().forEach((device) => {
            device.onmidimessage = (message) => console.log(`note: ${message.data[1]}\nvelocity: ${message.data[2]}`)
            // data = [.., note/message, velocity(0 = off)]
        });
    }

    // --- </NEXT
}