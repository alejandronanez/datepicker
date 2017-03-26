import { chunk } from 'lodash';

interface DateObj {
	year: number;
	month: number;
};

interface FullDateObj {
	year: number;
	month: number;
	day: number
};

export interface FullMonthObj {
	year: number;
	month: number;
	day?: number
};

interface DayItemInterface {
	dayOfTheWeek: number;
	dayInCalendar: number;
	isActive: boolean;
	isCurrentDay: boolean;
	dateString: number;
};

const MAX_DAY_OF_WEEK: number = 6;
const MIN_DAY_OF_WEEK: number = 0;

export class DayItem implements DayItemInterface {
	dayOfTheWeek: number;
	dayInCalendar: number;
	isActive: boolean;
	isCurrentDay: boolean;
	dateString: number;

	constructor({
		dayOfTheWeek,
		dayInCalendar,
		isActive,
		isCurrentDay,
		dateString
	}: DayItemInterface) {
		this.dayOfTheWeek = dayOfTheWeek;
		this.dayInCalendar = dayInCalendar;
		this.isActive = isActive;
		this.isCurrentDay = isCurrentDay;
		this.dateString = dateString;
	}
};

export function getCurrentMonth(date: Date): number {
	return date.getMonth();
}

export function getCurrentYear(date: Date): number {
	return date.getFullYear();
}

export function getCurrentDay(date: Date): number {
	return date.getDate();
}

export function getTotalDaysInAMonth({ year, month }: DateObj): number {
	return new Date(year, month + 1, 0).getDate();
}

export function getDayInTheWeek({ year, month, day }: FullDateObj): number {
	return new Date(year, month, day).getDay();
};

export function getMonthArray(year: number, month: number, day: number | null): DayItem[] {
	const date = day ? new Date(year, month, day) : new Date(year, month);
	const totalDaysInMonth = getTotalDaysInAMonth({ year, month });
	const currentDay = day ? getCurrentDay(date): -1;

	return Array
		.apply(null, { length: totalDaysInMonth })
		.map((day: null, index: number) => (
			new DayItem({
				dayOfTheWeek: getDayInTheWeek({ year, month, day: index + 1 }),
				dayInCalendar: index + 1,
				isActive: true,
				isCurrentDay: index + 1 === currentDay,
				dateString: new Date(year, month, index + 1).getTime()
			})
		));
}

export function getMonthFirstWeek(currentYear: number, currentMonth: number, monthData: DayItem[]): DayItem[] {
	const { dayOfTheWeek } = monthData[0];
	const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

	if (dayOfTheWeek === MIN_DAY_OF_WEEK) {
		return monthData;
	}

	const totalDaysInPreviousMonth: number = getTotalDaysInAMonth({ year: currentYear, month: previousMonth });
	let totalDaysInPreviousMonthIndex: number = totalDaysInPreviousMonth - (dayOfTheWeek - 1);

	const firstDays = Array
		.apply(null, { length: dayOfTheWeek })
		.map((day: null, index: number) => {
			const year = previousMonth === 11 ? currentYear - 1 : currentYear;
			const dayItem = new DayItem({
				dayOfTheWeek: index,
				dayInCalendar: totalDaysInPreviousMonthIndex,
				isActive: true,
				isCurrentDay: false,
				dateString: new Date(year, previousMonth, totalDaysInPreviousMonthIndex).getTime()
			});

			totalDaysInPreviousMonthIndex++;

			return dayItem;
		});

	return [...firstDays, ...monthData];
}

export function getMonthLastWeek(currentYear: number, currentMonth: number, monthData: DayItem[]): DayItem[] {
	const { dayOfTheWeek } = monthData[monthData.length - 1];

	if (dayOfTheWeek === MAX_DAY_OF_WEEK) {
		return monthData;
	}

	let dayIndex = dayOfTheWeek + 1;
	const arrayLength = 7 - (dayIndex);

	const lastDays = Array
		.apply(null, { length: arrayLength })
		.map((day: null, index: number) => {
			const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
			const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
			const dayItem = new DayItem({
				dayOfTheWeek: dayIndex,
				dayInCalendar: index + 1,
				isActive: true,
				isCurrentDay: false,
				dateString: new Date(nextYear, nextMonth, index + 1).getTime()
			});

			dayIndex++;

			return dayItem;
		});

	return [...monthData, ...lastDays];
}

export function splitMonthArrayInChunks(monthData: DayItem[]) {
	// Each week have 7 days
	return chunk(monthData, 7);
}

export function getFullMonth({ year, month, day = null }: FullMonthObj): DayItem[][] {
	const monthArray = getMonthArray(year, month, day);
	const monthFirstWeek = getMonthFirstWeek(year, month, monthArray);
	const monthLastWeek = getMonthLastWeek(year, month, monthFirstWeek);
	const result = splitMonthArrayInChunks(monthLastWeek);

	return result
}

export function getDataFromDate(date: Date) {
	return {
		day: getCurrentDay(date),
		month: getCurrentMonth(date),
		year: getCurrentYear(date)
	};
};

export function subtractMonth(date: Date): Date {
	const newDate = new Date(date.getTime());

	newDate.setMonth(newDate.getMonth() - 1);

	return new Date(newDate);
}

export function addMonth(date: Date): Date {
	const newDate = new Date(date.getTime());

	newDate.setMonth(newDate.getMonth() + 1);

	return new Date(newDate);
}

export function getMonthAndYear(date: Date): string {
	return `${getCurrentYear(date)}-${getCurrentMonth(date)}`;
}

export function getCurrentMonthString(date: Date): string {
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];

	return `${months[getCurrentMonth(date)]} ${getCurrentYear(date)}`;
}

export function generateDateForDateChanger(date: string) {
	const splitDate = date.split('-').map(x => parseInt(x));

	return {
		year: splitDate[0],
		month: splitDate[1]
	}
}
