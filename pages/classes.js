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
            lookAhead: 0.0005 // ?? is less possible??
        })
        Tone.setContext(this.#webAudioContext)
        this.#toneAudioContext.lookAhead = 0.0005
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
        this.#toneAudioContext.lookAhead = 0.0005 // ?? is less possible??
    }

    changeInputDevice() {
        this.#mic.close()
        this.#mic.open(this.#selectInputDevices.value)
    }
}

export class ConfigureAudioFX {

    #fxChain
    #DCMeterOut
    #DCMeterIn
    #fxBypassToggleCheckbox
    #addNewFXButton

    constructor() {
        this.#fxChain = []
        this.#DCMeterIn = new Tone.DCMeter
        this.#DCMeterOut = new Tone.DCMeter
        this.#DCMeterIn.connect(this.#DCMeterOut)
        this.#DCMeterOut.toDestination()
        this.#fxBypassToggleCheckbox = document.querySelector('input#fx-bypass-toggle')
        this.#addNewFXButton = document.querySelector('input#add-new-effect')
        // set up the default/first fx
        this.#displayNewEffect()
        this.#addNewFXButton.addEventListener('click', (event) => {
            this.#displayNewEffect()
        })
    }

    get fxBypassToggleCheckbox() {
        return this.#fxBypassToggleCheckbox
    }

    connectToFXChain(mic) {
        mic.connect(this.#DCMeterIn)
    }

    // --- NEXT
    #displayNewEffect() {
        let fxNumber = document.querySelectorAll('.fx').length

        // fx div
        const newFXDiv = document.createElement('div')
        newFXDiv.id = `fx-${fxNumber}`
        newFXDiv.classList.add('fx')

        // select
        const fxSelector = document.createElement('select')
        fxSelector.id = `fx-${fxNumber}-selector`
        fxSelector.classList.add('fx-selector')
        // CHECK THAT THIS WORKS IDENTICALLY TO THE DEFAULT EFFECT-0
        fxSelector.addEventListener('input', (event) => {
            const newEffect = eval(`new Tone.${event.target.value}`)
            const fxNumber = event.target.id.substring(3, 4)
            this.displayNewParameters(fxNumber , newEffect)
            this.addToChain(fxNumber, newEffect)
        })
        for (let effect in Tone) {
            const option = document.createElement('option')
            option.value = effect
            option.textContent = effect
            fxSelector.appendChild(option)
        }
        newFXDiv.appendChild(fxSelector)

        // remove button
        const removeButton = document.createElement('input')
        removeButton.id = `remove-fx-${fxNumber}`
        removeButton.type = 'button'
        removeButton.value = 'remove'
        removeButton.addEventListener('click', (event) => {
            this.#removeFromChain(fxNumber)
            this.#removeEffect(fxNumber)
        })
        newFXDiv.appendChild(removeButton)

        // append to chain display
        document.querySelector('#fx-chain').appendChild(newFXDiv)
    }
    displayNewParameters(fxNumber, newEffect) {
        // fx parameters div
        const fxParameters = document.createElement('div')
        fxParameters.id = `fx-${fxNumber}-parameters`
        fxParameters.classList.add('fx-parameters')
        document.querySelector(`#fx-${fxNumber}`).appendChild(fxParameters)

        // parameters
        const parametersList = newEffect.get()
        for (let parameter in parametersList) {
            // label with parameter name
            const parameterLabel = document.createElement('label')
            parameterLabel.textContent = parameter

            // input
            const parameterInput = document.createElement('input')
            parameterInput.type = 'number'
            parameterInput.id = `fx-${fxNumber}-${parameter}`
            
            // append all
            parameterLabel.appendChild(parameterInput)
            fxParameters.appendChild(parameterLabel)
        }
    }

    // --- </NEXT

    ToggleFX(bool) {
        if (bool) {
            for (let i = 0; i < this.#fxChain.length; i++) {
                this.#fxChain[i].disconnect()
            }
            this.#DCMeterIn.connect(this.#DCMeterOut)
        } else {
            this.#ChainFXChainArray()
        }
    }
    #ChainFXChainArray() {
        let evalChain = ''
        for (let i = 0; i < this.#fxChain.length; i++) {
            this.#fxChain[i].disconnect()
            if (i == this.#fxChain.length - 1) {
                evalChain += `this.#fxChain[${i}]`
            } else {
                evalChain += `this.#fxChain[${i}],`
            }
        }
        eval(`this.#DCMeterIn.chain(${evalChain})`)
        // connect last to DCMeterOut
        this.#fxChain[this.#fxChain.length - 1].connect(this.#DCMeterOut)
    }

    // FXs
    addToChain(fxNumber, newEffect) {
        this.#fxChain.splice(fxNumber, 0, newEffect)
        // disconnect everything
        // reconnect/chain the whole array together
        this.#ChainFXChainArray()
        /* this is now in its own method (the one above)
        let evalChain = ''
        for (let i = 0; i < this.#fxChain.length; i++) {
            this.#fxChain[i].disconnect()
            if (i == this.#fxChain.length - 1) {
                evalChain += `this.#fxChain[${i}]`
            } else {
                evalChain += `this.#fxChain[${i}],`
            }
        }
        eval(`this.#DCMeterIn.chain(${evalChain})`)
        // connect last to DCMeterOut
        this.#fxChain[this.#fxChain.length - 1].connect(this.#DCMeterOut)
        */
    }
    #removeFromChain(fxNumber) {
        this.#fxChain[fxNumber].disconnect()
        this.#fxChain[fxNumber - 1].disconnect()
        this.#fxChain.splice(fxNumber, 1)
        // if last node, the last node must still stay connected to DCMeterOut
        if (this.#fxChain[fxNumber]) {
            this.#fxChain[fxNumber - 1].connect(this.#fxChain[fxNumber])
        } else {
            this.#fxChain[fxNumber - 1].connect(this.#DCMeterOut)
        }
    }
    #removeEffect(fxNumber) {
        const effectDisplay = document.querySelector(`#fx-${fxNumber}`)
        const fxChain = document.querySelector('#fx-chain')
        fxChain.removeChild(effectDisplay)
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