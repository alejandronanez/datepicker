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
					value="${dayItem.dayInCalendar}"
					name="day"
				/>
				${dayItem.dayInCalendar}
			</label>
		</td>
	`;
}

export function renderTr(tds: string[]): string {
	return `<tr>${tds.join('')}</tr>`;
}

export function renderTable(trs: string[]): string {
	return `<table>${trs.join('')}</table>`;
}

export function getCalendarTableHTML(dayItems: DayItem[][]) {
	const tds = dayItems.map(dayItem => dayItem.map(renderTd));
	const trs = tds.map(renderTr);

	return renderTable(trs);
}
