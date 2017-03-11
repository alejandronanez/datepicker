interface DateObj {
	year: number;
	month: number;
};

interface FullDateObj {
	year: number;
	month: number;
	day: number
};

interface DayItemInterface {
	dayOfTheWeek: number;
	dayInCalendar: number;
	isActive: boolean;
	isCurrentDay: boolean;
};

const MAX_DAY_OF_WEEK: number = 6;
const MIN_DAY_OF_WEEK: number = 0;

export class DayItem implements DayItemInterface {
	dayOfTheWeek: number;
	dayInCalendar: number;
	isActive: boolean;
	isCurrentDay: boolean;

	constructor({
		dayOfTheWeek,
		dayInCalendar,
		isActive,
		isCurrentDay
	}: DayItemInterface) {
		this.dayOfTheWeek = dayOfTheWeek;
		this.dayInCalendar = dayInCalendar;
		this.isActive = isActive;
		this.isCurrentDay = isCurrentDay;
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
	return new Date(year, month, 0).getDate();
}

export function getDayInTheWeek({ year, month, day }: FullDateObj): number {
	return new Date(year, month, day).getDay();
};

export function getMonthArray({ year, month, day }: FullDateObj): DayItem[] {
	const date = new Date(`${year} ${month} ${day}`);
	const totalDaysInMonth = getTotalDaysInAMonth({ year, month });
	const currentDay = getCurrentDay(date) - 1;

	return Array
		.apply(null, { length: totalDaysInMonth })
		.map((day: null, index: number) => (
			new DayItem({
				dayOfTheWeek: getDayInTheWeek({ year, month, day: index }),
				dayInCalendar: index,
				isActive: true,
				isCurrentDay: index === currentDay
			})
		));
}

export function completeMonthFirstWeek(monthData: DayItem[], currentMonth: number, currentYear: number): DayItem[] {
	const { dayOfTheWeek } = monthData[0];
	const previousMonth = currentMonth - 1;

	if (dayOfTheWeek === MIN_DAY_OF_WEEK) {
		return monthData;
	}

	const totalDaysInPreviousMonth: number = getTotalDaysInAMonth({ year: currentYear, month: previousMonth });
	let totalDaysInPreviousMonthIndex: number = totalDaysInPreviousMonth - (dayOfTheWeek - 1);

	const firstDays = Array
		.apply(null, { length: dayOfTheWeek })
		.map((day: null, index: number) => {
			const dayItem = new DayItem({
				dayOfTheWeek: index,
				dayInCalendar: totalDaysInPreviousMonthIndex,
				isActive: false,
				isCurrentDay: false
			});

			totalDaysInPreviousMonthIndex++;

			return dayItem;
		});

	return [...firstDays, ...monthData];
}

export function completeMonthLastWeek(monthData: DayItem[]): DayItem[] {
	const { dayOfTheWeek } = monthData[monthData.length - 1];

	if (dayOfTheWeek === MAX_DAY_OF_WEEK) {
		return monthData;
	}

	let dayIndex = dayOfTheWeek + 1;
	const arrayLength = 7 - (dayIndex);

	const lastDays = Array
		.apply(null, { length: arrayLength })
		.map((day: null, index: number) => {
			const dayItem = new DayItem({
				dayOfTheWeek: dayIndex,
				dayInCalendar: dayIndex,
				isActive: false,
				isCurrentDay: false
			});

			dayIndex++;

			return dayItem;
		});

	return [...monthData, ...lastDays];
}


