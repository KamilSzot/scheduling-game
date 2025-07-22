type State = { hour: number; minute: number; second: number };

let timeChangeHandlers: ((state: State) => void)[] = [];
let previousTime: State = { hour: 0, minute: 0, second: 0 };
let currentTime: State = { hour: 0, minute: 0, second: 0 };

export function subscribeToTimeChanges(handler: (state: State) => void) {
    timeChangeHandlers.push(handler);
    return () => {
        timeChangeHandlers = timeChangeHandlers.filter(h => h !== handler);
    };
}

setInterval(() => {
    let now = new Date();
    let newTime: State = { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() };

    if (
        newTime.hour !== previousTime.hour ||
        newTime.minute !== previousTime.minute ||
        newTime.second !== previousTime.second
    ) {
    currentTime = newTime;
            timeChangeHandlers.forEach(handler => handler(currentTime));
        previousTime = newTime;
    }
}, 100);
