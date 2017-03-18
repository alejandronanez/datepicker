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

const getDataFromStringObj = ({ year, month, day }: { year: string, month: string, day: string }) => ({
	rawDate: new Date(`${year} ${month} ${day}`),
	currentDay: getCurrentDay(new Date(`${year} ${month} ${day}`)),
	currentMonth: getCurrentMonth(new Date(`${year} ${month} ${day}`)),
	currentYear: getCurrentYear(new Date(`${year} ${month} ${day}`))
});

const getDataFromDate = (date: Date) => ({
	rawDate: new Date(date),
	currentDay: getCurrentDay(date),
	currentMonth: getCurrentMonth(date),
	currentYear: getCurrentYear(date)
})

const main$ = new Subject<Date>();

const calendarData$ = main$
	.map(getDataFromDate)
	.map(data => {
		const fullMonth = getFullMonth({
			year: data.currentYear,
			month: data.currentMonth,
			day: data.currentDay
		});

		const calendarTableHTML = getCalendarTableHTML(fullMonth);

		return calendarTableHTML;
	});

calendarData$.subscribe(data => {
	generateCalendar(data, calendarContainer, bodyElement)
});
closeButton$.subscribe(() => {
	closeOverlay(calendarContainer, bodyElement)
});
calendarInput$.subscribe((evt: any) => { // TODO: Fix this type
	evt.target.value ? main$.next(new Date(evt.target.value)) : main$.next(new Date());
});

// http://stackoverflow.com/a/27069598/1405803
const dayClick$ = calendarData$
	.map(elements => Observable.from(Array.from(document.querySelectorAll('input[type="radio"]'))))
	.flatMap(elements => Observable.from(elements))
	.flatMap(element => Observable.fromEvent(element, 'click'));

dayClick$.subscribe((evt:any) => {

	const dayDate = evt.target.value;

	console.log(dayDate);

	main$.next(new Date(dayDate));
});


