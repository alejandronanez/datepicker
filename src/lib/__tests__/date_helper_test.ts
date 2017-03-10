import {
	getCurrentMonth,
	getCurrentYear,
	getCurrentDay,
	getTotalDaysInAMonth,
	getMonthArray,
	getDayInTheWeek,
	completeMonthFirstWeek,
	completeMonthLastWeek,
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

	it('completeMonthFirstWeek should return an array with the remaining days of the month', () => {
		const fakeDay = new DayItem({
			dayOfTheWeek: 6,
			dayInCalendar: 1,
			isActive: false,
			isCurrentDay: false
		});
		const month = 4;
		const year = 2017;
		const fakeMonthData = [fakeDay]
		const result = completeMonthFirstWeek(fakeMonthData, month, year);

		expect(result.length).toEqual(7);
		expect(result[0]).toBeInstanceOf(DayItem);
		expect(result[0].dayOfTheWeek).toEqual(0); // Sunday March 26/2017
		expect(result[0].dayInCalendar).toEqual(26); // Day in calendar #26
		expect(result[6].dayOfTheWeek).toEqual(6); // Sunday March 26/2017
		expect(result[6].dayInCalendar).toEqual(1); // Day in calendar #26
	});

	it('completeMonthLastWeek should return an array with the first days of the next month', () => {
		const fakeDay = new DayItem({
			dayOfTheWeek: 0,
			dayInCalendar: 31,
			isActive: false,
			isCurrentDay: false
		});
		const fakeMonthData = [fakeDay]
		const result = completeMonthLastWeek(fakeMonthData);

		expect(result.length).toEqual(7);
		expect(result[6].dayOfTheWeek).toEqual(6);
		expect(result[6].dayInCalendar).toEqual(6);
	});
});
