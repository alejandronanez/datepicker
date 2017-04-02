import './scss/style.scss';

import {
	Observable,
	Subject,
	Subscription
} from 'rxjs';

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
	// Interfaces
	FullDate,
	DayItem,
	MonthChanger
} from './lib/date_helpers';
import {
	getCalendarTableHTML,
	closeCalendar,
	openCalendar,
	generateNavigation
} from './lib/dom_helpers';

// DOM ELEMENTS
const calendarInputElement: any = document.getElementById('calendar'); // TODO: Fix 'any'
const calendarContainer: HTMLElement | null = document.getElementById('calendar-container');
const bodyElement: HTMLBodyElement | null = document.querySelector('body');
const closeButton: any = document.querySelector('.close-overlay'); // TODO: Fix 'any'

const closeButton$ = Observable.fromEvent(closeButton, 'click');

const main$: Subject<any> = new Subject();

// Calendar Input Element Stream
const calendarInput$: Subscription = Observable
	.fromEvent(calendarInputElement, 'click')
	// TODO: Fix 'any'
	.map((e: any): string => e.target.value)
	// TODO: Fix 'any'
	.map((value: string): any => value ? getDataFromDate(new Date(value)) : { month: getCurrentMonth(new Date()), year: getCurrentYear(new Date()) })
	.subscribe(value => main$.next(value));

// Month Navigator Stream
const monthNavigator$ = main$
	.map((data: FullDate) => new Date(data.year, data.month))
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
	.flatMap((element) => Observable.fromEvent(element, 'click'))
	// TODO: Fix 'any'
	.map((evt: any) => parseInt(evt.target.value))
	.map((formattedDate: number) => new Date(formattedDate));

dayClick$.subscribe((newDate: Date) => {
	closeCalendar(calendarContainer, bodyElement);
	calendarInputElement.value = new Date(newDate).toDateString();
});

// Month changer < [Month] > Streams
const dateChangerArrows$ = completeCalendarHTML$
	.map(() => Observable.from(Array.from(document.querySelectorAll('.date-changer'))))
	.flatMap(elements => Observable.from(elements))
	.flatMap(element => Observable.fromEvent(element, 'click'))
	// TODO: Fix 'any'
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
