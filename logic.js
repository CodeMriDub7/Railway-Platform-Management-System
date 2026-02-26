// logic.js
function calculateStationRequirements(trainList) {
    const BUFFER = 10 * 60000; 
    const REVERSAL_BUFFER = 25 * 60000;
    const MAX_STAY = 60 * 60000;

    // 1. Filter out invalid rows
    const valid = trainList.filter(t => {
        const a = new Date(t.arrival).getTime();
        const d = new Date(t.departure).getTime();
        return a !== d && !isNaN(a) && !isNaN(d);
    });

    // 2. Sort by Time, then by Priority (High numbers first)
    const processed = valid.map(t => ({
        ...t,
        arr: new Date(t.arrival).getTime(),
        dep: new Date(t.departure).getTime()
    })).sort((a, b) => {
        if (a.arr !== b.arr) return a.arr - b.arr;
        return b.priority - a.priority; 
    });

    let platforms = []; 
    let schedule = [];

    processed.forEach(train => {
        const currentBuffer = train.type === 'R' ? REVERSAL_BUFFER : BUFFER;
        const platformRelease = (train.dep - train.arr) > MAX_STAY ? (train.arr + MAX_STAY) : train.dep;

        // Find reusable platform
        let pIdx = platforms.findIndex(freeAt => (freeAt + currentBuffer) <= train.arr);

        if (pIdx === -1) {
            platforms.push(platformRelease);
            pIdx = platforms.length - 1;
        } else {
            platforms[pIdx] = platformRelease;
        }

        schedule.push({
            trainNo: train.trainNo,
            platform: pIdx + 1,
            arrival: train.arrival,
            departure: train.departure,
            type: train.type,
            priority: train.priority,
            movedToYard: (train.dep - train.arr) > MAX_STAY
        });
    });

    return {
        total: platforms.length,
        schedule: schedule
    };
}

module.exports = { calculateStationRequirements };
