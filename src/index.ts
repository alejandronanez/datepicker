import './scss/style.scss';

import { Observable, Subject } from 'rxjs';
import { partial, flowRight } from 'lodash';

import {
	getFullMonth,
	getCurrentMonth,
	getCurrentDay,
	getCurrentYear
} from './lib/date_helpers';
import {
	getCalendarTableHTML,
	closeOverlay,
	generateCalendar
} from './lib/dom_helpers';

type InitialState = {
	rawDate: Date,
	currentDay: number,
	currentMonth: number,
	currentYear: number
}

const calendarElement: any | null = document.getElementById('calendar');
const calendarContainer: HTMLElement | null = document.getElementById('calendar-container');
const bodyElement: HTMLBodyElement | null = document.querySelector('body');
const closeButton: HTMLElement | null = document.getElementById('close-overlay');

const calendarInput$ = Observable.fromEvent(calendarElement, 'click');
const closeButton$ = Observable.fromEvent(closeButton, 'click');

const main$ = new Subject<Date>();

const getDataFromDate = (date: Date) => ({
	rawDate: new Date(date),
	currentDay: getCurrentDay(date),
	currentMonth: getCurrentMonth(date),
	currentYear: getCurrentYear(date)
})

const calendarData$ = main$
	.map(getDataFromDate)
	.map(data => {
		const fullMonth = getFullMonth({
			year: data.currentYear,
			month: data.currentMonth,
			day: data.currentDay
		});

		return getCalendarTableHTML(fullMonth);
	});

// http://stackoverflow.com/a/27069598/1405803
const dayClick$ = calendarData$
	.map(elements => Observable.from(Array.from(document.querySelectorAll('input[type="radio"]'))))
	.flatMap(elements => Observable.from(elements))
	.flatMap(element => Observable.fromEvent(element, 'click'));

calendarData$.subscribe(data => generateCalendar(data, calendarContainer, bodyElement));
closeButton$.subscribe(() => closeOverlay(calendarContainer, bodyElement));
calendarInput$.subscribe((evt: any) => evt.target.value ? main$.next(new Date(evt.target.value)) : main$.next(new Date()));

dayClick$.subscribe((evt:any) => {
	const newDate = new Date(evt.target.value)
	console.log(newDate);

	main$.next(newDate);
	closeOverlay(calendarContainer, bodyElement);
	calendarElement.value = new Date(newDate).getTime();
});
