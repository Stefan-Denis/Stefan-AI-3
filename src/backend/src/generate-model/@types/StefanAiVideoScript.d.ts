import Video from './Video.js'

export default interface StefanAIVideoScript {
    error?: string
    [key: string]: Video | string | undefined
}