﻿import { Person, Group, Member } from "./classes";
import { OceanType } from "./enums";

// 1. Create Population
const populationSize = 357;
const maxGroupSize = 5;
const minGroupSize = 4;
const maxIteration = 0; // No Cross-Over mode
const minFitnessValue = 1.0;

let population: Person[] = new Array<Person>();

// Use this block for random-generated person
for (let i = 0; i < populationSize; i++) {
    population.push(Person.generateRandom(`Person ${i + 1}`));
    
}

// Use this block for user-generated person
/*population.push(new Person({
    name: 'Person 1',
    personality: { O: 1, C: 1, E: 1, A: 1, N: 1 },
    interval: 1,
    MB: 1,
    TK: 1,
    SK: 1,
}));*/

// Appendix 1: Generate population statistics
const POP_STAT = {
    sizes: {
        O: population.filter(p => p.type[0] === OceanType.O).length,
        C: population.filter(p => p.type[0] === OceanType.C).length,
        E: population.filter(p => p.type[0] === OceanType.E).length,
        A: population.filter(p => p.type[0] === OceanType.A).length,
        N: population.filter(p => p.type[0] === OceanType.N).length,
    }
};

// 2. Generate Random Groups
const groupCount = Math.ceil(populationSize / maxGroupSize);
let groups: Group[] = new Array<Group>(groupCount);
//let counter = 1;
//let temporaryGroup: Group = new Group(counter, { maxPerson: maxGroupSize, minPerson: minGroupSize });
//while (population.length > 0) {
//    console.log('Pop size now:', population.length);
//    if (temporaryGroup.members.length === maxGroupSize) {
//        groups.push(temporaryGroup);
//        counter += 1;
//        temporaryGroup = new Group(counter, { maxPerson: maxGroupSize, minPerson: minGroupSize });
//    } else {
//        let selectedIndex = Math.ceil(Math.random() * (population.length - 1));
//        temporaryGroup.pushMember(population.splice(selectedIndex, 1)[0]);
//    }
//}
//groups.push(temporaryGroup);
//counter += 1;
let counter = 0;
while (population.length > 0) {
    console.log('Pop size now:', population.length);
    if (!groups[counter % groupCount]) {
        groups[counter % groupCount] = new Group(counter + 1, { maxPerson: maxGroupSize, minPerson: minGroupSize });
    }
    let selectedIndex = Math.ceil(Math.random() * (population.length - 1));
    groups[counter % groupCount].pushMember(population.splice(selectedIndex, 1)[0]);
    counter += 1;
}

// 3. Begin iteration
let iteration = 0;
const isFit = (groups: Group[]): boolean => groups.every(group => group.fitnessValue >= minFitnessValue);

// 4. Iterate until all groups is fit or max iteration reached
while (isFit(groups) === false && iteration < maxIteration) {
    // (5 + 6).1. Sort groups by its fitness value descending (Filtered by only unfit groups)
    let alreadyFitGroups = groups.filter(group => group.fitnessValue >= minFitnessValue);
    let sortedUnfitGroups = groups.filter(group => group.fitnessValue < minFitnessValue).sort((a, b) => b.fitnessValue - a.fitnessValue);

    // Select/mark on each group
    sortedUnfitGroups.forEach(group => {
        // Due to confusion of selection criteria method, an anti-fitness procedure will be applied by reversing fitness function and select the most unfit member
        let sortedSingleTypePersons = group.members
                .filter(member => member.person.type.length === 1) // Select only single-type person
                .sort((a, b) => a.person.type[0] !== b.person.type[0] ? (a.person.type[0] < b.person.type[0] ? 1 : -1) : b.person.interval - a.person.interval); // Sort person by type then by interval descending
        
        // Anti rule 1
        let rule1_counter = 1;
        let rule1_currentType = OceanType.O;

        sortedSingleTypePersons.forEach((v, i, a) => {
                if (v.person.type[0] === rule1_currentType) {
                    rule1_counter += 1;
                } else {
                    rule1_counter = 1;
                    rule1_currentType = v.person.type[0];
                }
                let next = a[i + 1];
                if (((next && next.person.type[0] !== rule1_currentType) || next === undefined) && rule1_counter > 2) {
                    v.mark();
                }
            });

        // Anti rule 2
        if (sortedSingleTypePersons.some(member => member.person.type[0] === OceanType.C || member.person.type[0] === OceanType.E) === false) {
            let
                rule2_O_length = sortedSingleTypePersons.filter(member => member.person.type[0] === OceanType.O).length,
                rule2_A_length = sortedSingleTypePersons.filter(member => member.person.type[0] === OceanType.A).length,
                rule2_N_length = sortedSingleTypePersons.filter(member => member.person.type[0] === OceanType.N).length,
                selected: OceanType = OceanType.O;
            let maxLength = Math.max(rule2_O_length, rule2_A_length, rule2_N_length);
            // High Complexity Section
            //  The level-based priority rule will be applied
            //  Prioritize O, then A, then N
            if (maxLength === rule2_O_length && maxLength === rule2_A_length && maxLength === rule2_N_length) {
                let maxPop = Math.max(POP_STAT.sizes.O, POP_STAT.sizes.A, POP_STAT.sizes.N);
                if (maxPop === POP_STAT.sizes.O) {
                    selected = OceanType.O;
                } else if (maxPop === POP_STAT.sizes.A) {
                    selected = OceanType.A;
                } else {
                    selected = OceanType.N;
                }
            } else if (maxLength === rule2_O_length && maxLength === rule2_A_length) {
                if (POP_STAT.sizes.O >= POP_STAT.sizes.A) {
                    selected = OceanType.O;
                } else {
                    selected = OceanType.A;
                }
            } else if (maxLength === rule2_O_length && maxLength === rule2_N_length) {
                if (POP_STAT.sizes.O >= POP_STAT.sizes.N) {
                    selected = OceanType.O;
                } else {
                    selected = OceanType.N;
                }
            } else if (maxLength === rule2_A_length && maxLength === rule2_N_length) {
                if (POP_STAT.sizes.A >= POP_STAT.sizes.N) {
                    selected = OceanType.A;
                } else {
                    selected = OceanType.N;
                }
            } else if (maxLength === rule2_O_length) {
                selected = OceanType.O;
            } else if (maxLength === rule2_A_length) {
                selected = OceanType.A;
            } else if (maxLength === rule2_N_length) {
                selected = OceanType.N;
            }
            sortedSingleTypePersons.filter(member => member.person.type[0] === selected).sort((a, b) => a.person.interval - b.person.interval)[0].mark();
        }

        // Anti rule 3
        //  Only select lowest E first then lowest C
        let rule3_begin = sortedSingleTypePersons.filter(member => member.person.type[0] === OceanType.C || member.person.type[0] === OceanType.E);
        if (rule3_begin && rule3_begin.length > 1) {
            let rule3_lowestE = rule3_begin.filter(member => member.person.type[0] === OceanType.E).sort((a, b) => a.person.interval - b.person.interval)[0];
            let rule3_lowestC = rule3_begin.filter(member => member.person.type[0] === OceanType.C).sort((a, b) => a.person.interval - b.person.interval)[0];
            if ((rule3_lowestE && !rule3_lowestC) || (rule3_lowestE && rule3_lowestC && rule3_lowestE.person.interval <= rule3_lowestC.person.interval)) {
                rule3_lowestE.mark();
            } else {
                rule3_lowestC.mark();
            }
        }

        // Anti rule 4
        let sortedMultiTypePerson = group.members
            .filter(member => member.person.type.length > 1) // Select only multi-type person
            .sort((a, b) => a.person.interval - b.person.interval);
        if (sortedMultiTypePerson.length > 1) {
            sortedMultiTypePerson[0].mark();
        }
    });

    // Cross Over

}
