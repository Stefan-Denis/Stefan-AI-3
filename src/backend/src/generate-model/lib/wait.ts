/**
 * ? Wait Namespace
 * ? |
 * ? |-> seconds
 * ? |-> minutes
 * ? |-> milliseconds
 * 
 * * A collection of functions that pauses execution for a specified amount of time.
 * @namespace Wait
 */
export namespace Wait {
    /**
     * Pauses execution for a specified number of seconds.
     * @param s The number of seconds to wait.
    * ```ts
    * Wait.seconds(5)
    * ```
     */
    export async function seconds(s: number) {
        return new Promise(resolve => setTimeout(resolve, (s * 1000)))
    }

    /**
     * Pauses execution for a specified number of minutes.
     * @param m The number of minutes to wait.
     * ```ts
     * Wait.minutes(5)
     * ```
     */
    export async function minutes(m: number) {
        return new Promise(resolve => setTimeout(resolve, (m * 1000 * 60)))
    }

    /**
     * Pauses execution for a specified number of milliseconds.
     * @param ms The number of milliseconds to wait.
     * ```ts
     * Wait.minutes(5)
     * ```
     */
    export async function milliseconds(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}