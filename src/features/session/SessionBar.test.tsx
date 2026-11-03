import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SessionBar } from './SessionBar';
import { useSessionStore } from './useSessionStore';
import { EXERCISES } from '../../data/exercises';

beforeEach(() => useSessionStore.setState({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 }));
describe('SessionBar', () => {
  it('hiển thị chưa bắt đầu, khóa điều khiển khi không có bài', () => {
    render(<SessionBar />);
    expect(screen.getByText('Chưa bắt đầu buổi tập')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bắt đầu' })).toBeDisabled();
  });
  it('đếm 5 giây, tạm dừng 3 giây, chạy tiếp và cleanup interval', () => {
    vi.useFakeTimers();
    useSessionStore.getState().startSession(EXERCISES.slice(0, 3), 1);
    const { unmount } = render(<SessionBar />);
    expect(screen.getByText('Còn lại: 1:07')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText('Còn lại: 1:02')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Tạm dừng' }));
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByText('Còn lại: 1:02')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu' }));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText('Còn lại: 1:01')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Sau' }));
    expect(screen.getByText('Còn lại: 1:44')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Trước' }));
    expect(screen.getByText('Còn lại: 1:07')).toBeInTheDocument();
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
  it('tự chuyển bài sau 30 giây và cập nhật tiến trình', () => {
    vi.useFakeTimers();
    useSessionStore.getState().startSession(EXERCISES.slice(0, 2), 0);
    render(<SessionBar />);
    act(() => vi.advanceTimersByTime(15000));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    act(() => vi.advanceTimersByTime(15000));
    expect(screen.getByText('Đang tập: Kéo tạ đơn 1 – HLV Phương Anh')).toBeInTheDocument();
    expect(screen.getByText('Còn lại: 1:07')).toBeInTheDocument();
  });
});
