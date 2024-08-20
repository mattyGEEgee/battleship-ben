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
    #fxBypassToggleCheckbox

    constructor() {
        this.#fxChain = []
        this.#DCMeterIn = new Tone.DCMeter
        this.#DCMeterOut = new Tone.DCMeter
        this.#DCMeterIn.connect(this.#DCMeterOut)
        this.#DCMeterOut.toDestination()
        this.#fxBypassToggleCheckbox = document.querySelector('input#fx-bypass-toggle')
    }

    get fxBypassToggleCheckbox() {
        return this.#fxBypassToggleCheckbox
    }

    connectToFXChain(mic) {
        mic.connect(this.#DCMeterIn)
    }

    // --- NEXT
    populateFXSelect() {
        for (let i in Tone) {
            console.log(i);
        }
    }
    populateFXParameters(effect) {
        const listOfParameters = effect.get() // empty .get() gives you all parameters
        for (let parameter in listOfParameters) {
            const label = document.createElement('label')
            label.textContent = parameter
            const input = document.createElement('input')
            input.type = 'number'
            input.id = parameter
            label.appendChild(input)
            document.body.appendChild(label)
        }
    }
    // --- </NEXT

    BypassFX() {
        this.#DCMeterIn.connect(this.#DCMeterOut)
    }

    // FXs
    addToChain(newEffect) {
        // is it possible to list out all of them and their parameters so that 
        // I can fuck with them in a fucky interface just to get a feel (or to 
        // leave it that janky and then polish up the jank a little??!!??!!)

        // disconnect last from DCMeterOut
        if (this.#fxChain.length > 0) {
            console.log('fxChain is greater than 0');
            this.#fxChain[this.#fxChain.length - 1].disconnect()
        }
        // add effect to chain
        this.#fxChain.push(newEffect)
        // connect penultimate to last
        if (this.#fxChain.length > 0) {
            console.log('fxChain is greater than 0');
            this.#fxChain[this.#fxChain.length - 2].connect(this.#fxChain[this.#fxChain.length - 1])
        }
        // connect last to DCMeterOut
        this.#fxChain[this.#fxChain.length - 1].connect(this.#DCMeterOut)

            // tone.thing.chain(fxchain[0], fxchain[1], fxchain[2], this.#DCMeterOut) // can it take an array??
        

    }
    removeFromChain() {

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

export class NewEffect {
    constructor() {

    }
    // FrequencyShifter
}