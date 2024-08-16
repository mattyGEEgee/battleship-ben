import * as Tone from 'tone'
import * as helpers from './helpers';

// attach to an ON button
    // do not un-disable everything until this promise returns
helpers.start().then(() => {
    helpers.populateSelectAudioDevices(helpers.inputDevices, helpers.selectInputDevices)
    helpers.populateSelectAudioDevices(helpers.outputDevices, helpers.selectOutputDevices)
    helpers.populateConnectedMIDIDevices()
    helpers.setUpMIDIInput()
}) 

// --- NEXT HERE

const testButton = document.querySelector('input#test')
testButton.addEventListener('click', (event) => {

})

// --- </NEXT

helpers.selectInputDevices.addEventListener('input', (event) => {
    helpers.changeInputDevice(Tone, event.target.value)
})
helpers.selectOutputDevices.addEventListener('input', (event) => {
    helpers.changeOutputDevice(Tone, event.target.value)
})