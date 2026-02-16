export const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export function getDaysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export function getWeeksInMonth(year, month) {
  const totalDays = getDaysInMonth(year, month);
  const weeks = [];
  let currentDay = 1;
  let weekNum = 1;

  while (currentDay <= totalDays) {
    const dayOfWeek = new Date(year, month, currentDay).getDay();
    const daysInWeek = [];
    const startDay = currentDay;

    for (let d = dayOfWeek; d <= 6 && currentDay <= totalDays; d++) {
      daysInWeek.push(currentDay);
      currentDay++;
    }

    weeks.push({
      weekNumber: weekNum,
      days: daysInWeek,
      startDay,
      endDay: daysInWeek[daysInWeek.length - 1],
    });

    weekNum++;
  }

  return weeks;
}

export function getTodayInfo() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate(),
  };
}

export function getDayOfWeek(year, month, day) {
  return new Date(year, month, day).getDay();
}
