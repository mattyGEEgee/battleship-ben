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
}

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
    midi.inputs.forEach((midiInput) => {
        const li = document.createElement('li')
        li.textContent = `${midiInput.manufacturer} ${midiInput.name}`
        connectedMIDIDevices.appendChild(li)
    })
}

export function setUpMIDIInput() {
    midi.inputs.values().forEach((device) => {
        device.onmidimessage = (message) => console.log(`note: ${message.data[1]}\nvelocity: ${message.data[2]}`)
        // data = [.., note/message, velocity(0 = off)]
    });
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