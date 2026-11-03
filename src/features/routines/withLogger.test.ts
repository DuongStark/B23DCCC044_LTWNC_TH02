import { afterEach, describe, expect, it, vi } from 'vitest';
import { withLogger } from './withLogger';

afterEach(() => vi.unstubAllEnvs());
describe('withLogger', () => {
  it('DEV ghi tên action, state trước/sau và trả đúng kết quả', () => {
    vi.stubEnv('DEV', true);
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const reducer = withLogger((state: number, action: { type: string; amount: number }) => state + action.amount);
    expect(reducer(2, { type: 'create', amount: 3 })).toBe(5);
    expect(log).toHaveBeenCalledWith('create', { before: 2, after: 5 });
  });
  it('production không ghi log', () => {
    vi.stubEnv('DEV', false);
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    expect(withLogger((state: number, _action: { type: string }) => state)(7, { type: 'remove' })).toBe(7);
    expect(log).not.toHaveBeenCalled();
  });
});
