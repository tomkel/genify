const queue = []
let intervalId
let currInterval

function process() {
  if (!queue.length) {
    clearInterval(intervalId)
    intervalId = null
    return
  }
  const req = queue.shift()
  req()
}

function enqueue(element, interval = 100) {
  queue.push(element)
  if (!intervalId) {
    currInterval = interval
    intervalId = setInterval(process, interval)
    return element
  }
  if (currInterval !== interval) {
    currInterval = interval
    clearInterval(intervalId)
    intervalId = setInterval(process, interval)
  }
  return element
}

export default enqueue
