const queue: Array<() => Promise<unknown>> = []
let intervalId: number = 0
let currInterval: number = 0
let totalRequests = 0

const updates = new EventTarget()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getTotal() {
  return totalRequests
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getDone() {
  return totalRequests - queue.length
}

function emitUpdate() {
  // updates.emit('update', getDone(), getTotal())
}

function process() {
  if (!queue.length) {
    clearInterval(intervalId)
    intervalId = 0
    currInterval = 0
    totalRequests = 0
    updates.dispatchEvent(new CustomEvent('done'))
    return
  }
  const req = queue.shift()
  if (!req) throw new Error('queue was empty somehow')
  req()
  emitUpdate()
}

function enqueue(element: () => Promise<unknown>, interval = 100): () => Promise<unknown> {
  queue.push(element)
  totalRequests += 1
  emitUpdate()
  if (!intervalId) {
    currInterval = interval
    intervalId = window.setInterval(process, interval)
    return element
  }
  if (currInterval < interval) {
    currInterval = interval
    clearInterval(intervalId)
    intervalId = window.setInterval(process, interval)
  }
  return element
}

export default enqueue
export { updates }
