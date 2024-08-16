import * as Tone from 'tone'
import * as helpers from './helpers';

const startDialog = document.querySelector('dialog#start-dialog')
const startButton = document.querySelector('input#start-button')
startDialog.showModal()

startButton.addEventListener('click', async (event) => {
    await helpers.start()
    startDialog.close()
})

// --- NEXT HERE

// helpers.js line 47

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