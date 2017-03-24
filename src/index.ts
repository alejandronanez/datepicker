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
	generateDateForDateChanger
} from './lib/date_helpers';
import {
	getCalendarTableHTML,
	closeCalendar,
	openCalendar,
	generateNavigation
} from './lib/dom_helpers';

const calendarElement: any | null = document.getElementById('calendar');
const calendarContainer: HTMLElement | null = document.getElementById('calendar-container');
const bodyElement: HTMLBodyElement | null = document.querySelector('body');
const closeButton: HTMLElement | null = document.getElementById('close-overlay');

const main$ = new Subject<Date>();

const calendarInput$ = Observable.fromEvent(calendarElement, 'click');
const closeButton$ = Observable.fromEvent(closeButton, 'click');

const calendar$ = main$
	.map(getDataFromDate)
	.map(({ currentYear, currentMonth, currentDay }) => ({ year: currentYear, month: currentMonth, day: currentDay }))
	.map(getFullMonth)
	.map(getCalendarTableHTML);

const datePicker$ = main$
	.map((date: Date) => ({
		previousDate: getMonthAndYear(subtractMonth(date)),
		currentDate: getCurrentMonthString(date),
		nextDate: getMonthAndYear(addMonth(date))
	}))
	.map(generateNavigation);

Observable
	.combineLatest(datePicker$, calendar$)
	.map(resultHTML => ([resultHTML[0], resultHTML[1]].join('')))
	.subscribe(data => openCalendar(data, calendarContainer, bodyElement));

// http://stackoverflow.com/a/27069598/1405803
const dayClick$ = calendar$
	.map(elements => Observable.from(Array.from(document.querySelectorAll('.day-item'))))
	.flatMap(elements => Observable.from(elements))
	.flatMap(element => Observable.fromEvent(element, 'click'))
	.map((evt: any) => parseInt(evt.target.value))
	.map((formattedDate: number) => new Date(formattedDate));

// TODO: Prev Month Click / Next Month Click
const dateChanger$ = datePicker$
	.map(elements => Observable.from(Array.from(document.querySelectorAll('.date-changer'))))
	.flatMap(elements => Observable.from(elements))
	.flatMap(element => Observable.fromEvent(element, 'click'))
	.map((evt: any) => evt.target.value)
	.map(generateDateForDateChanger)
	.map((date: any) => getFullMonth({ year: date.year, month: date.month }))
	.subscribe(console.log);

closeButton$.subscribe(() => closeCalendar(calendarContainer, bodyElement));
calendarInput$.subscribe((evt: any) => evt.target.value ? main$.next(new Date(evt.target.value)) : main$.next(new Date()));

dayClick$.subscribe(newDate => {
	main$.next(newDate);
	closeCalendar(calendarContainer, bodyElement);
	calendarElement.value = new Date(newDate).toDateString();
});
