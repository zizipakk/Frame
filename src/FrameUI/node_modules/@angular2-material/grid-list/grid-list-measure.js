"use strict";
/**
 * Converts values into strings. Falsy values become empty strings.
 * @internal
 */
function coerceToString(value) {
    return "" + (value || '');
}
exports.coerceToString = coerceToString;
/**
 * Converts a value that might be a string into a number.
 * @internal
 */
function coerceToNumber(value) {
    return typeof value === 'string' ? parseInt(value, 10) : value;
}
exports.coerceToNumber = coerceToNumber;
//# sourceMappingURL=grid-list-measure.js.map