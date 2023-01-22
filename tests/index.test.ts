let _getTicks = jest.fn()
jest.mock('game/utils', () => ({
  getTicks: _getTicks
}));

import { isFirstTick } from '../src/common';

describe('testing isFirstTick function', () => {
  it('isFirstTick', () => {
    _getTicks.mockImplementation(() => 1);
    expect(isFirstTick()).toBe(true);
  });
  it('isNotFirstTick', () => {
    _getTicks.mockImplementation(() => 2);
    expect(isFirstTick()).toBe(false);
  });
});
