const queue = []
let active = false
let intervalId = null

function enqueue(element, interval = 1) {
  queue.push(element)
  if (!intervalId) {
    intervalId = setInterval(process, interval)
  }
  return element
}

function process() {
  if (!queue.length) {
    clearInterval(intervalId)
    return intervalId = null
  }
  const req = queue.shift()
  req()
}

export default enqueue
