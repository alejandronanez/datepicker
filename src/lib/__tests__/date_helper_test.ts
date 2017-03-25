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
	getDataFromDate,
	getCurrentMonthString,
	getMonthAndYear,
	subtractMonth,
	addMonth,
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

	it('getMonthFirstWeek should return an array with the first days of the previous month', () => {
		const jan012022 = 1641013200000;
		const dec262021 = 1640494800000;
		const fakeDay = new DayItem({
			dayOfTheWeek: 6,
			dayInCalendar: 1,
			isActive: false,
			isCurrentDay: false,
			dateString: jan012022
		});
		const fakeMonthData = [fakeDay]
		const result = getMonthFirstWeek(2022, 12, fakeMonthData);

		expect(result.length).toBe(7);
		expect(result[0]).toBeInstanceOf(DayItem);
		expect(result[0].dayOfTheWeek).toBe(0);
		expect(result[0].dayInCalendar).toBe(26);
		expect(result[0].dateString).toEqual(dec262021);
		expect(result[6].dayOfTheWeek).toBe(6);
		expect(result[6].dayInCalendar).toBe(1);
		expect(result[6].dateString).toEqual(jan012022);
	});

	it('getMonthFirstWeek should return the same array if the first item is sunday', () => {
		const feb22017 = 1488085200000;
		const fakeDay = new DayItem({
			dayOfTheWeek: 0,
			dayInCalendar: 1,
			isActive: false,
			isCurrentDay: false,
			dateString: feb22017
		});
		const month = 3;
		const year = 2017;
		const fakeMonthData = [fakeDay]
		const result = getMonthFirstWeek(year, month, fakeMonthData);

		expect(result.length).toBe(1);
		expect(result).toEqual(fakeMonthData);
	});

	it('getMonthLastWeek should return an array with the first days of the next month', () => {
		const dec2017 = 1514696400000;
		const fakeDay = new DayItem({
			dayOfTheWeek: 0,
			dayInCalendar: 31,
			isActive: false,
			isCurrentDay: false,
			dateString: dec2017
		});
		const fakeMonthData = [fakeDay]
		const result = getMonthLastWeek(2017, 11, fakeMonthData);

		expect(result.length).toBe(7);
		expect(result[6].dayOfTheWeek).toBe(6);
		expect(result[6].dayInCalendar).toBe(6);
		expect(result[0].dateString).toBe(1514696400000); // sun dec 31 2017
		expect(result[6].dateString).toBe(1515214800000); // sat jan 06 2018
	});

	it('getMonthLastWeek should return the same array if the last item is saturday', () => {
		const aug302017 = 1504069200000;
		const fakeDay = new DayItem({
			dayOfTheWeek: 6,
			dayInCalendar: 30,
			isActive: false,
			isCurrentDay: false,
			dateString: aug302017
		});
		const fakeMonthData = [fakeDay]
		const result = getMonthLastWeek(2017, 8, fakeMonthData);

		expect(result.length).toBe(1);
		expect(result).toEqual(fakeMonthData);
	});

	it('getFullMonth should return the whole month including dates in the past and in the future for previous/next months', () => {
		const result = getFullMonth({ year: 2017, month: 2, day: 10 });

		expect(result.length).toEqual(5);
		expect(result[0].length).toEqual(7);
	});

	it('should return the right object after passing a valid date', () => {
		const date = new Date(2017, 2, 19);
		const expectedResult = {
			day: 19,
			month: 2,
			year: 2017
		};

		expect(getDataFromDate(date)).toEqual(expectedResult);
	});

	it('should test subtractMonth', () => {
		const date = new Date(2017, 0, 1);
		const result = subtractMonth(date);

		expect(result.getMonth()).toEqual(11);
		expect(result.getFullYear()).toEqual(2016);
	});

	it('should test addMonth', () => {
		const date = new Date(2017, 11, 1);
		const result = addMonth(date);

		expect(result.getMonth()).toEqual(0);
		expect(result.getFullYear()).toEqual(2018);
	});

	it('should test getMonthAndYear', () => {
		const date = new Date(2017, 2, 19);

		expect(getMonthAndYear(date)).toEqual('2017-2');
	});

	it('should test getCurrentMonthString', () => {
		const date = new Date(2017, 2, 10);

		expect(getCurrentMonthString(date)).toEqual('Mar 2017');
	});
});
