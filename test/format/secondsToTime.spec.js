const { secondsToTime } = require('format')

test('secondsToTime properly formats data', () => {
  expect(secondsToTime(0)).toEqual('0')

  expect(secondsToTime(10)).toEqual('10s')
  expect(secondsToTime(59)).toEqual('59s')

  expect(secondsToTime(60)).toEqual('1m')
  expect(secondsToTime(80)).toEqual('1m 20s')
  expect(secondsToTime(3599)).toEqual('59m 59s')

  expect(secondsToTime(3600)).toEqual('1h')
  expect(secondsToTime(3800)).toEqual('1h 3m 20s')
  expect(secondsToTime(28799)).toEqual('7h 59m 59s')

  expect(secondsToTime(28800)).toEqual('1d')
  expect(secondsToTime(46800)).toEqual('1d 5h')
  expect(secondsToTime(159000)).toEqual('5d 4h 10m')
  expect(secondsToTime(30765)).toEqual('1d 32m 45s')
  expect(secondsToTime(60233)).toEqual('2d 43m 53s')
})
