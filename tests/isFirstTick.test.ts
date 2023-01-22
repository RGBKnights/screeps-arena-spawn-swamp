let mockGetTicks = jest.fn()
jest.mock('game/utils', () => ({
  getTicks: mockGetTicks
}));

import { isFirstTick } from '../src/common';

describe('testing isFirstTick function', () => {
  it('isFirstTick', () => {
    mockGetTicks.mockImplementation(() => 1);
    expect(isFirstTick()).toBe(true);
  });
  it('isNotFirstTick', () => {
    mockGetTicks.mockImplementation(() => 2);
    expect(isFirstTick()).toBe(false);
  });
});
