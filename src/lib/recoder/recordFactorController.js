const { min, max } = require("../util");

const INITIAL_INTERVAL = 1000 * 2;
const MAX_INTERVAL = 5000;
const MAX_VALID_THRESHOLD = 90;
const INTERVAL_INCREMENTER = 125;

/**
 * Calculate next interval
 * @param {number} oldInterval - previous interval
 * @param {number} currentMatchDelta - subtract threshold from current image match rate
 * @param {boolean} success - was record dicision successful
 * @returns {number} next interval
 */
function getNewInterval(oldInterval, currentMatchDelta, success = false) {
    if (success) {
        return INITIAL_INTERVAL;
    } else if (currentMatchDelta > 0) {
        return min(oldInterval + INTERVAL_INCREMENTER * (1 - currentMatchDelta), MAX_INTERVAL);
    } else {
        return oldInterval;
    }
}

/**
 * Calculate next threshold
 * @param {number} oldThreshold - previous threshold
 * @param {number} currentMatchDelta - subtract threshold from current image match rate
 * @param {boolean} success - was record dicision successful
 * @returns {number} next threshold
 */
function getNewThreshold(oldThreshold, currentMatchDelta, success = false) {
    if (success) {
        return getValidThreshold(oldThreshold);
    } else if (currentMatchDelta > 0) {
        return oldThreshold * (1 - currentMatchDelta);
    } else {
        return oldThreshold;
    }
}

/**
 *
 * @param {number} threshold - current interval
 * @returns {number} next interval
 */
function getValidThreshold(threshold) {
    return min(threshold * 10, MAX_VALID_THRESHOLD);
}

module.exports = {
    getNewInterval,
    getNewThreshold,
    getValidThreshold,
};
