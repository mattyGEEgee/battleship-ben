import * as Tone from 'tone'
import { ConfigureAudioDevices, ConfigureMIDIDevices, ConfigureAudioFX } from './classes';
const AudioDeviceConfigurer = new ConfigureAudioDevices
const MIDIDeviceConfigurer = new ConfigureMIDIDevices
const AudioFXConfigurer = new ConfigureAudioFX
AudioFXConfigurer.connectToFXChain(AudioDeviceConfigurer.mic)

// start button and <dialog> window
const startDialog = document.querySelector('dialog#start-dialog')
const startButton = document.querySelector('input#start-button')
startDialog.showModal()
startButton.addEventListener('click', async (event) => {
    await AudioDeviceConfigurer.organiseDevices()
    await MIDIDeviceConfigurer.organiseDevices()
    startDialog.close()
})

// user selected input
AudioDeviceConfigurer.selectInputDevices.addEventListener('input', (event) => {
    AudioDeviceConfigurer.changeInputDevice()
})
// user selected output
AudioDeviceConfigurer.selectOutputDevices.addEventListener('input', (event) => {
    AudioDeviceConfigurer.changeOutputDevice()
})

// --- NEXT HERE

// classes.js line 119 

// connect/bypass FX
AudioFXConfigurer.fxBypassToggleCheckbox.addEventListener('click', (event) => {
    if (event.target.checked) {
        // ON
        console.log('checked')
        // disconnect and reconnect the 2 DCMeters
    } else {
        // OFF
        console.log('unchecked');
        // disconnect and reconnect the 2 DCMeters
    }
})

const testButton = document.querySelector('input#test')
testButton.addEventListener('click', (event) => {

    // AudioFXConfigurer.addToChain(new Tone.Reverb)
    // AudioFXConfigurer.addToChain(new Tone.PitchShift(2))
})
const selectTest = document.querySelector('select#fx-1')
selectTest.addEventListener('input', (event) => {
    let effect
    if (event.target.value == 'reverb') {
        effect = new Tone.Reverb
    }
    if (event.target.value == 'frequency-shifter') {
        effect = new Tone.FrequencyShifter
    }
    AudioFXConfigurer.populateFXParameters(effect)
})

// --- </NEXT