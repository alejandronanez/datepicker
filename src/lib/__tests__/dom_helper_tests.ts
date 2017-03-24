import * as dedent from 'dedent-js';

import {
	renderTd,
	renderTr,
	renderTable,
	generateNavigation
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
			isActive: false,
			dateString: 12345
		});
		const expectedResult = `
			<td class="day is-inactive">
				<label>
					<input
						type="radio"
						value="12345"
						name="day"
						class="day-item"
					/>
					<span>1</span>
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
			isActive: true,
			dateString: 12345
		});
		const expectedResult = `
			<td class="day is-active">
				<label>
					<input
						type="radio"
						value="12345"
						name="day"
						class="day-item"
					/>
					<span>1</span>
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
			isActive: true,
			dateString: 12345
		});
		const expectedResult = `
			<td class="day is-active is-selected">
				<label>
					<input
						type="radio"
						value="12345"
						name="day"
						class="day-item"
					/>
					<span>1</span>
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
			isActive: false,
			dateString: 12345
		});
		const expectedResult = `
			<td class="day is-inactive is-selected">
				<label>
					<input
						type="radio"
						value="12345"
						name="day"
						class="day-item"
					/>
					<span>1</span>
				</label>
			</td>
		`;
		const result = renderTd(dayItem);

		expect(dedent(result)).toEqual(dedent(expectedResult));
	});

	it('should render a tr', () => {
		const result = renderTr(['<td>foo</td>', '<td>bar</td>']);
		const expectedResult = '<tr><td>foo</td><td>bar</td></tr>'

		expect(result).toEqual(expectedResult);
	});

	it('should render a table', () => {
		const result = renderTable(['<tr><td>foo</td></tr>', '<tr><td>bar</td></tr>']);
		const weekdaysRow = '<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>';
		const expectedResult = `<table>${weekdaysRow}<tr><td>foo</td></tr><tr><td>bar</td></tr></table>`

		expect(result).toEqual(expectedResult);
	});

	it('generateNavigation', () => {
		const options = {
			previousDate: '123',
			currentDate: '456',
			nextDate: '789'
		};
		const expectedResult = `
			<div class="navigator">
				<label class="month-arrows" for="previous-month">
					<input type="radio" name="name-navigator" id="previous-month" class="date-changer" value="123" />
					<span><</span>
				</label>
				<h2>456</h2>
				<label class="month-arrows" for="next-month">
					<input type="radio" name="name-navigator" id="next-month" class="date-changer" value="789" />
					<span>></span>
				</label>
			</div>
		`;

		expect(dedent(generateNavigation(options))).toEqual(dedent(expectedResult));
	});
});
