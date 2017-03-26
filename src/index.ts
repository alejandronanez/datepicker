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

const main$ = new Subject();

// Calendar Input Element Stream
const calendarInput$ = Observable
	.fromEvent(calendarInputElement, 'click')
	.map((e: any): string => e.target.value)
	.map((value: string): any => value ? getDataFromDate(new Date(value)) : { month: getCurrentMonth(new Date()), year: getCurrentYear(new Date()) })
	.subscribe(value => main$.next(value));

// Month Navigator Stream
const monthNavigator$ = main$
	.map((data: any) => new Date(data.year, data.month))
	.map((date: Date) => ({
		previousDate: getMonthAndYear(subtractMonth(date)),
		currentDate: getCurrentMonthString(date),
		nextDate: getMonthAndYear(addMonth(date))
	}));

// HTML Streams
const calendarHTML$ = main$
	.map(getFullMonth)
	.map(getCalendarTableHTML);
const monthNavigatorHTML$ = monthNavigator$.map(generateNavigation);
const completeCalendarHTML$ = Observable
	.combineLatest(monthNavigatorHTML$, calendarHTML$)
	.map(resultHTML => resultHTML.join(''));

completeCalendarHTML$.subscribe(data => openCalendar(data, calendarContainer, bodyElement));

// Calendar Day Stream
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

// Month changer < [Month] > Streams
const dateChangerArrows$ = completeCalendarHTML$
	.map(() => Observable.from(Array.from(document.querySelectorAll('.date-changer'))))
	.flatMap(elements => Observable.from(elements))
	.flatMap(element => Observable.fromEvent(element, 'click'))
	.map((evt: any) => {
		evt.stopPropagation();

		const arrowValue = evt.target.value;
		const [year, month] = arrowValue.split('-');

		return new Date(year, month);
	})
	.map((date: Date) => ({
		month: getCurrentMonth(date),
		year: getCurrentYear(date)
	}));

dateChangerArrows$.subscribe(value => main$.next(value));

// Close Calendar Stream
closeButton$.subscribe(() => closeCalendar(calendarContainer, bodyElement));
