/**
 * Baseline compatibility status
 */
export var BaselineStatus;
(function (BaselineStatus) {
    /** Feature is widely available across browsers */
    BaselineStatus["WidelyAvailable"] = "widely";
    /** Feature has recently become baseline */
    BaselineStatus["NewlyAvailable"] = "newly";
    /** Feature has limited availability */
    BaselineStatus["Limited"] = "limited";
    /** Feature is not baseline yet */
    BaselineStatus["NotBaseline"] = "not-baseline";
    /** Unknown status */
    BaselineStatus["Unknown"] = "unknown";
})(BaselineStatus || (BaselineStatus = {}));
