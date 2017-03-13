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
