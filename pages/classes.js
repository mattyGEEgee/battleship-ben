import * as Tone from 'tone'

export class ConfigureAudioDevices {

    #selectInputDevices
    #selectOutputDevices
    #outputDevices
    #inputDevices
    #mic

    constructor() {
        this.#selectInputDevices = document.querySelector('select#input-devices')
        this.#selectOutputDevices = document.querySelector('select#output-devices')
        this.#outputDevices = {}
        this.#inputDevices = {}
        this.#mic
    }
    get selectInputDevices() {
        return this.#selectInputDevices
    }
    get selectOutputDevices() {
        return this.#selectOutputDevices
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
        Tone.getContext().dispose() // is this doing what I think it's doing??
        const audioContext = new AudioContext({
            latencyHint: "interactive",
            sinkId: this.#selectOutputDevices.value
        })
        Tone.setContext(audioContext)
        this.changeInputDevice(this.#selectInputDevices.value)
    }

    changeInputDevice() {
        if (this.#mic != undefined) {
            this.#mic.close()
        }
        this.#mic = new Tone.UserMedia();
        this.#mic.open(this.#selectInputDevices.value);
        this.#mic.toDestination()
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