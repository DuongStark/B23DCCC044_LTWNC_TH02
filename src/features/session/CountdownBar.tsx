import { useSessionStore } from './useSessionStore';
import { formatDuration } from '../../utils/format';

export function CountdownBar() {
  const elapsed = useSessionStore(state => state.elapsed);
  const duration = useSessionStore(state => state.queue[state.currentIndex]?.duration ?? 0);
  const remaining = Math.max(0, duration - elapsed);
  const progress = duration ? Math.min(100, Math.max(0, (elapsed / duration) * 100)) : 0;
  return <div className="countdown">
    <div className="countdown-label"><span>Còn lại: {formatDuration(remaining)}</span><span>{Math.round(progress)}%</span></div>
    <div className="progress-track" role="progressbar" aria-label="Tiến trình bài tập" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><div style={{ width: `${progress}%` }} /></div>
  </div>;
}
