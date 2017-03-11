import {
	getMonthArray,
	getMonthFirstWeek,
	getMonthLastWeek
} from './lib/date_helpers';

const currentMonth = getMonthArray(2017, 2, 10);
const monthArrayFirstWeek = getMonthFirstWeek(currentMonth, 2, 2017);
const completeMonthData = getMonthLastWeek(monthArrayFirstWeek);

console.log(completeMonthData);
