import './scss/style.scss';

import { Observable, Subject } from 'rxjs';
import { partial, flowRight } from 'lodash';

import {
	getFullMonth,
	getCurrentMonth,
	getCurrentDay,
	getCurrentYear,
	getDataFromDate
} from './lib/date_helpers';
import {
	getCalendarTableHTML,
	closeCalendar,
	openCalendar
} from './lib/dom_helpers';

const calendarElement: any | null = document.getElementById('calendar');
const calendarContainer: HTMLElement | null = document.getElementById('calendar-container');
const bodyElement: HTMLBodyElement | null = document.querySelector('body');
const closeButton: HTMLElement | null = document.getElementById('close-overlay');

const main$ = new Subject<Date>();

const calendarInput$ = Observable.fromEvent(calendarElement, 'click');
const closeButton$ = Observable.fromEvent(closeButton, 'click');

const calendarData$ = main$
	.map(getDataFromDate)
	.map(({ currentYear, currentMonth, currentDay }) => ({ year: currentYear, month: currentMonth, day: currentDay }))
	.map(getFullMonth)
	.map(getCalendarTableHTML);

// http://stackoverflow.com/a/27069598/1405803
const dayClick$ = calendarData$
	.map(elements => Observable.from(Array.from(document.querySelectorAll('input[type="radio"]'))))
	.flatMap(elements => Observable.from(elements))
	.flatMap(element => Observable.fromEvent(element, 'click'))
	.map((evt: any) => new Date(parseInt(evt.target.value)));

calendarData$.subscribe(data => openCalendar(data, calendarContainer, bodyElement));
closeButton$.subscribe(() => closeCalendar(calendarContainer, bodyElement));
calendarInput$.subscribe((evt: any) => evt.target.value ? main$.next(new Date(evt.target.value)) : main$.next(new Date()));

dayClick$.subscribe(newDate => {
	main$.next(newDate);
	closeCalendar(calendarContainer, bodyElement);
	calendarElement.value = new Date(newDate).toDateString();
});
