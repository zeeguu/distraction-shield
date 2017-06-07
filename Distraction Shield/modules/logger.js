import * as storage from '../modules/storage/storage'
import * as constants from '../constants'

/** @module logger */

/**
 * This module is meant to be used for logging actions of the user and for statistics.
 * This module retrieves the UUID, generated on install, from the storage and uses this to link data to the user anonymously.
 * The module also dumps the logs every specified time interval.
 * This is simply done by clearing the separate log lines and combining them into one file which is stored in the storage.
 * This can be retrieved using the “tds_logfile” key.
 * Also when given permission by the user (default yes), the data is sent to a specified API.
 */

/**
 * creates a log format "ID + args + on time"
 * @param event describes the action performed
 * @param value value of event, default = null
 * @param type {string} type of the event (options, statistics ..)
 */

export function logToFile(event, value = null, type='undefined') {
    //Time must be in JSON format at this point otherwise you lose it's value when retrieving from storage
    //for some reason
    let time = new Date().toJSON();
    getUUID(id => {
        storeLog(id, event, value, time, type);
        chrome.extension.getBackgroundPage().console.log(`${id} ${event} ${value} on ${time} at ${type}`);
    });
}

export function setAlarm() {
    chrome.alarms.create('logdump', {delayInMinutes: constants.ALARM_DELAY, periodInMinutes: constants.LOGGING_INTERVAL });
    chrome.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name == 'logdump') {
            chrome.extension.getBackgroundPage().console.log("scheduled log dumping");
            scheduledLogDump();
        }
    });
}

/**
 * This dumps the log from the storage to the server (if user gave permission?)
 * After that, it clears the logs.
 */

function scheduledLogDump() {
    //To be implemented, set true for testing
    const PLACEHOLDER = true;  // TODO get user permission to send data?
    const API_PLACEHOLDER = "/test_upload_user_activity_data";
    storage.getLogs(data => {
        if (PLACEHOLDER)
            sendLogsTo(data);
        dumpToFile(data);
        clearLogs();
    });
}

/**
 * This function dumps the array of logs in a logfile containing the date & logs.
 * @param data
 */

function dumpToFile(data){
    let time = new Date().toJSON();
    let string = `'{"date":${time},"data":${data}}'`;
    storage.setLogFile(string);
}

/**
 * retrieves UUID from userSettings
 * @callback callback for UUID
 */

function getUUID(callback){
    storage.getSettings(data => {
        callback(data.UUID);
    });
}

/**
 * Append new log to existing log.
 */

function storeLog(id, event, value, time, type){
    //We save the logs as an array strings in storage now and convert to JSON at point of sending
    //This allows the sending of multiple logs, as keeping the logs as JSON and appending new ones
    //doesn't give you a nice format for sending.
    let string = {id:id, event:event, value:value, time:time, type:type};
    storage.getLogs(data => {

        if (data != undefined)
             data.push(string);
        else
            data = [string];
        storage.setLogs(data);
    });
}

export function clearLogs(){
    storage.clearLogs();
}

export function printLogs(){
    storage.getLogs(data => {
        //Sends the data when you hit print logs
        sendLogsTo(data);
        chrome.extension.getBackgroundPage().console.log(data);
    });
}
/**
 * Sends current log file to dst
 * @param api to send file to.
 * @param param destination
 * @param data formatted data to be sent
 */

/*
 *I removed the two params that were here before, as they
 * were causing issues at the start. They could possible be added back in so there is a way of specifiy the
 * address to send too that isn't hardcoding it in below, but we can look at that later.
 */
function sendLogsTo(data){
    $.ajax({
        headers: {
            'content-type': 'application/json'
        },
        url: 'http://127.0.0.1:5000/submit',
        //convert logs to JSON at point of sending, an array of strings converts nicely
        data: JSON.stringify(data),
        type: "POST"
    });
}