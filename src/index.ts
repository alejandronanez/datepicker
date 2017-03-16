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
import { getCalendarTableHTML } from './lib/dom_helpers';

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

if (calendarElement && calendarContainer && bodyElement && closeButton) {
	Observable
	.fromEvent(calendarElement, 'click')
	.subscribe(() => {
		const result = flowRight(
			getCalendarTableHTML,
			getFullMonth
		)({
			year: 2017,
			month: 2,
			day: 10
		});

		calendarContainer.innerHTML = result;
		bodyElement.classList.add('is-open');
	});

	Observable
		.fromEvent(closeButton, 'click')
		.subscribe(() => {
			bodyElement.classList.remove('is-open');
			calendarContainer.innerHTML = '';
		});


}
