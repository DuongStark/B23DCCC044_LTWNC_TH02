import { describe, expect, it } from 'vitest';
import { routineReducer, validateRoutineName } from './routineReducer';
import type { Routine } from './routineReducer';

const initial: Routine[] = [{ id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1'] }];
describe('routineReducer', () => {
  it('tạo giáo án và trim tên mà không thay đổi state cũ', () => {
    const next = routineReducer(initial, { type: 'create', payload: { id: 'r2', name: '  Ngày chân  ' } });
    expect(next).toEqual([...initial, { id: 'r2', name: 'Ngày chân', exerciseIds: [] }]);
    expect(initial).toHaveLength(1);
  });
  it('không tạo tên trống, tên trùng khác hoa thường hoặc id trùng', () => {
    for (const name of ['', '  ', 'ngày NGỰC']) {
      expect(routineReducer(initial, { type: 'create', payload: { id: 'r2', name } })).toEqual(initial);
    }
    expect(routineReducer(initial, { type: 'create', payload: { id: 'r1', name: 'Khác' } })).toEqual(initial);
  });
  it('addExercise không thêm trùng và giữ thứ tự bài', () => {
    const next = routineReducer(initial, { type: 'addExercise', payload: { routineId: 'r1', exerciseId: 'e2' } });
    expect(next[0].exerciseIds).toEqual(['e1', 'e2']);
    expect(routineReducer(next, { type: 'addExercise', payload: { routineId: 'r1', exerciseId: 'e1' } })).toEqual(next);
    expect(initial[0].exerciseIds).toEqual(['e1']);
  });
  it('removeExercise chỉ bỏ đúng bài được chọn', () => {
    const next = routineReducer(initial, { type: 'removeExercise', payload: { routineId: 'r1', exerciseId: 'e1' } });
    expect(next[0].exerciseIds).toEqual([]);
    expect(initial[0].exerciseIds).toEqual(['e1']);
  });
  it('đổi tên hợp lệ, từ chối đổi sang tên trùng hoặc trống', () => {
    const state = [...initial, { id: 'r2', name: 'Ngày chân', exerciseIds: [] }];
    expect(routineReducer(state, { type: 'rename', payload: { id: 'r1', name: '  Ngày tay ' } })[0].name).toBe('Ngày tay');
    expect(routineReducer(state, { type: 'rename', payload: { id: 'r1', name: 'NGÀY CHÂN' } })).toEqual(state);
    expect(routineReducer(state, { type: 'rename', payload: { id: 'r1', name: ' ' } })).toEqual(state);
    expect(validateRoutineName('Ngày ngực', state, 'r1')).toBeNull();
  });
  it('xóa giáo án và không thay đổi giá trị khi id không tồn tại', () => {
    expect(routineReducer(initial, { type: 'remove', payload: { id: 'r1' } })).toEqual([]);
    expect(routineReducer(initial, { type: 'remove', payload: { id: 'missing' } })).toEqual(initial);
    expect(routineReducer(initial, { type: 'addExercise', payload: { routineId: 'missing', exerciseId: 'e1' } })).toEqual(initial);
    expect(routineReducer(initial, { type: 'removeExercise', payload: { routineId: 'missing', exerciseId: 'e1' } })).toEqual(initial);
  });
});
