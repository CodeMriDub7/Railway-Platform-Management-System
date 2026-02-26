// logic.js

function getMinPlatforms(schedule) {
    if (schedule.length === 0) return 0;

    let arr = [];
    let dep = [];

    schedule.forEach(train => {
        let a = parseInt(train.arrival);
        let d = parseInt(train.departure);

        // FIX: If departure is smaller than arrival (e.g., Arr: 2350, Dep: 0030)
        // Add 2400 to departure to treat it as "next day" time (e.g., 2430)
        if (d < a) {
            d += 2400;
        }

        arr.push(a);
        dep.push(d);
    });

    // Numerical sort is required in JS
    arr.sort((a, b) => a - b);
    dep.sort((a, b) => a - b);

    let platforms_needed = 0;
    let max_platforms = 0;
    let i = 0; 
    let j = 0; 

    while (i < arr.length && j < dep.length) {
        if (arr[i] <= dep[j]) {
            platforms_needed++;
            i++;
        } else {
            platforms_needed--;
            j++;
        }
        max_platforms = Math.max(max_platforms, platforms_needed);
    }
    return max_platforms;
}

function calculateStationRequirements(trainList) {
    let upstreamTrains = [];
    let downstreamTrains = [];

    trainList.forEach(train => {
        const dir = train.direction.toLowerCase();
        if (dir.startsWith('u')) {
            upstreamTrains.push(train);
        } else {
            downstreamTrains.push(train);
        }
    });

    const upPlatforms = getMinPlatforms(upstreamTrains);
    const downPlatforms = getMinPlatforms(downstreamTrains);

    return {
        upstream: upPlatforms,
        downstream: downPlatforms,
        total: upPlatforms + downPlatforms
    };
}

module.exports = { calculateStationRequirements };