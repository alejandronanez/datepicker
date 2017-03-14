import * as dedent from 'dedent-js';

import {
	renderTd
} from '../dom_helpers';

import {
	DayItem
} from '../date_helpers';


describe('DOM Helpers', () => {
	it('should render a td. No current day and No Active day', () => {
		const dayItem = new DayItem({
			dayInCalendar: 1,
			dayOfTheWeek: 1,
			isCurrentDay: false,
			isActive: false
		});
		const expectedResult = `
			<td class="day is-inactive">
				<label>
					<input
						type="radio"
						value="1"
						name="day"
					/>
					1
				</label>
			</td>
		`;
		const result = renderTd(dayItem);

		expect(dedent(result)).toEqual(dedent(expectedResult));
	});

	it('should render a td. Active day. No current day', () => {
		const dayItem = new DayItem({
			dayInCalendar: 1,
			dayOfTheWeek: 1,
			isCurrentDay: false,
			isActive: true
		});
		const expectedResult = `
			<td class="day is-active">
				<label>
					<input
						type="radio"
						value="1"
						name="day"
					/>
					1
				</label>
			</td>
		`;

		const result = renderTd(dayItem);
		expect(dedent(result)).toEqual(dedent(expectedResult));
	});

	it('should render a td. Active day and Current Day', () => {
		const dayItem = new DayItem({
			dayInCalendar: 1,
			dayOfTheWeek: 1,
			isCurrentDay: true,
			isActive: true
		});
		const expectedResult = `
			<td class="day is-active is-selected">
				<label>
					<input
						type="radio"
						value="1"
						name="day"
					/>
					1
				</label>
			</td>
		`;
		const result = renderTd(dayItem);

		expect(dedent(result)).toEqual(dedent(expectedResult));
	});

	it('should render a td. Inactive day and Current Day', () => {
		const dayItem = new DayItem({
			dayInCalendar: 1,
			dayOfTheWeek: 1,
			isCurrentDay: true,
			isActive: false
		});
		const expectedResult = `
			<td class="day is-inactive is-selected">
				<label>
					<input
						type="radio"
						value="1"
						name="day"
					/>
					1
				</label>
			</td>
		`;
		const result = renderTd(dayItem);

		expect(dedent(result)).toEqual(dedent(expectedResult));
	});
});
