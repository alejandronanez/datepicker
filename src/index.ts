import { partial, flowRight } from 'lodash';

import { getFullMonth } from './lib/date_helpers';


const currentMonth = getFullMonth({
	year: 2017,
	month: 2,
	day: 10
});

console.log(currentMonth);
