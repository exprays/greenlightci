/**
 * Check if feature is compatible with custom browser targets
 */
export function isCompatibleWithTargets(featureSupport, customTargets) {
    const incompatibleBrowsers = [];
    // Check each browser in custom targets
    for (const [browser, targetVersion] of Object.entries(customTargets)) {
        const featureVersion = featureSupport[browser];
        if (!featureVersion) {
            // Feature not supported in this browser at all
            incompatibleBrowsers.push(`${browser} (not supported)`);
            continue;
        }
        // Compare versions
        if (compareVersions(featureVersion, targetVersion) > 0) {
            // Feature requires newer version than target
            incompatibleBrowsers.push(`${browser} (requires ${featureVersion}+, target is ${targetVersion})`);
        }
    }
    return {
        compatible: incompatibleBrowsers.length === 0,
        incompatibleBrowsers,
    };
}
/**
 * Compare two version strings
 * Returns: -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
 */
export function compareVersions(v1, v2) {
    const parts1 = v1.split('.').map((n) => parseInt(n, 10) || 0);
    const parts2 = v2.split('.').map((n) => parseInt(n, 10) || 0);
    const maxLength = Math.max(parts1.length, parts2.length);
    for (let i = 0; i < maxLength; i++) {
        const num1 = parts1[i] || 0;
        const num2 = parts2[i] || 0;
        if (num1 > num2)
            return 1;
        if (num1 < num2)
            return -1;
    }
    return 0;
}
/**
 * Parse custom browser targets from JSON string
 */
export function parseCustomTargets(targetsJson) {
    if (!targetsJson || targetsJson.trim() === '') {
        return null;
    }
    try {
        const parsed = JSON.parse(targetsJson);
        // Validate the structure
        const validBrowsers = ['chrome', 'edge', 'firefox', 'safari'];
        const targets = {};
        for (const [browser, version] of Object.entries(parsed)) {
            if (validBrowsers.includes(browser.toLowerCase())) {
                targets[browser.toLowerCase()] =
                    String(version);
            }
        }
        return Object.keys(targets).length > 0 ? targets : null;
    }
    catch (error) {
        throw new Error(`Invalid custom-browser-targets JSON: ${error}`);
    }
}
