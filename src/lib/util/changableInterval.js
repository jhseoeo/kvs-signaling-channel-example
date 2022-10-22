class ChangableInterval {
    constructor(func, interval) {
        this.func = func;
        this.loop = setInterval(func, interval);
    }

    changeInterval = (interval) => {
        clearInterval(this.loop);
        this.loop = setInterval(this.func, interval);
    };

    clear = () => {
        clearInterval(this.loop);
    };
}

module.exports = ChangableInterval;
