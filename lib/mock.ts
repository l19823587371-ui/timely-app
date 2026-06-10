export const USE_MOCK = true;
export const MOCK_DELAY = 300;

export function mockDelay(ms: number = MOCK_DELAY): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
