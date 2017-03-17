import './scss/style.scss';

import {
	Observable,
	BehaviorSubject
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


calendarInput$
	.map((evt: any) => evt.target.value) // fix this typing
	.scan(initialDateHandler, initialState)
	.map(state => {
		const {
			currentDay,
			currentMonth,
			currentYear
		} = state;

		return flowRight(
			getCalendarTableHTML,
			getFullMonth
		)({
			year: currentYear,
			month: currentMonth,
			day: currentDay
		});
	})
	.subscribe((data) => generateCalendar(data, calendarContainer, bodyElement));


Observable
	.fromEvent(closeButton, 'click')
	.subscribe(() => closeOverlay(calendarContainer, bodyElement));
