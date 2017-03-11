import {
	getMonthArray,
	completeMonthFirstWeek,
	completeMonthLastWeek
} from './lib/date_helpers';

const monthArray = getMonthArray({ year: 2017, month: 2, day: 10 });
const two = completeMonthFirstWeek(monthArray, 3, 2017);
const three = completeMonthLastWeek(two);

console.log(monthArray);
