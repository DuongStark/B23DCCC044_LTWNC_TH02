import { beforeEach, describe, expect, it } from 'vitest';
import { useSavedStore } from './useSavedStore';

beforeEach(() => { localStorage.clear(); useSavedStore.setState({ ids: [] }); });
describe('bài tập đã lưu', () => {
  it('toggle thêm và bỏ lưu, dữ liệu được ghi vào đúng key', () => {
    useSavedStore.getState().toggle('e1');
    useSavedStore.getState().toggle('e3');
    expect(JSON.parse(localStorage.getItem('workout-saved')!).state.ids).toEqual(['e1', 'e3']);
    useSavedStore.getState().toggle('e1');
    expect(useSavedStore.getState().ids).toEqual(['e3']);
  });
  it('khôi phục ids khi tải lại từ localStorage', async () => {
    localStorage.setItem('workout-saved', JSON.stringify({ state: { ids: ['e1', 'e3'] }, version: 0 }));
    await useSavedStore.persist.rehydrate();
    expect(useSavedStore.getState().ids).toEqual(['e1', 'e3']);
  });
  it('không nhận ids sai cấu trúc hoặc trùng từ storage', async () => {
    localStorage.setItem('workout-saved', JSON.stringify({ state: { ids: ['e1', 'e1', 3] }, version: 0 }));
    await useSavedStore.persist.rehydrate();
    expect(useSavedStore.getState().ids).toEqual(['e1']);
    localStorage.setItem('workout-saved', JSON.stringify({ state: { ids: null }, version: 0 }));
    await useSavedStore.persist.rehydrate();
    expect(useSavedStore.getState().ids).toEqual([]);
  });
});
