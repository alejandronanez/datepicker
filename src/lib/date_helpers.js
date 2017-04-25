"use strict";
exports.__esModule = true;
var lodash_1 = require("lodash");
var MAX_DAY_OF_WEEK = 6;
var MIN_DAY_OF_WEEK = 0;
;
;
var DayItem = (function () {
    function DayItem(_a) {
        var dayOfTheWeek = _a.dayOfTheWeek, dayInCalendar = _a.dayInCalendar, isActive = _a.isActive, isCurrentDay = _a.isCurrentDay, dateString = _a.dateString;
        this.dayOfTheWeek = dayOfTheWeek;
        this.dayInCalendar = dayInCalendar;
        this.isActive = isActive;
        this.isCurrentDay = isCurrentDay;
        this.dateString = dateString;
    }
    return DayItem;
}());
exports.DayItem = DayItem;
;
function getCurrentMonth(date) {
    return date.getMonth();
}
exports.getCurrentMonth = getCurrentMonth;
function getCurrentYear(date) {
    return date.getFullYear();
}
exports.getCurrentYear = getCurrentYear;
function getCurrentDay(date) {
    return date.getDate();
}
exports.getCurrentDay = getCurrentDay;
function getTotalDaysInAMonth(_a) {
    var year = _a.year, month = _a.month;
    return new Date(year, month + 1, 0).getDate();
}
exports.getTotalDaysInAMonth = getTotalDaysInAMonth;
function getDayInTheWeek(_a) {
    var year = _a.year, month = _a.month, day = _a.day;
    return new Date(year, month, day).getDay();
}
exports.getDayInTheWeek = getDayInTheWeek;
;
function getMonthArray(year, month, day) {
    var date = day ? new Date(year, month, day) : new Date(year, month);
    var totalDaysInMonth = getTotalDaysInAMonth({ year: year, month: month });
    var currentDay = day ? getCurrentDay(date) : -1;
    return Array
        .apply(null, { length: totalDaysInMonth })
        .map(function (day, index) { return (new DayItem({
        dayOfTheWeek: getDayInTheWeek({ year: year, month: month, day: index + 1 }),
        dayInCalendar: index + 1,
        isActive: true,
        isCurrentDay: index + 1 === currentDay,
        dateString: new Date(year, month, index + 1).getTime()
    })); });
}
exports.getMonthArray = getMonthArray;
function getMonthFirstWeek(currentYear, currentMonth, monthData) {
    var dayOfTheWeek = monthData[0].dayOfTheWeek;
    var previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    if (dayOfTheWeek === MIN_DAY_OF_WEEK) {
        return monthData;
    }
    var totalDaysInPreviousMonth = getTotalDaysInAMonth({ year: currentYear, month: previousMonth });
    var totalDaysInPreviousMonthIndex = totalDaysInPreviousMonth - (dayOfTheWeek - 1);
    var firstDays = Array
        .apply(null, { length: dayOfTheWeek })
        .map(function (day, index) {
        var year = previousMonth === 11 ? currentYear - 1 : currentYear;
        var dayItem = new DayItem({
            dayOfTheWeek: index,
            dayInCalendar: totalDaysInPreviousMonthIndex,
            isActive: true,
            isCurrentDay: false,
            dateString: new Date(year, previousMonth, totalDaysInPreviousMonthIndex).getTime()
        });
        totalDaysInPreviousMonthIndex++;
        return dayItem;
    });
    return firstDays.concat(monthData);
}
exports.getMonthFirstWeek = getMonthFirstWeek;
function getMonthLastWeek(currentYear, currentMonth, monthData) {
    var dayOfTheWeek = monthData[monthData.length - 1].dayOfTheWeek;
    if (dayOfTheWeek === MAX_DAY_OF_WEEK) {
        return monthData;
    }
    var dayIndex = dayOfTheWeek + 1;
    var arrayLength = 7 - (dayIndex);
    var lastDays = Array
        .apply(null, { length: arrayLength })
        .map(function (day, index) {
        var nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        var nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        var dayItem = new DayItem({
            dayOfTheWeek: dayIndex,
            dayInCalendar: index + 1,
            isActive: true,
            isCurrentDay: false,
            dateString: new Date(nextYear, nextMonth, index + 1).getTime()
        });
        dayIndex++;
        return dayItem;
    });
    return monthData.concat(lastDays);
}
exports.getMonthLastWeek = getMonthLastWeek;
function splitMonthArrayInChunks(monthData) {
    // Each week have 7 days
    return lodash_1.chunk(monthData, 7);
}
exports.splitMonthArrayInChunks = splitMonthArrayInChunks;
function getFullMonth(_a) {
    var year = _a.year, month = _a.month, _b = _a.day, day = _b === void 0 ? null : _b;
    var monthArray = getMonthArray(year, month, day);
    var monthFirstWeek = getMonthFirstWeek(year, month, monthArray);
    var monthLastWeek = getMonthLastWeek(year, month, monthFirstWeek);
    var result = splitMonthArrayInChunks(monthLastWeek);
    return result;
}
exports.getFullMonth = getFullMonth;
function getDataFromDate(date) {
    return {
        day: getCurrentDay(date),
        month: getCurrentMonth(date),
        year: getCurrentYear(date)
    };
}
exports.getDataFromDate = getDataFromDate;
;
function subtractMonth(date) {
    var newDate = new Date(date.getTime());
    newDate.setMonth(newDate.getMonth() - 1);
    return new Date(newDate);
}
exports.subtractMonth = subtractMonth;
function addMonth(date) {
    var newDate = new Date(date.getTime());
    newDate.setMonth(newDate.getMonth() + 1);
    return new Date(newDate);
}
exports.addMonth = addMonth;
function getMonthAndYear(date) {
    return getCurrentYear(date) + "-" + getCurrentMonth(date);
}
exports.getMonthAndYear = getMonthAndYear;
function getCurrentMonthString(date) {
    var months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    return months[getCurrentMonth(date)] + " " + getCurrentYear(date);
}
exports.getCurrentMonthString = getCurrentMonthString;
function generateDateForDateChanger(date) {
    var splitDate = date.split('-').map(function (x) { return parseInt(x); });
    return {
        year: splitDate[0],
        month: splitDate[1]
    };
}
exports.generateDateForDateChanger = generateDateForDateChanger;
