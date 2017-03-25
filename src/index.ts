import './scss/style.scss';

import { Observable, Subject } from 'rxjs';

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

const closeButton$ = Observable.fromEvent(closeButton, 'click');

const main$ = new Subject<DayItem[][]>();

// Get DayITem[][] form what is in the calendar input
const calendarInput$ = Observable
	.fromEvent(calendarInputElement, 'click')
	.map((e: any): string => e.target.value ? e.target.value : new Date().toDateString())
	.map((dateString: string): Date => new Date(dateString));

const calendarData$ = calendarInput$
	.map(getDataFromDate)
	.map(getFullMonth);

// Get month navigator from what is in the calendar input
const monthNavigator$ = calendarInput$
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
	.map(resultHTML => resultHTML.join(''));

completeCalendarHTML$.subscribe(data => openCalendar(data, calendarContainer, bodyElement));

// Listen for clicks on days of the calendar
// http://stackoverflow.com/a/27069598/1405803
const dayClick$ = completeCalendarHTML$
	.map(() => Observable.from(Array.from(document.querySelectorAll('.day-item'))))
	.flatMap(elements => Observable.from(elements))
	.flatMap(element => Observable.fromEvent(element, 'click'))
	.map((evt: any) => parseInt(evt.target.value))
	.map((formattedDate: number) => new Date(formattedDate));

dayClick$.subscribe(newDate => {
	closeCalendar(calendarContainer, bodyElement);
	calendarInputElement.value = new Date(newDate).toDateString();
});

// Listen for clicks on date changer < [Month] >
const dateChangerArrows$ = completeCalendarHTML$
	.map(() => Observable.from(Array.from(document.querySelectorAll('.date-changer'))))
	.flatMap(elements => Observable.from(elements))
	.flatMap(element => Observable.fromEvent(element, 'click'))
	.map((evt: any) => {
		const arrowValue = evt.target.value;

		debugger;

		return arrowValue;
	})
	.map((formattedDate: number) => new Date(formattedDate));

dateChangerArrows$.subscribe(console.log);
// Close calendar on X
closeButton$.subscribe(() => closeCalendar(calendarContainer, bodyElement));

