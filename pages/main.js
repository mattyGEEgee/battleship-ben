import * as Tone from 'tone'
import { ConfigureAudioDevices, ConfigureMIDIDevices, ConfigureAudioFX } from './classes';
const AudioDeviceConfigurer = new ConfigureAudioDevices
const MIDIDeviceConfigurer = new ConfigureMIDIDevices
const AudioFXConfigurer = new ConfigureAudioFX

// start button and <dialog> window
const startDialog = document.querySelector('dialog#start-dialog')
const startButton = document.querySelector('input#start-button')
startDialog.showModal()
startButton.addEventListener('click', async (event) => {
    await AudioDeviceConfigurer.organiseDevices()
    await MIDIDeviceConfigurer.organiseDevices()
    startDialog.close()
})

// user inputs
AudioDeviceConfigurer.selectInputDevices.addEventListener('input', (event) => {
    AudioDeviceConfigurer.changeInputDevice()
})
AudioDeviceConfigurer.selectOutputDevices.addEventListener('input', (event) => {
    AudioDeviceConfigurer.changeOutputDevice()
})

// --- NEXT HERE

// classes.js line 119 

const testButton = document.querySelector('input#test')
testButton.addEventListener('click', (event) => {
    AudioFXConfigurer.connectToFXChain(AudioDeviceConfigurer.mic)
})

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


const LPFreq = document.querySelector('input#lp-freq')
LPFreq.addEventListener('input', (event) => {
    LPFilter.set({ frequency: event.target.value })
})

*/
// --- </NEXT