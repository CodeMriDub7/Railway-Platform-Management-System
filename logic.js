// logic.js

function getMinPlatformsWithAssignment(schedule) {
    if (schedule.length === 0) return { count: 0, assignments: [] };

    // 1. Convert to Date objects and sort by arrival time
    let trains = schedule.map(train => ({
        ...train,
        arrDate: new Date(train.arrival),
        depDate: new Date(train.departure)
    }));

    trains.sort((a, b) => a.arrDate - b.arrDate);

    let platforms = []; // Stores departure times of occupied platforms
    let assignments = [];

    trains.forEach(train => {
        let assigned = false;

        // 2. Look for a free platform (Current Arrival >= Last Departure)
        for (let i = 0; i < platforms.length; i++) {
            if (train.arrDate.getTime() >= platforms[i].getTime()) {
                platforms[i] = train.depDate;
                assignments.push({ 
                    trainNo: train.trainNo, 
                    platformNo: i + 1 
                });
                assigned = true;
                break;
            }
        }

        // 3. If no platform is free, assign a new one
        if (!assigned) {
            platforms.push(train.depDate);
            assignments.push({ 
                trainNo: train.trainNo, 
                platformNo: platforms.length 
            });
        }
    });

    return { count: platforms.length, assignments };
}

function calculateStationRequirements(trainList) {
    const upTrains = trainList.filter(t => t.direction.toLowerCase().startsWith('u'));
    const downTrains = trainList.filter(t => !t.direction.toLowerCase().startsWith('u'));

    const upRes = getMinPlatformsWithAssignment(upTrains);
    const downRes = getMinPlatformsWithAssignment(downTrains);

    // Offset downstream platform numbers so they start after upstream
    const adjustedDown = downRes.assignments.map(a => ({
        trainNo: a.trainNo,
        platformNo: a.platformNo + upRes.count
    }));

    return {
        upstreamCount: upRes.count,
        downstreamCount: downRes.count,
        totalPlatforms: upRes.count + downRes.count,
        assignments: [...upRes.assignments, ...adjustedDown]
    };
}

module.exports = { calculateStationRequirements };
