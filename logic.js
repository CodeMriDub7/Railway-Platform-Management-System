/**
 * @param {Object} schedule - Array of train objects with { arrival, departure, trainNo }
 * arrival/departure should be valid ISO date strings or Date objects.
 */
function getMinPlatformsWithDates(schedule) {
    if (schedule.length === 0) return { count: 0, assignments: [] };

    // 1. Map to Date objects and sort by arrival time
    let trains = schedule.map(train => ({
        ...train,
        arrDate: new Date(train.arrival),
        depDate: new Date(train.departure)
    }));

    // Numerical sort based on milliseconds since epoch
    trains.sort((a, b) => a.arrDate - b.arrDate);

    let platforms = []; // Stores the departure Date of the last train on each platform
    let assignments = [];

    trains.forEach(train => {
        let assigned = false;

        // 2. Check if any existing platform is free by comparing timestamps
        for (let i = 0; i < platforms.length; i++) {
            // If arrival is after (or equal to) the last departure on this platform
            if (train.arrDate.getTime() >= platforms[i].getTime()) {
                platforms[i] = train.depDate;
                assignments.push({ 
                    trainNo: train.trainNo, 
                    platformNo: i + 1,
                    arrival: train.arrival,
                    departure: train.departure 
                });
                assigned = true;
                break;
            }
        }

        // 3. If no platform is free, add a new one
        if (!assigned) {
            platforms.push(train.depDate);
            assignments.push({ 
                trainNo: train.trainNo, 
                platformNo: platforms.length,
                arrival: train.arrival,
                departure: train.departure 
            });
        }
    });

    return { count: platforms.length, assignments };
}
