import { showConfetti } from './effects.js';

const state = {
    email: '',
    isSubscribed: false
};

const listeners = new Set();

function notifyListeners() {
    listeners.forEach(listener => listener(state));
}

export function setEmail(newEmail) {
    if (state.email !== newEmail) {
        state.email = newEmail;
        notifyListeners();
    }
}

export function subscribe() {
    if (!state.isSubscribed) {
        state.isSubscribed = true;
        notifyListeners();
        showConfetti(); // YAAAAS CELEBRATE YASS YASS
    }
}

export function listen(callback) {
    listeners.add(callback);
    callback(state);
}