/**
 * A collection of functions that pause execution for a specified amount of time.
 * @namespace Wait
 * @since 3.0
 * @version 1.0
 */
export var Wait;
(function (Wait) {
    /**
     * Pauses execution for a specified number of seconds.
     * @param s The number of seconds to wait.
    * ```ts
    * Wait.seconds(5)
    * ```
     */
    async function seconds(s) {
        return new Promise(resolve => setTimeout(resolve, (s * 1000)));
    }
    Wait.seconds = seconds;
    /**
     * Pauses execution for a specified number of minutes.
     * @param m The number of minutes to wait.
     * ```ts
     * Wait.minutes(5)
     * ```
     */
    async function minutes(m) {
        return new Promise(resolve => setTimeout(resolve, (m * 1000 * 60)));
    }
    Wait.minutes = minutes;
    /**
     * Pauses execution for a specified number of milliseconds.
     * @param ms The number of milliseconds to wait.
     * ```ts
     * Wait.minutes(5)
     * ```
     */
    async function milliseconds(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    Wait.milliseconds = milliseconds;
})(Wait || (Wait = {}));
