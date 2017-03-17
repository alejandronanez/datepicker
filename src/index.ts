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

const calendarElement: HTMLElement | null = document.getElementById('calendar');
const calendarContainer: HTMLElement | null = document.getElementById('calendar-container');
const bodyElement: HTMLBodyElement | null = document.querySelector('body');
const closeButton: HTMLElement | null = document.getElementById('close-overlay');

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

const appState = new BehaviorSubject(initialState);
const picker = appState.switchMap((state) => {
	return Observable.never();
});

function initialDateHandler(curr: InitialState, acc: InitialState) {
	return {...curr };
}

const clickCalendar = Observable
	.fromEvent<MouseEvent>(calendarElement, 'click')
	.map((evt: any) => evt.target.value) // fix this typing
	.scan(initialDateHandler, initialState)
	.subscribe((data) => generateCalendar(data, calendarContainer, bodyElement));

Observable
	.fromEvent(closeButton, 'click')
	.subscribe(() => closeOverlay(calendarContainer, bodyElement));
