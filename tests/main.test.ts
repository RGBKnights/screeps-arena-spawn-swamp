import { loop } from "@App/main";

describe("testing loop function", () => {
  it("tick", () => {
    const log = jest.spyOn(console, "log").mockImplementation(() => {});
    loop();
    expect(log).toHaveBeenCalled();
    expect(log.mock.calls[0][0]).toContain("tick");
    log.mockReset();
  });
});
