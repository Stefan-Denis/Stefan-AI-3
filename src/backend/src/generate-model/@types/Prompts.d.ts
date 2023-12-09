/**
 * ? Prompts Interface
 * * Interface representing the following:
 * * * system: A prompt that is not taxed that provides general guidance for AI.
 * * * user: A prompt that is taxed that Provides Major info for AI.
 */
export default interface Prompts {
    system: string
    user: string
}