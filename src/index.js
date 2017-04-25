"use strict";
exports.__esModule = true;
require("./scss/style.scss");
var rxjs_1 = require("rxjs");
var date_helpers_1 = require("./lib/date_helpers");
var dom_helpers_1 = require("./lib/dom_helpers");
// DOM ELEMENTS
var calendarInputElement = document.getElementById('calendar'); // TODO: Fix 'any'
var calendarContainer = document.getElementById('calendar-container');
var bodyElement = document.querySelector('body');
var closeButton = document.querySelector('.close-overlay'); // TODO: Fix 'any'
var closeButton$ = rxjs_1.Observable.fromEvent(closeButton, 'click');
var main$ = new rxjs_1.Subject();
// Calendar Input Element Stream
var calendarInput$ = rxjs_1.Observable
    .fromEvent(calendarInputElement, 'click')
    .map(function (e) { return e.target.value; })
    .map(function (value) { return value ? date_helpers_1.getDataFromDate(new Date(value)) : { month: date_helpers_1.getCurrentMonth(new Date()), year: date_helpers_1.getCurrentYear(new Date()) }; })
    .subscribe(function (value) { return main$.next(value); });
// Month Navigator Stream
var monthNavigator$ = main$
    .map(function (data) { return new Date(data.year, data.month); })
    .map(function (date) { return ({
    previousDate: date_helpers_1.getMonthAndYear(date_helpers_1.subtractMonth(date)),
    currentDate: date_helpers_1.getCurrentMonthString(date),
    nextDate: date_helpers_1.getMonthAndYear(date_helpers_1.addMonth(date))
}); });
// HTML Streams
var calendarHTML$ = main$
    .map(date_helpers_1.getFullMonth)
    .map(dom_helpers_1.getCalendarTableHTML);
var monthNavigatorHTML$ = monthNavigator$.map(dom_helpers_1.generateNavigation);
var completeCalendarHTML$ = rxjs_1.Observable
    .combineLatest(monthNavigatorHTML$, calendarHTML$)
    .map(function (resultHTML) { return resultHTML.join(''); });
completeCalendarHTML$.subscribe(function (data) { return dom_helpers_1.openCalendar(data, calendarContainer, bodyElement); });
// Calendar Day Stream
// http://stackoverflow.com/a/27069598/1405803
var dayClick$ = completeCalendarHTML$
    .map(function () { return rxjs_1.Observable.from(Array.from(document.querySelectorAll('.day-item'))); })
    .flatMap(function (elements) { return rxjs_1.Observable.from(elements); })
    .flatMap(function (element) { return rxjs_1.Observable.fromEvent(element, 'click'); })
    .map(function (evt) { return parseInt(evt.target.value); })
    .map(function (formattedDate) { return new Date(formattedDate); });
dayClick$.subscribe(function (newDate) {
    dom_helpers_1.closeCalendar(calendarContainer, bodyElement);
    calendarInputElement.value = new Date(newDate).toDateString();
});
// Month changer < [Month] > Streams
var dateChangerArrows$ = completeCalendarHTML$
    .map(function () { return rxjs_1.Observable.from(Array.from(document.querySelectorAll('.date-changer'))); })
    .flatMap(function (elements) { return rxjs_1.Observable.from(elements); })
    .flatMap(function (element) { return rxjs_1.Observable.fromEvent(element, 'click'); })
    .map(function (evt) {
    evt.stopPropagation();
    var arrowValue = evt.target.value;
    var _a = arrowValue.split('-'), year = _a[0], month = _a[1];
    return new Date(year, month);
})
    .map(function (date) { return ({
    month: date_helpers_1.getCurrentMonth(date),
    year: date_helpers_1.getCurrentYear(date)
}); });
dateChangerArrows$.subscribe(function (value) { return main$.next(value); });
// Close Calendar Stream
closeButton$.subscribe(function () { return dom_helpers_1.closeCalendar(calendarContainer, bodyElement); });
