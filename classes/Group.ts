import { Person } from "./Person";
import { OceanType } from "../enums";
import { IGroupOptions } from "../interfaces";
import { Member } from "./Member";

export class Group {
    public members: Member[];
    private _id: number;
    private _maxPerson: number;
    private _minPerson: number;

    get id(): number {
        return this._id;
    }

    public constructor(id: number, groupOptions: IGroupOptions = {}) {
        this._id = id;
        this.members = groupOptions.members ? groupOptions.members.map(person => new Member(person)) : [];
        this._maxPerson = groupOptions.maxPerson || 5;
        this._minPerson = groupOptions.minPerson || 4;
    }

    public toString(): string {
        //return `Group ${this._id} [${this.members.map(v => v.name).join(',')}] => len: ${this.length}, het: ${this.heterogeneity}, fit: ${this.fitnessValue}`;
        return `Group ${this._id.toString().padStart(8, ' ')} => len: ${this.members.length}, het: ${this.heterogeneity.toFixed(5)}, fit: ${this.fitnessValue.toFixed(5)}, member: ${this.members.map(v => v.person.toString())}`;
    }

    public pushMember(incoming: Person | Member) {
        this.members.push((incoming instanceof Person) ? new Member(incoming) : incoming);
    }

    public popMember(index: number = -1): Member {
        return index < 0 ? this.members.pop() : this.members.splice(index, 1)[0];
    }

    get heterogeneity(): number {
        if (this.members.length === 0) {
            return 0;
        } else {
            let scores = this.members.map(v => v.person.getScore());
            let maxScore = Math.max(...scores);
            let minScore = Math.min(...scores);
            let AD = (maxScore + minScore) / 2;
            // let difference = maxScore - minScore; // unused
            let sigmaAD = 0
            try {
                sigmaAD = scores.filter(v => v !== maxScore && v !== minScore)
                    .map(v => Math.abs(AD - v)).reduce((p, c) => p + c);
            } catch {

            }
            return (maxScore - minScore) / (1 + sigmaAD);
        }
    }

    get fitnessValue(): number {
        let score = 0;

        // Fitness rule 1: Confused when multi-typed person appeared, seems ignoring multi-typed person here
        let packed: { [key in OceanType]: number[] } = {
            O: new Array<number>(),
            C: new Array<number>(),
            E: new Array<number>(),
            A: new Array<number>(),
            N: new Array<number>(),
        };
        this.members
            .filter(v => v.person.type.length === 1) // Ignoring multi-typed person
            .forEach(v => {
                packed[v.person.type[0]].push(v.person.interval);
            });
        let iterable = Object.keys(packed).map(key => packed[key] as number[]);
        if (iterable.every(val => val.length < 3 && val.every((v, i, a) => i === a.indexOf(v)))) {
            score += 0.25;
        }

        // Fitness rule 2: Confused when multi-typed person appeared, seems ignoring multi-typed person here
        let types = this.members
            .filter(v => v.person.type.length === 1) // Ignoring multi-typed person
            .map(v => v.person.type[0]);
        if (types.includes(OceanType.C) || types.includes(OceanType.E)) {
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
