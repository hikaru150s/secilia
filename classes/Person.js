"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Person {
    static generateRandom(name) {
        let p = new Person();
        p.name = name || 'New Person';
        p.personality = {
            O: 1 + Math.floor(Math.random() * 119),
            C: 1 + Math.floor(Math.random() * 119),
            E: 1 + Math.floor(Math.random() * 119),
            A: 1 + Math.floor(Math.random() * 119),
            N: 1 + Math.floor(Math.random() * 119),
        };
        p.interval = 1 + Math.floor(Math.random() * 4);
        p.MB = 1 + Math.floor(Math.random() * 4);
        p.TK = 1 + Math.floor(Math.random() * 4);
        p.SK = 1 + Math.floor(Math.random() * 4);
        return p;
    }
    get type() {
        let maxScore = Math.max(this.personality.O, this.personality.C, this.personality.E, this.personality.A, this.personality.N);
        return Object.keys(this.personality).filter((v) => this.personality[v] === maxScore);
    }
    constructor(options = {}) {
        this.name = options.name || '';
        this.personality = options.personality || { O: 1, C: 1, E: 1, A: 1, N: 1 };
        this.interval = options.interval || 1;
        this.MB = options.MB || 1;
        this.TK = options.TK || 1;
        this.SK = options.SK || 1;
    }
    getScore() {
        return this.interval + this.MB + this.TK + this.SK;
    }
    toString() {
        return `${this.name}: ${this.type.reduce((p, c) => p += c, '')} (Interval: ${this.interval})`;
    }
}
exports.Person = Person;
