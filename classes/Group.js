"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Person_1 = require("./Person");
const enums_1 = require("../enums");
const Member_1 = require("./Member");
class Group {
    get id() {
        return this._id;
    }
    constructor(id, groupOptions = {}) {
        this._id = id;
        this.members = groupOptions.members ? groupOptions.members.map(person => new Member_1.Member(person)) : [];
        this._maxPerson = groupOptions.maxPerson || 5;
        this._minPerson = groupOptions.minPerson || 4;
    }
    toString() {
        //return `Group ${this._id} [${this.members.map(v => v.name).join(',')}] => len: ${this.length}, het: ${this.heterogeneity}, fit: ${this.fitnessValue}`;
        return `Group ${this._id.toString().padStart(8, ' ')} => len: ${this.members.length}, het: ${this.heterogeneity.toFixed(5)}, fit: ${this.fitnessValue.toFixed(5)}, member: ${this.members.map(v => v.person.toString())}`;
    }
    pushMember(incoming) {
        this.members.push((incoming instanceof Person_1.Person) ? new Member_1.Member(incoming) : incoming);
    }
    popMember(index = -1) {
        return index < 0 ? this.members.pop() : this.members.splice(index, 1)[0];
    }
    get heterogeneity() {
        if (this.members.length === 0) {
            return 0;
        }
        else {
            let scores = this.members.map(v => v.person.getScore());
            let maxScore = Math.max(...scores);
            let minScore = Math.min(...scores);
            let AD = (maxScore + minScore) / 2;
            // let difference = maxScore - minScore; // unused
            let sigmaAD = 0;
            try {
                sigmaAD = scores.filter(v => v !== maxScore && v !== minScore)
                    .map(v => Math.abs(AD - v)).reduce((p, c) => p + c);
            }
            catch (_a) {
            }
            return (maxScore - minScore) / (1 + sigmaAD);
        }
    }
    get fitnessValue() {
        let score = 0;
        // Fitness rule 1: Confused when multi-typed person appeared, seems ignoring multi-typed person here
        let packed = {
            O: new Array(),
            C: new Array(),
            E: new Array(),
            A: new Array(),
            N: new Array(),
        };
        this.members
            .filter(v => v.person.type.length === 1) // Ignoring multi-typed person
            .forEach(v => {
            packed[v.person.type[0]].push(v.person.interval);
        });
        let iterable = Object.keys(packed).map(key => packed[key]);
        if (iterable.every(val => val.length < 3 && val.every((v, i, a) => i === a.indexOf(v)))) {
            score += 0.25;
        }
        // Fitness rule 2: Confused when multi-typed person appeared, seems ignoring multi-typed person here
        let types = this.members
            .filter(v => v.person.type.length === 1) // Ignoring multi-typed person
            .map(v => v.person.type[0]);
        if (types.includes(enums_1.OceanType.C) || types.includes(enums_1.OceanType.E)) {
            score += 0.25;
        }
        // Fitness rule 3: Confused when multi-typed person appeared, seems ignoring multi-typed person here
        if ((packed.C.length === 1 && packed.E.length === 0) || (packed.C.length === 0 && packed.E.length === 1)) {
            score += 0.25;
        }
        // Fitness rule 4
        if (this.members.filter(v => v.person.type.length > 1).length === 1) {
            score += 0.25;
        }
        return score;
    }
}
exports.Group = Group;
