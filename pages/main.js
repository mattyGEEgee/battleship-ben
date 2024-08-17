import * as Tone from 'tone'
import * as classes from './classes';
const ConfigureAudioDevices = new classes.ConfigureAudioDevices
const ConfigureMIDIDevices = new classes.ConfigureMIDIDevices

// start button and <dialog> window
const startDialog = document.querySelector('dialog#start-dialog')
const startButton = document.querySelector('input#start-button')
startDialog.showModal()
startButton.addEventListener('click', async (event) => {
    await ConfigureAudioDevices.organiseDevices()
    await ConfigureMIDIDevices.organiseDevices()
    startDialog.close()
})

// user inputs
ConfigureAudioDevices.selectInputDevices.addEventListener('input', (event) => {
    ConfigureAudioDevices.changeInputDevice()
})
ConfigureAudioDevices.selectOutputDevices.addEventListener('input', (event) => {
    ConfigureAudioDevices.changeOutputDevice()
})

// --- NEXT HERE


// classes.js line 119 

/*
const pitchShift = new Tone.PitchShift(12)
classes.mic.connect(pitchShift)
pitchShift.toDestination()

const LPFilter = new Tone.Filter({
    frequency: 1000,
    type: "lowpass",
    rolloff: -24,
    Q: 0.71
})

const testButton = document.querySelector('input#test')
testButton.addEventListener('click', (event) => {

})

const LPFreq = document.querySelector('input#lp-freq')
LPFreq.addEventListener('input', (event) => {
    LPFilter.set({ frequency: event.target.value })
})

*/
// --- </NEXT