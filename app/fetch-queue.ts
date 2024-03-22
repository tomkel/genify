const queue = []
let intervalId
let currInterval
let totalRequests = 0

const updates = new EventTarget()

function getTotal() {
  return totalRequests
}

function getDone() {
  return totalRequests - queue.length
}

function emitUpdate() {
  // updates.emit('update', getDone(), getTotal())
}

function process() {
  if (!queue.length) {
    clearInterval(intervalId)
    intervalId = null
    currInterval = 0
    totalRequests = 0
    updates.dispatchEvent(new CustomEvent('done'))
    return
  }
  const req = queue.shift()
  req()
  emitUpdate()
}

function enqueue(element, interval = 100) {
  queue.push(element)
  totalRequests += 1
  emitUpdate()
  if (!intervalId) {
    currInterval = interval
    intervalId = setInterval(process, interval)
    return element
  }
  if (currInterval < interval) {
    currInterval = interval
    clearInterval(intervalId)
    intervalId = setInterval(process, interval)
  }
  return element
}

export default enqueue
export { updates }
