import { Observable } from 'rxjs';
import { partial, flowRight } from 'lodash';

import { getFullMonth } from './lib/date_helpers';
import { getCalendarTableHTML } from './lib/dom_helpers';

const calendarElement = document.getElementById('calendar');
const currentMonth = ({ year, month, day }: { year: number, month: number, day?: number}) => getFullMonth({
	year,
	month,
	day
});

if (calendarElement) {
	Observable
		.fromEvent(calendarElement, 'click')
		.subscribe(() => {
			const result = flowRight(
				getCalendarTableHTML,
				currentMonth
			)({
				year: 2017,
				month: 2,
				day: 10
			});

			console.log(result);
		});
}
