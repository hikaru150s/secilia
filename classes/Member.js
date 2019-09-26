"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Member {
    constructor(person) {
        this._person = person;
        this._selected = false;
    }
    get person() {
        return this._person;
    }
    set person(person) {
        this._person = person;
    }
    get isMarked() {
        return this._selected;
    }
    mark() {
        this._selected = true;
    }
    unmark() {
        this._selected = false;
    }
}
exports.Member = Member;
