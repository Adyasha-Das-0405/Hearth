import { useState } from "react";

export function useMonthNav() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [flipClass, setFlipClass] = useState("");

  function changeMonth(dir) {
    setFlipClass("flip-out");

    setTimeout(() => {
      setMonth((m) => {
        const next = m + dir;

        if (next < 0) {
          setYear((y) => y - 1);
          return 11;
        }

        if (next > 11) {
          setYear((y) => y + 1);
          return 0;
        }

        return next;
      });

      setFlipClass("flip-in");
      setTimeout(() => setFlipClass(""), 300);
    }, 200);
  }

  // ✅ NEW: allow year selector to control the year
  function updateYear(newYear) {
    setYear(newYear);
  }

  return { year, month, flipClass, changeMonth, updateYear };
}