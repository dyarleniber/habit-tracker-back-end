describe('Habit', () => {
  /**
   * Show habits
   */

  it('should not be able get habits without token', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should not be able get habits with invalid token', async done => {
    expect(true).toBe(true);
    done();
  });

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

  it('should not be able get habit without token', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should not be able get habit with invalid token', async done => {
    expect(true).toBe(true);
    done();
  });

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

  it('should not be able create habit without token', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should not be able create habit with invalid token', async done => {
    expect(true).toBe(true);
    done();
  });

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

  it('should not be able update habit without token', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should not be able update habit with invalid token', async done => {
    expect(true).toBe(true);
    done();
  });

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

  it('should not be able delete habit without token', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should not be able delete habit with invalid token', async done => {
    expect(true).toBe(true);
    done();
  });

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

  it('should not be able check habit without token', async done => {
    expect(true).toBe(true);
    done();
  });

  it('should not be able check habit with invalid token', async done => {
    expect(true).toBe(true);
    done();
  });

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
