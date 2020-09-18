class MockBoard {
  getAllSprints() {
    return jest.fn()
  }
}

module.exports = class MockClient {
  constructor() {
    this.board = new MockBoard()
  }
}
