/**
 * Created by joaosilva on 19/05/15.
 */
app.service('AppService', function() {
   var isLogged = 0;

    var squadID = -1;

    var country = "NLT";

    var rank = 1;

    var isSquadLider = 0;

    var specialisation = 0;

    var inEvent = 0;

    var eventID = 0;

    var factionPin = 0000;

    var eventReady = 0;

    //Return appType
    this.getAppType = function() {
        return appType;
    };

    //Set appType
    this.setAppType = function (newAppType) {
        appType = newAppType;
    };

    //Return isLogged
    this.getIsLogged = function() {
        return isLogged;
    };

    //Set isLogged
    this.setIsLogged = function (newIsLogged) {
        isLogged = newIsLogged;
    };

    //Return inSquad
    this.getSquadID = function() {
        return squadID;
    };

    //Set isLogged
    this.setSquadID = function (newSquadID) {
        squadID = newSquadID;
    };

    //Return isSquadLider
    this.getIsSquadLider = function() {
        return isSquadLider;
    };

    //Set isSquadLider
    this.setIsSquadLider = function (newIsSquadLeader) {
        isSquadLider = newIsSquadLeader;
    };

    //Return specialisation
    this.getSpecialisation = function() {
        return specialisation;
    };

    //Set specialisation
    this.setSpecialisation = function (newSpecialisation) {
        specialisation = newSpecialisation;
    };

    //Return country
    this.getCountry = function() {
        return country;
    };

    //Set country
    this.setCountry = function (newCountry) {
        country = newCountry;
    };

    //Return rank
    this.getRank = function() {
        return rank;
    };

    //Set rank
    this.setRank = function (newRank) {
        rank = newRank;
    };

    //Return eventReady
    this.getEventReady = function() {
        return eventReady;
    };

    //Set specialisation
    this.setEventReady = function (newEventReady) {
        eventReady = newEventReady;
    };

    //Return inEvent
    this.getInEvent = function() {
        return inEvent;
    };

    //Set inEvent
    this.setInEvent = function (newInEvent) {
        inEvent = newInEvent;
    };

    //Return eventID
    this.getEventID = function() {
        return eventID;
    };

    //Set eventID
    this.setEventID = function (newEventID) {
        eventID = newEventID;
    };

    //Return factionPin
    this.getFactionPin = function() {
        return factionPin;
    };

    //Set factionPin
    this.setFactionPin = function (newFactionPin) {
        factionPin = newFactionPin;
    };
});
