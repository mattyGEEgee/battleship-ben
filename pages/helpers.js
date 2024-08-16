export const selectInputDevices = document.querySelector('select#input-devices')
export const selectOutputDevices = document.querySelector('select#output-devices')
export const connectedMIDIDevices = document.querySelector('ul#connected-midi-devices')

export let outputDevices = {}
export let inputDevices = {}

export let mic
export let midi

export async function start() {
    midi = await navigator.requestMIDIAccess()
    await navigator.mediaDevices.getUserMedia({ audio: true })
    const devices = await navigator.mediaDevices.enumerateDevices()

    for (let i = 0; i < devices.length; i++) {
        if (devices[i].label.includes('Default')) {
            continue
        }
        if (devices[i].kind == "audioinput") {
            inputDevices[devices[i].label] = devices[i].deviceId
        }
        if (devices[i].kind == "audiooutput") {
            outputDevices[devices[i].label] = devices[i].deviceId
        }
    }

    // show dialog and update Connected MIDI Devices when device is connected/disconnected
    midi.onstatechange = (event) => {
        populateConnectedMIDIDevices()
        MIDItoNotesBinding()
        const dialog = document.createElement('dialog')
        const message = document.createElement('p')
        const closeMessage = document.createElement('p')
        message.textContent = `${event.port.manufacturer} ${event.port.name} was ${event.port.state}`
        closeMessage.textContent = `press esc to close this dialog`
        dialog.appendChild(message).appendChild(closeMessage)
        document.body.appendChild(dialog)
        dialog.showModal()
    }

    MIDItoNotesBinding()
    populateSelectAudioDevices(inputDevices, selectInputDevices)
    populateSelectAudioDevices(outputDevices, selectOutputDevices)
}

// --- NEXT HERE

export function MIDItoNotesBinding() {
    // make MIDI messages work
    midi.inputs.values().forEach((device) => {
        device.onmidimessage = (message) => console.log(`note: ${message.data[1]}\nvelocity: ${message.data[2]}`)
        // data = [.., note/message, velocity(0 = off)]
    });
}

// --- </NEXT

export function populateSelectAudioDevices(deviceArray, selectTag) {
    selectTag.size = Object.keys(deviceArray).length
    for (let i = 0; i < Object.keys(deviceArray).length; i++) {
        const option = document.createElement('option')
        option.textContent = Object.keys(deviceArray)[i]
        option.value = Object.values(deviceArray)[i]
        selectTag.appendChild(option)
    }
}

export function populateConnectedMIDIDevices() {
    while (connectedMIDIDevices.firstChild) {
        connectedMIDIDevices.removeChild(connectedMIDIDevices.lastChild);
    }
    midi.inputs.forEach((midiInput) => {
        const li = document.createElement('li')
        li.textContent = `${midiInput.manufacturer} ${midiInput.name}`
        connectedMIDIDevices.appendChild(li)
    })
}

export function changeOutputDevice(Tone, newOuputDevice) {
    Tone.getContext().dispose() // is this doing what I think it's doing??
    const audioContext = new AudioContext({
        latencyHint: "interactive",
        sinkId: newOuputDevice
    })
    Tone.setContext(audioContext)
    changeInputDevice(Tone, selectInputDevices.value)
}

export function changeInputDevice(Tone, newInputDevice) {
    if (mic != undefined) {
        mic.close()
    }
    mic = new Tone.UserMedia();
    mic.open(newInputDevice);
    mic.toDestination()
}