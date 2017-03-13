import { Observable } from 'rxjs';
import { partial, flowRight } from 'lodash';

import { getFullMonth } from './lib/date_helpers';

const calendarElement = document.getElementById('calendar');


const currentMonth = getFullMonth({
	year: 2017,
	month: 2,
	day: 10
});

if (calendarElement) {
	Observable
		.fromEvent(calendarElement, 'click')
		.subscribe(() => console.log(currentMonth));
}
