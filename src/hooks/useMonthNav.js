import { useState } from 'react';

export function useMonthNav() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [flipClass, setFlipClass] = useState('');

  function changeMonth(dir) {
    // 1. Animate out
    setFlipClass('flip-out');

    setTimeout(() => {
      // 2. Mutate month/year
      setMonth((m) => {
        const next = m + dir;
        if (next < 0)  { setYear((y) => y - 1); return 11; }
        if (next > 11) { setYear((y) => y + 1); return 0;  }
        return next;
      });
      // 3. Animate in
      setFlipClass('flip-in');
      setTimeout(() => setFlipClass(''), 300);
    }, 200);
  }

  return { year, month, flipClass, changeMonth };
}
