// Event dates are calendar days (YYYY-MM-DD) in India time, stored as UTC midnight

const TIME_ZONE = "Asia/Kolkata";

// Today's date in India as YYYY-MM-DD. Using UTC here would let people book
// "yesterday" between midnight and 5:30 AM IST.
const todayIST = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(new Date());

const isDateStr = (str) => /^\d{4}-\d{2}-\d{2}$/.test(str) && !isNaN(new Date(str));

// Start and end of the stored calendar day for a YYYY-MM-DD string
const dayRange = (dateStr) => {
  if (!isDateStr(dateStr)) return null;
  const start = new Date(`${dateStr}T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
};

module.exports = { todayIST, isDateStr, dayRange };
