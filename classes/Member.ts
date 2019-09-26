import { Person } from "./Person";

export class Member {
    private _person: Person;
    private _selected: boolean;

    public constructor(person: Person) {
        this._person = person;
        this._selected = false;
    }

    get person(): Person {
        return this._person;
    }

    set person(person: Person) {
        this._person = person;
    }

    get isMarked(): boolean {
        return this._selected;
    }

    public mark() {
        this._selected = true;
    }

    public unmark() {
        this._selected = false;
    }
}
