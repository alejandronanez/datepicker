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

export function completeMonthFirstWeek(monthData: DayItem[], month: number, year: number): DayItem[] {
	const { dayOfTheWeek } = monthData[0];

	if (dayOfTheWeek === 0) {
		return monthData;
	}

	const totalDaysInPreviousMonth = getTotalDaysInAMonth({ year, month: month - 1 });
	const firstDays = [];
	let totalDaysInPreviousMonthIndex = totalDaysInPreviousMonth - (dayOfTheWeek - 1);

	for (let index = 0; index < dayOfTheWeek; index++) {
		firstDays.push(
			new DayItem({
				dayOfTheWeek: index,
				dayInCalendar: totalDaysInPreviousMonthIndex,
				isActive: false,
				isCurrentDay: false
			})
		);

		totalDaysInPreviousMonthIndex++;
	}

	return [...firstDays, ...monthData];
}

export function completeMonthLastWeek(monthData: DayItem[]): DayItem[] {
	const { dayOfTheWeek } = monthData[monthData.length - 1];

	if (dayOfTheWeek === 6) {
		return monthData;
	}

	const lastDays = [];

	for (let index = dayOfTheWeek + 1; index <= 6; index++) {
		lastDays.push(
			new DayItem({
				dayOfTheWeek: index,
				dayInCalendar: index,
				isActive: false,
				isCurrentDay: false
			})
		);
	}

	return [...monthData, ...lastDays];
}


