import { summary } from "@App/summary";

describe("testing summary function", () => {
  it("summary", () => {
    const log = jest.spyOn(console, "log").mockImplementation(() => {});
    summary();
    expect(log).toHaveBeenCalled();
    expect(log.mock.calls[0][0]).toContain("summary");
    log.mockReset();
  });
});
