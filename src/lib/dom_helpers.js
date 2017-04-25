"use strict";
exports.__esModule = true;
function renderTd(dayItem) {
    var tdClassNames = [
        'day',
        dayItem.isActive ? 'is-active' : 'is-inactive',
        dayItem.isCurrentDay ? 'is-selected' : null
    ]
        .filter(function (c) { return typeof c === 'string'; })
        .join(' ');
    return "\n\t\t<td class=\"" + tdClassNames + "\">\n\t\t\t<label>\n\t\t\t\t<input\n\t\t\t\t\ttype=\"radio\"\n\t\t\t\t\tvalue=\"" + dayItem.dateString + "\"\n\t\t\t\t\tname=\"day\"\n\t\t\t\t\tclass=\"day-item\"\n\t\t\t\t/>\n\t\t\t\t<span>" + dayItem.dayInCalendar + "</span>\n\t\t\t</label>\n\t\t</td>\n\t";
}
exports.renderTd = renderTd;
function renderTr(tds) {
    return "<tr>" + tds.join('') + "</tr>";
}
exports.renderTr = renderTr;
function renderTable(trs) {
    var weekdaysRow = '<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>';
    return "<table>" + weekdaysRow + trs.join('') + "</table>";
}
exports.renderTable = renderTable;
function getCalendarTableHTML(dayItems) {
    var tds = dayItems.map(function (dayItem) { return dayItem.map(renderTd); });
    var trs = tds.map(renderTr);
    return renderTable(trs);
}
exports.getCalendarTableHTML = getCalendarTableHTML;
function closeCalendar(calendarNode, bodyNode) {
    calendarNode.innerHTML = '';
    bodyNode.classList.remove('is-open');
}
exports.closeCalendar = closeCalendar;
function openCalendar(data, calendarNode, bodyNode) {
    calendarNode.innerHTML = data;
    bodyNode.classList.add('is-open');
}
exports.openCalendar = openCalendar;
function generateNavigation(_a) {
    var previousDate = _a.previousDate, currentDate = _a.currentDate, nextDate = _a.nextDate;
    return "\n\t\t<div class=\"navigator\">\n\t\t\t<label class=\"month-arrows\" for=\"previous-month\">\n\t\t\t\t<input type=\"radio\" name=\"name-navigator\" id=\"previous-month\" class=\"date-changer\" value=\"" + previousDate + "\" />\n\t\t\t\t<span><</span>\n\t\t\t</label>\n\t\t\t<h2>" + currentDate + "</h2>\n\t\t\t<label class=\"month-arrows\" for=\"next-month\">\n\t\t\t\t<input type=\"radio\" name=\"name-navigator\" id=\"next-month\" class=\"date-changer\" value=\"" + nextDate + "\" />\n\t\t\t\t<span>></span>\n\t\t\t</label>\n\t\t</div>\n\t";
}
exports.generateNavigation = generateNavigation;
