"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const obj = { name: "Tutul", age: 22, admin: true };
// const keys = ["name", "admin"];
const pick = (obj, keys) => {
    const finalObj = {};
    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            finalObj[key] = obj[key];
        }
    }
    return finalObj;
};
exports.default = pick;
