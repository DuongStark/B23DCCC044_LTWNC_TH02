import { useEffect } from 'react';
import { Icon } from '../../components/Icon';
import { useSessionStore } from './useSessionStore';
import { CountdownBar } from './CountdownBar';

export function SessionBar() {
  const current = useSessionStore(state => state.queue[state.currentIndex]);
  const count = useSessionStore(state => state.queue.length);
  const isRunning = useSessionStore(state => state.isRunning);
  const tick = useSessionStore(state => state.tick);
  const toggleRun = useSessionStore(state => state.toggleRun);
  const next = useSessionStore(state => state.next);
  const prev = useSessionStore(state => state.prev);
  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [isRunning, tick]);

  return <section className="session-bar" aria-label="Đồng hồ buổi tập"><div className="session-inner">
    <div className="session-information"><span className={`session-symbol ${isRunning ? 'running' : ''}`}><Icon name="pulse" size={23} /></span><div className="session-text"><p className="session-title">{current ? `Đang tập: ${current.name} – HLV ${current.trainer}` : 'Chưa bắt đầu buổi tập'}</p><span className="session-meta">Buổi tập: {count} bài<span className="session-state">{isRunning ? 'Đang chạy' : current ? 'Đã dừng' : 'Chọn bài tập để bắt đầu'}</span></span></div></div>
    <div className="session-controls"><button className="icon-button" aria-label="Trước" disabled={!current} onClick={prev}><Icon name="back" size={16} /></button><button className="play-control" aria-label={isRunning ? 'Tạm dừng' : 'Bắt đầu'} disabled={!count} onClick={toggleRun}><Icon name={isRunning ? 'pause' : 'play'} size={18} /></button><button className="icon-button" aria-label="Sau" disabled={!current} onClick={next}><Icon name="next" size={16} /></button></div>
    <CountdownBar />
  </div></section>;
}
