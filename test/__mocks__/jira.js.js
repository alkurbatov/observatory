class MockBoard {
  getAllSprints() {
    return jest.fn()
  }
}

class MockClient {
  constructor() {
    this.board = new MockBoard()
  }
}

module.exports = {
  Client: MockClient,
}
