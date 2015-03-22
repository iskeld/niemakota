"use strict";

var eventTypes = {
    homeOffice: 1,
    outOfOffice: 2
};

function EventType (eventTypeId) {
    this._type = eventTypeId;
}

EventType.prototype.toString = function() {
    if (this._type === eventTypes.homeOffice) {
        return "HO";
    } else if (this._type === eventTypes.outOfOffice) {
        return "OOO";
    } else {
        return undefined;
    }
};

EventType.prototype.isHomeOffice = function() {
    return (this._type === eventTypes.homeOffice);
};

EventType.prototype.isOutOfOffice = function() {
    return (this._type === eventTypes.outOfOffice);
};

var eventTypesEnum = {
    homeOffice: new EventType(eventTypes.homeOffice),
    outOfOffice: new EventType(eventTypes.outOfOffice)
};
Object.freeze(eventTypesEnum.homeOffice);
Object.freeze(eventTypesEnum.outOfOffice);
Object.freeze(eventTypesEnum);

module.exports = {
    EventTypes: eventTypesEnum
};