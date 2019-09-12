export default {
    altDown: false,
    ctrlDown: false,
    shiftDown: false,
    windowsDown: false,
    f4Down: false,
    keycode: {
        keyup: {},
        keydown: {}
    },
    register(key, target, func, type) {
        type = type || 'keydown';
        if (!this.keycode[type])
            this.keycode[type] = {};
        if (!this.keycode[type][key]) {
            this.keycode[type][key] = []
        }
        let temp = this.keycode[type][key].find(item => item.target == target);
        if (temp) {
            temp.func = func;
        }
        else {
            this.keycode[type][key] = [{
                target: target,
                func: func
            }, ...this.keycode[type][key]];
        }
    },
    unregister(key, target, type) {
        type = type || 'keydown';
        if (!this.keycode[type])
            this.keycode[type] = {};
        if (!this.keycode[type][key]) {
            return;
        }
        let temp = this.keycode[type][key].find(item => item.target == target);
        let index = this.keycode[type][key].indexOf(temp);
        this.keycode[type][key].splice(index, 1);
    },
    getFunction(key, type) {
        type = type || 'keydown';
        if (!this.keycode[type])
            this.keycode[type] = {};
        if (!this.keycode[type][key]) {
            return null;
        }
        let events = this.keycode[type][key];
        if (events.length)
            return events[0].func;
        return null;
    },
}
