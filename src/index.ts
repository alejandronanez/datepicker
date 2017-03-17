import './scss/style.scss';

import {
	Observable,
	BehaviorSubject,
	Subject
} from 'rxjs';
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

const initialDate = new Date();

const initialState: InitialState = {
	rawDate: initialDate,
	currentDay: getCurrentDay(initialDate),
	currentMonth: getCurrentMonth(initialDate),
	currentYear: getCurrentYear(initialDate)
};

function initialDateHandler(acc: InitialState) {
	return { ...acc };
}

const calendarElement: HTMLElement | null = document.getElementById('calendar');
const calendarContainer: HTMLElement | null = document.getElementById('calendar-container');
const bodyElement: HTMLBodyElement | null = document.querySelector('body');
const closeButton: HTMLElement | null = document.getElementById('close-overlay');

const calendarInput$ = Observable.fromEvent(calendarElement, 'click');
const closeButton$ = Observable.fromEvent(closeButton, 'click');

const getDataFromStringObj = ({ year, month, day }) => ({
	rawDate: new Date(`${year} ${month} ${day}`),
	currentDay: getCurrentDay(new Date(`${year} ${month} ${day}`)),
	currentMonth: getCurrentMonth(new Date(`${year} ${month} ${day}`)),
	currentYear: getCurrentYear(new Date(`${year} ${month} ${day}`))
});

const getDataFromDate = (date: Date) => ({
	rawDate: date,
	currentDay: getCurrentDay(date),
	currentMonth: getCurrentMonth(date),
	currentYear: getCurrentYear(date)
})

const main$ = new Subject<Date>();

const calendarData$ = main$
	.map(getDataFromDate)
	.map(data => {
		return flowRight(
			getCalendarTableHTML,
			getFullMonth
		)({
			year: data.currentYear,
			month: data.currentMonth,
			day: data.currentDay
		});
	});

calendarData$.subscribe(data => generateCalendar(data, calendarContainer, bodyElement));
closeButton$.subscribe(() => closeOverlay(calendarContainer, bodyElement));
calendarInput$.subscribe((evt: any) => { // TODO: Fix this type
	const val = evt.target.value;
	val ? main$.next(new Date(val)) : main$.next(new Date());
});

// http://stackoverflow.com/a/27069598/1405803
const dayClick$ = calendarData$
	.take(1)
	.map(elements => Observable.from(Array.from(document.querySelectorAll('.day'))))
	.flatMap(elements => Observable.from(elements))
	.flatMap(element => Observable.fromEvent(element, 'click'));

dayClick$.subscribe(console.log);
