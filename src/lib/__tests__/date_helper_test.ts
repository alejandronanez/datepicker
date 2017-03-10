import {
	getCurrentMonth,
	getCurrentYear,
	getCurrentDay,
	getTotalDaysInAMonth,
	getMonthArray,
	getDayInTheWeek,
	DayItem
} from '../date_helpers';

const january2017 = new Date('2017 01 01');

describe('Date Helpers', () => {

	it('getCurrentMonth should return the actual month', () => {
		expect(getCurrentMonth(january2017)).toEqual(0);
	});

	it('getCurrentYear should return the current year', () => {
		expect(getCurrentYear(january2017)).toEqual(2017);
	});

	it('getCurrentDay should return the current day', () => {
		expect(getCurrentDay(january2017)).toEqual(1);
	});

	it('getTotalDaysInAMonth should return total days in a month', () => {
		expect(getTotalDaysInAMonth({ year: 2017, month: 2 })).toEqual(28);
	});

	it('getDayInTheWeek should return total days in a month', () => {
		expect(getDayInTheWeek({ year: 2017, month: 2, day: 1 })).toEqual(3);
	});

	it('getMonthArray should return an array with all days in a month', () => {
		const result = getMonthArray({ year: 2017, month: 2, day: 1 });

		expect(result[0]).toBeInstanceOf(DayItem);
		expect(result[0].isCurrentDay).toBeTruthy();
		expect(result.length).toEqual(28);
	});
});
