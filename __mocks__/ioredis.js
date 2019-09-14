const ioredisMock = jest.genMockFromModule('ioredis');

ioredisMock.prototype.keys = jest.fn().mockReturnValue([]);

export default ioredisMock;
