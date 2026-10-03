import axios from "axios";

// Today's date in India as YYYY-MM-DD. This matches the server: using UTC
// would allow booking "yesterday" between midnight and 5:30 AM IST.
export const todayIST = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

// Checks a venue and/or vendors for one date.
// items: [{ kind: "venues" | "services", id }]
// Resolves to { available, unavailable: [messages] }
export const checkAvailability = async (items, date) => {
  const results = await Promise.all(
    items.map(({ kind, id }) =>
      axios
        .get(`/${kind}/${id}/availability?date=${date}`)
        .then((res) => res.data)
        .catch((err) => ({
          available: false,
          message: err.response?.data?.message || "Could not check availability",
        }))
    )
  );
  const unavailable = results.filter((r) => !r.available).map((r) => r.message);
  return { available: unavailable.length === 0, unavailable };
};
