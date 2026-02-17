export const getDaysInMonth = (year, month) =>
  new Date(year, month + 1, 0).getDate()

export const getFirstDayOfMonth = (year, month) =>
  new Date(year, month, 1).getDay()

export const generateCalendarDays = (year, month) => {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)
  return days
}
