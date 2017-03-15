import { Observable } from 'rxjs';
import { partial, flowRight } from 'lodash';

import { getFullMonth } from './lib/date_helpers';
import { getCalendarTableHTML } from './lib/dom_helpers';

const calendarElement = document.getElementById('calendar');
const calendarContainer = document.getElementById('calendar-container');


if (calendarElement && calendarContainer) {
	Observable
		.fromEvent(calendarElement, 'click')
		.subscribe(() => {
			const result = flowRight(
				getCalendarTableHTML,
				getFullMonth
			)({
				year: 2017,
				month: 2,
				day: 10
			});

			calendarContainer.innerHTML = result;
		});
}
