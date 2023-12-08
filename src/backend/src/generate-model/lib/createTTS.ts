import { TextToSpeechClient } from '@google-cloud/text-to-speech'
import fs from 'fs-extra'
import util from 'util'
import path from 'path'

/**
 * @param script 
 * @param filename 
 * @param voice
 * Keep the voice the same during the whole subtitle generation process
 * Creates 1 mp3 file with the given filename inside __dirname + ../temporary/propietary
 */
export default async function createTTS(ssml: string, filename: string, voice: string) {
    /**
     * ? __dirname Variable
     * * Used to get the current directory of the app
     */
    const currentModuleUrl = new URL(import.meta.url)
    const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1)

    const client = new TextToSpeechClient()

    const request: object = {
        'audioConfig': {
            'audioEncoding': 'LINEAR16',
            'effectsProfileId': [
                'small-bluetooth-speaker-class-device'
            ],
            'pitch': -20,
            'speakingRate': 0.931
        },
        'input': {
            'ssml': ssml
        },
        'voice': {
            'languageCode': 'en-US',
            'name': voice
        }
    }

    fs.existsSync(path.join(__dirname, '../../../files/generate-model/permanent', `${filename}.mp3`)) ?
        fs.unlinkSync(path.join(__dirname, '../../../files/generate-model/permanent', `${filename}.mp3`)) :
        null

    // Write mp3 data to file
    const [response] = await client.synthesizeSpeech(request)
    const writeFile = util.promisify(fs.writeFile)
    await writeFile(path.join(__dirname, '../../../files/generate-model/temporary', `${filename}.mp3`), response.audioContent as string, 'binary')
}