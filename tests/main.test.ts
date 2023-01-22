let mockGetTicks = jest.fn()
jest.mock('game/utils', () => ({
  getTicks: mockGetTicks
}));

import { loop } from '../src/main';

describe('testing loop function', () => {
  it('tick1', () => {
    mockGetTicks.mockImplementation(() => 1);
    const log = jest.spyOn(console, "log").mockImplementation(() => {});
    loop();
    expect(log).toHaveBeenCalled();
    expect(log.mock.calls[0][0]).toContain('first tick');
    log.mockReset();
  });
  it('tick2', () => {
    mockGetTicks.mockImplementation(() => 2);
    const log = jest.spyOn(console, "log").mockImplementation(() => {});
    loop();
    expect(log).toHaveBeenCalled();
    expect(log.mock.calls[0][0]).toContain('groups');
    expect(log.mock.calls[0][1]).toBe(2);
    log.mockReset();
  });
});
