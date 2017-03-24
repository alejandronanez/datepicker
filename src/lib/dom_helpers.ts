import {
	partial,
	flowRight,
	chunk
} from 'lodash';

import {
	DayItem
} from './date_helpers';

export function renderTd(dayItem: DayItem): string {
	const tdClassNames = [
		'day',
		dayItem.isActive ? 'is-active' : 'is-inactive',
		dayItem.isCurrentDay ? 'is-selected' : null
	]
	.filter(c => typeof c === 'string')
	.join(' ');

	return `
		<td class="${tdClassNames}">
			<label>
				<input
					type="radio"
					value="${dayItem.dateString}"
					name="day"
					class="day-item"
				/>
				<span>${dayItem.dayInCalendar}</span>
			</label>
		</td>
	`;
}

export function renderTr(tds: string[]): string {
	return `<tr>${tds.join('')}</tr>`;
}

export function renderTable(trs: string[]): string {
	const weekdaysRow = '<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>';
	return `<table>${weekdaysRow}${trs.join('')}</table>`;
}

export function getCalendarTableHTML(dayItems: DayItem[][]) {
	const tds = dayItems.map(dayItem => dayItem.map(renderTd));
	const trs = tds.map(renderTr);

	return renderTable(trs);
}

export function closeCalendar(calendarNode: HTMLElement, bodyNode: HTMLElement) {
	calendarNode.innerHTML = '';
	bodyNode.classList.remove('is-open');
}

export function openCalendar(data: string, calendarNode: HTMLElement, bodyNode: HTMLElement) {
	calendarNode.innerHTML = data;
	bodyNode.classList.add('is-open');
}

export function generateNavigation({
	previousDate,
	currentDate,
	nextDate
}: {
	previousDate: string,
	currentDate: string,
	nextDate: string
}): string {
	return `
		<div class="navigator">
			<label class="month-arrows" for="previous-month">
				<input type="radio" name="name-navigator" id="previous-month" class="date-changer" value="${previousDate}" />
				<span><</span>
			</label>
			<h2>${currentDate}</h2>
			<label class="month-arrows" for="next-month">
				<input type="radio" name="name-navigator" id="next-month" class="date-changer" value="${nextDate}" />
				<span>></span>
			</label>
		</div>
	`;
}
