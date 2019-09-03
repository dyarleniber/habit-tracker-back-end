describe('Habit', () => {
  /**
   * Show habits
   */

  it('should be able to get habits when authenticated', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should be able to get only authenticated user habits', async done => {
    expect(true).toBe(true);
    done();
  });

  /**
   * Show habit
   */

  it('should not be able get habit when authenticated and with invalid habit id', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should not be able get habit when authenticated and with habit id of another user', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should be able to get habit when authenticated and with valid habit id', async done => {
    expect(true).toBe(true);
    done();
  });

  /**
   * Store habit
   */

  it('should not be able create habit when authenticated and with empty data', async done => {
    // name, description
    expect(true).toBe(true);
    done();
  });

  it('should be able to create habit when authenticated and with valid data', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should be able to create habit only for the authenticated user', async done => {
    expect(true).toBe(true);
    done();
  });

  /**
   * Update habit
   */

  it('should not be able update habit when authenticated and with invalid habit id', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should not be able update habit when authenticated and with habit id of another user', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should not be able update habit when authenticated and with empty data', async done => {
    // name, description
    expect(true).toBe(true);
    done();
  });

  it('should be able to update habit when authenticated and with valid data', async done => {
    expect(true).toBe(true);
    done();
  });

  /**
   * Delete habit
   */

  it('should not be able delete habit when authenticated and with invalid habit id', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should not be able delete habit when authenticated and with habit id of another user', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should be able to delete habit when authenticated and with valid habit id', async done => {
    expect(true).toBe(true);
    done();
  });

  /**
   * Check habit
   */

  it('should not be able check habit when authenticated and with invalid habit id', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should not be able check habit when authenticated and with habit id of another user', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should not be able check habit already checked for the current date', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should be able to check habit when authenticated and with valid habit id', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should be able to check habit only for the current date', async done => {
    expect(true).toBe(true);
    done();
  });
});
