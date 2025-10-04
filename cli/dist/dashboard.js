/**
 * Dashboard Client
 * Send scan results to GreenLightCI Dashboard
 */
/**
 * Send scan results to dashboard
 */
export async function sendToDashboard(result, config, projectName, branch = "main", commit) {
    try {
        // Count feature statuses from file results
        let widelyCount = 0;
        let newlyCount = 0;
        let limitedCount = 0;
        let notBaselineCount = 0;
        for (const file of result.files) {
            for (const issue of file.issues) {
                if (issue.status === "widely")
                    widelyCount++;
                else if (issue.status === "newly")
                    newlyCount++;
                else if (issue.status === "limited")
                    limitedCount++;
                else if (issue.status === "not-baseline")
                    notBaselineCount++;
            }
        }
        // Prepare dashboard data
        const dashboardData = {
            projectName,
            branch,
            commit,
            totalFiles: result.summary.totalFiles,
            totalFeatures: result.summary.totalFeatures,
            widelyAvailable: widelyCount,
            newlyAvailable: newlyCount,
            limited: limitedCount,
            notBaseline: notBaselineCount,
            compatibilityScore: result.summary.averageScore,
            filesScanned: result.files.map((f) => ({
                path: f.filePath,
                features: f.features,
                score: f.score,
            })),
        };
        // Send to dashboard
        const response = await fetch(`${config.url}/api/scans`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": config.apiKey,
            },
            body: JSON.stringify(dashboardData),
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to send data to dashboard: ${response.status} ${errorText}`);
            return false;
        }
        const responseData = (await response.json());
        console.log(`✓ Scan data sent to dashboard (Scan ID: ${responseData.id || "N/A"})`);
        return true;
    }
    catch (error) {
        console.error(`Error sending data to dashboard:`, error);
        return false;
    }
}
/**
 * Validate dashboard configuration
 */
export function validateDashboardConfig(url, apiKey) {
    if (!url || !apiKey) {
        return null;
    }
    // Validate URL format
    try {
        new URL(url);
    }
    catch {
        console.warn(`Warning: Invalid dashboard URL: ${url}`);
        return null;
    }
    // Validate API key format (basic check)
    if (apiKey.length < 10) {
        console.warn(`Warning: Dashboard API key seems too short`);
        return null;
    }
    return { url, apiKey };
}
