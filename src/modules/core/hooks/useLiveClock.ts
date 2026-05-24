import { useEffect, useState } from 'react';

const dateFmt = new Intl.DateTimeFormat('sv-SE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const timeFmt = new Intl.DateTimeFormat('sv-SE', {
  hour: '2-digit',
  minute: '2-digit',
});

export function useLiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return {
    time: timeFmt.format(now),
    date: dateFmt.format(now),
  };
}
