import {
	getMonthArray2,
	completeMonthFirstWeek,
	completeMonthLastWeek
} from './lib/date_helpers';

const monthArray = getMonthArray2(2017, 2)(10);
const two = completeMonthFirstWeek(monthArray, 2, 2017);
const three = completeMonthLastWeek(two);

console.log(three);
