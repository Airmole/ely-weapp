const formatTimestampToDate = timestamp => {
  const date = new Date(parseInt(timestamp + '000'))
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}-${day}`
}

const formatNumberColor = n => {
  n = n.toString(16)
  if (String(n).length > 6) {
    return n;
  }
  return (Array(6).join(0) + n).slice(-6)
}

const formatSecondsToDateString = second => {
  let minute = 0
  let hour = 0
  if (second > 60) {
    minute = parseInt(second / 60)
    second = parseInt(second % 60)
    if (minute > 60) {
      hour = parseInt(minute / 60)
      minute = parseInt(minute % 60)
    }
  }
  let result = '' + parseInt(second) + ''
  if (minute > 0) result = '' + parseInt(minute) + ':' + result
  if (hour > 0) result = '' + parseInt(hour) + ':' + result
  return result
}

module.exports = {
  formatTimestampToDate,
  formatNumberColor,
  formatSecondsToDateString
}
