"use strict";

var eventTypes = {
    remoteOffice: 1,
    outOfOffice: 2
};

function EventType (eventTypeId) {
    this._type = eventTypeId;
}

EventType.prototype.toString = function() {
    if (this._type === eventTypes.remoteOffice) {
        return "RO";
    } else if (this._type === eventTypes.outOfOffice) {
        return "OOO";
    } else {
        return undefined;
    }
};

EventType.prototype.isRemoteOffice = function() {
    return (this._type === eventTypes.remoteOffice);
};

EventType.prototype.isOutOfOffice = function() {
    return (this._type === eventTypes.outOfOffice);
};

var eventTypesEnum = {
    remoteOffice: new EventType(eventTypes.remoteOffice),
    outOfOffice: new EventType(eventTypes.outOfOffice)
};
Object.freeze(eventTypesEnum.remoteOffice);
Object.freeze(eventTypesEnum.outOfOffice);
Object.freeze(eventTypesEnum);

module.exports = {
    EventTypes: eventTypesEnum
};