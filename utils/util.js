const formatTimestampToDate = timestamp => {
  if (timestamp == '') return ''
  const date = new Date(parseInt(timestamp + '000'))
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}-${day}`
}

const getNowTimeDateString = nil => {
  const now = new Date()
  const nowString = now.getFullYear() + "-" + ((now.getMonth() < 10 ? ('0' + (now.getMonth() + 1)) : (now.getMonth()) + 1)) + "-" + ((now.getDate() < 10 ? ('0' + (now.getDate())) : (now.getDate()))) + ' ' + ((now.getHours() < 10 ? ('0' + (now.getHours())) : now.getHours())) + ':' + ((now.getMinutes() < 10 ? ('0' + (now.getMinutes())) : now.getMinutes())) + ':' + ((now.getSeconds() < 10 ? ('0' + (now.getSeconds())) : now.getSeconds()))
  return nowString
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
  formatSecondsToDateString,
  getNowTimeDateString
}
