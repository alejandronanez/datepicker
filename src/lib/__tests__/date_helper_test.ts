import {
	getCurrentMonth,
	getCurrentYear,
	getCurrentDay,
	getTotalDaysInAMonth,
	getMonthArray,
	getDayInTheWeek,
	getMonthFirstWeek,
	getMonthLastWeek,
	getFullMonth,
	DayItem
} from '../date_helpers';

const january2017 = new Date('2017 01 01');

describe('Date Helpers', () => {

	it('getCurrentMonth should return the actual month', () => {
		expect(getCurrentMonth(january2017)).toBe(0);
	});

	it('getCurrentYear should return the current year', () => {
		expect(getCurrentYear(january2017)).toBe(2017);
	});

	it('getCurrentDay should return the current day', () => {
		expect(getCurrentDay(january2017)).toBe(1);
	});

	it('getTotalDaysInAMonth should return total days in a month', () => {
		expect(getTotalDaysInAMonth({ year: 2017, month: 1 })).toBe(28);
	});

	it('getDayInTheWeek should return total days in a month', () => {
		expect(getDayInTheWeek({ year: 2017, month: 2, day: 28 })).toBe(2);
	});

	it('getMonthArray should return an array with all days in a month', () => {
		const result = getMonthArray(2017, 1, 28);

		expect(result[0]).toBeInstanceOf(DayItem);
		expect(result[27].isCurrentDay).toBeTruthy();
		expect(result.length).toBe(28);
	});

	it.only('getMonthFirstWeek should return an array with the first days of the previous month', () => {
		const fakeDay = new DayItem({
			dayOfTheWeek: 6,
			dayInCalendar: 1,
			isActive: false,
			isCurrentDay: false,
			dateString: '2022-0-1'
		});
		const fakeMonthData = [fakeDay]
		const result = getMonthFirstWeek(2022, 12, fakeMonthData);

		console.log(result);

		expect(result.length).toBe(7);
		expect(result[0]).toBeInstanceOf(DayItem);
		expect(result[0].dayOfTheWeek).toBe(0); // Sunday March 26/2017
		expect(result[0].dayInCalendar).toBe(26); // Day in calendar #26
		expect(result[0].dateString).toBe('2021-12-26'); // Date String April 1 2017
		expect(result[6].dayOfTheWeek).toBe(6); // Sunday Jan 1 2022
		expect(result[6].dayInCalendar).toBe(1); // Day in calendar #26
		expect(result[6].dateString).toBe('2022-0-1'); // Date String Jan 1 2022
	});

	it('getMonthFirstWeek should return the same array if the first item is sunday', () => {
		const fakeDay = new DayItem({
			dayOfTheWeek: 0,
			dayInCalendar: 1,
			isActive: false,
			isCurrentDay: false,
			dateString: '2017-2-26'
		});
		const month = 3;
		const year = 2017;
		const fakeMonthData = [fakeDay]
		const result = getMonthFirstWeek(year, month, fakeMonthData);

		expect(result.length).toBe(1);
		expect(result).toEqual(fakeMonthData);
	});

	it('getMonthLastWeek should return an array with the first days of the next month', () => {
		const fakeDay = new DayItem({
			dayOfTheWeek: 0,
			dayInCalendar: 31,
			isActive: false,
			isCurrentDay: false,
			dateString: '2017-11-31'
		});
		const fakeMonthData = [fakeDay]
		const result = getMonthLastWeek(2017, 11, fakeMonthData);

		console.log(result);

		expect(result.length).toBe(7);
		expect(result[6].dayOfTheWeek).toBe(6);
		expect(result[6].dayInCalendar).toBe(6);
		expect(result[0].dateString).toBe('2017-11-31');
		expect(result[6].dateString).toBe('2018-1-6');
	});

	it('getMonthLastWeek should return the same array if the last item is saturday', () => {
		const fakeDay = new DayItem({
			dayOfTheWeek: 6,
			dayInCalendar: 30,
			isActive: false,
			isCurrentDay: false,
			dateString: '2017-8-30'
		});
		const fakeMonthData = [fakeDay]
		const result = getMonthLastWeek(2017, 8, fakeMonthData);

		expect(result.length).toBe(1);
		expect(result).toEqual(fakeMonthData);
	});

	it('getFullMonth should return the whole month including dates in the past and in the future for previous/next months', () => {
		// March 10 2017
		const result = getFullMonth({ year: 2017, month: 2, day: 10 });
		const firstDay = new DayItem({
			dayInCalendar: 26,
			dayOfTheWeek: 0,
			isActive: true,
			isCurrentDay: false,
			dateString: '2017-2-26'
		});
		const lastDay = new DayItem({
			dayInCalendar: 6,
			dayOfTheWeek: 1,
			isActive: true,
			isCurrentDay: false,
			dateString: '2017-2-26'
		});

		expect(result.length).toEqual(5);
		expect(result[0].length).toEqual(7);
	});
});
