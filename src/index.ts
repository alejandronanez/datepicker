import './scss/style.scss';

import { Observable, Subject } from 'rxjs';
import { partial, flowRight } from 'lodash';

import {
	getFullMonth,
	getCurrentMonth,
	getCurrentDay,
	getCurrentYear,
	getDataFromDate,
	subtractMonth,
	addMonth,
	getMonthAndYear,
	getCurrentMonthString,
	generateDateForDateChanger,
	FullMonthObj,
	DayItem
} from './lib/date_helpers';
import {
	getCalendarTableHTML,
	closeCalendar,
	openCalendar,
	generateNavigation
} from './lib/dom_helpers';

// DOM ELEMENTS
const calendarInputElement: any | null = document.getElementById('calendar');
const calendarContainer: HTMLElement | null = document.getElementById('calendar-container');
const bodyElement: HTMLBodyElement | null = document.querySelector('body');
const closeButton: HTMLElement | null = document.getElementById('close-overlay');

const calendarInput$ = Observable.fromEvent(calendarInputElement, 'click');
const closeButton$ = Observable.fromEvent(closeButton, 'click');

const main$ = new Subject<DayItem[][]>();

// Get DayITem[][] form what is in the calendar input
const calendarData$ = calendarInput$
	.map((e: any): number => e.target.value ? parseInt(e.target.value) : Date.now())
	.map((numberForDate: number): Date => new Date(numberForDate))
	.map(getDataFromDate)
	.map(getFullMonth);

// Get month navigator from what is in the calendar input
const monthNavigator$ = calendarInput$
	.map((e: any): number => e.target.value ? parseInt(e.target.value) : Date.now())
	.map((numberForDate: number): Date => new Date(numberForDate))
	.map((date: Date) => ({
		previousDate: getMonthAndYear(subtractMonth(date)),
		currentDate: getCurrentMonthString(date),
		nextDate: getMonthAndYear(addMonth(date))
	}));

// HTML Generated from calendarData$ and monthNavigator$
const calendarHTML$ = calendarData$.map(getCalendarTableHTML);
const monthNavigatorHTML$ = monthNavigator$.map(generateNavigation);
const completeCalendarHTML$ = Observable
	.combineLatest(monthNavigatorHTML$, calendarHTML$)
	.map(resultHTML => { return resultHTML.join('') })
	.subscribe(data => openCalendar(data, calendarContainer, bodyElement));


// const calendar$ = main$
// 	.map(getDataFromDate)
// 	.map(({ currentYear, currentMonth, currentDay }) => ({ year: currentYear, month: currentMonth, day: currentDay }))
// 	.map(getFullMonth)
// 	.map(getCalendarTableHTML);

// const datePicker$ = main$
// 	.map((date: Date) => ({
// 		previousDate: getMonthAndYear(subtractMonth(date)),
// 		currentDate: getCurrentMonthString(date),
// 		nextDate: getMonthAndYear(addMonth(date))
// 	}))
// 	.map(generateNavigation);


// // http://stackoverflow.com/a/27069598/1405803
// const dayClick$ = calendar$
// 	.map(() => Observable.from(Array.from(document.querySelectorAll('.day-item'))))
// 	.flatMap(elements => Observable.from(elements))
// 	.flatMap(element => Observable.fromEvent(element, 'click'))
// 	.map((evt: any) => parseInt(evt.target.value))
// 	.map((formattedDate: number) => new Date(formattedDate));

// const dateChanger$ = datePicker$
// 	.map(() => Observable.from(Array.from(document.querySelectorAll('.date-changer'))))
// 	.flatMap(elements => Observable.from(elements))
// 	.flatMap(element => Observable.fromEvent(element, 'click'))
// 	.map((evt: any) => evt.target.value)
// 	.map(generateDateForDateChanger)
// 	.map((date: any) => getFullMonth({ year: date.year, month: date.month }));


// //////////////////
// // SIDE EFFECTS //
// //////////////////

// closeButton$.subscribe(() => closeCalendar(calendarContainer, bodyElement));
// calendarInput$.subscribe((evt: any) => evt.target.value ? main$.next(new Date(evt.target.value)) : main$.next(new Date()));

// dayClick$.subscribe(newDate => {
// 	main$.next(newDate);
// 	closeCalendar(calendarContainer, bodyElement);
// 	calendarInputElement.value = new Date(newDate).toDateString();
// });
