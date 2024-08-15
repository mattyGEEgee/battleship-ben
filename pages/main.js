import * as Tone from 'tone'

// --- NEXT HERE

const meter = new Tone.DCMeter();
const mic = new Tone.UserMedia();
mic.open();
// connect mic to the meter
mic.connect(meter);
// the current level of the mic
const level = meter.getValue();

// ---

const selectInputDevices = document.querySelector('select#input-devices')
selectInputDevices.addEventListener('input', (event) => {
    console.log(event.target.value);
})
const selectOutputDevices = document.querySelector('select#output-devices')
selectOutputDevices.addEventListener('input', (event) => {
    console.log(event.target.value);
})

let outputDevices = {}
let inputDevices = {}

async function start() {
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

function populateSelectAudioDevices(deviceArray, selectTag) {
    for (let i = 0; i < Object.keys(deviceArray).length; i++) {
        const option = document.createElement('option')
        option.textContent = Object.keys(deviceArray)[i]
        option.value = Object.values(deviceArray)[i]
        selectTag.appendChild(option)
    }
}

start().then(() => {
    populateSelectAudioDevices(inputDevices, selectInputDevices)
    populateSelectAudioDevices(outputDevices, selectOutputDevices)
}) 
// attach to an ON button
        // do not un-disable everything until this promise returns

function changeOutputDevice(newOuputDevice) {
    Tone.getContext().dispose() // is this doing what I think it's doing??
    const audioContext = new AudioContext
    audioContext.setSinkId(newOuputDevice)
    Tone.setContext(audioContext)
}