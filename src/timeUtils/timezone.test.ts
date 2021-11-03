// see global-setup.js for details on setting timezone to UTC for all jest tests

describe('Timezone', () => {
  it('should be UTC', () => {
    expect(new Date().getTimezoneOffset()).toBe(0);
  });
});

export {};