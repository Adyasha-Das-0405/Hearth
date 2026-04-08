import { useClock } from '../../hooks/useClock';

const pad = (n) => String(n).padStart(2, '0');

export default function Clock() {
  const time = useClock();

  const h   = time.getHours();
  const min = time.getMinutes();
  const sec = time.getSeconds();
  const ampm = h >= 12 ? 'PM' : 'AM';

  return (
    <span className="clock">
      {pad(h)} : {pad(min)} : {pad(sec)} {ampm} IST
    </span>
  );
}
