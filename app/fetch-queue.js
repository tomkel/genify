const queue = []
let active = false
let intervalId = null

function enqueue(element) {
  queue.push(element)
  if (!intervalId) {
    intervalId = setInterval(process, 100)
  }
  return element
}

function process() {
  if (!queue.length) {
    clearInterval(intervalId)
    return intervalId = null
  }
  const req = queue.shift()
  req().catch(e => {
    console.error(e)
    console.log('retrying')
    queue.unshift(req)
  })
}

export default enqueue
