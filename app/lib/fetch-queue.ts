const queue: Array<() => Promise<unknown>> = []
let intervalId = 0
let currInterval = 0
let totalRequests = 0

// const updates = new EventTarget()

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
    // updates.dispatchEvent(new CustomEvent('done'))
    return
  }
  const req = queue.shift()
  if (!req) throw new Error('queue was empty somehow')
  void req()
  // emitUpdate()
}

// use observable instead of promise? push vs pull
function enqueue<T>(element: () => Promise<T>, interval = 100): () => Promise<T> {
  queue.push(element)
  totalRequests += 1
  // emitUpdate()
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

export {
  enqueue,
  // updates,
}
