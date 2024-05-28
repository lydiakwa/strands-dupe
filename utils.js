// Returns { x, y } coordinates for the center of an element
// relative to the x/y coordinates of the parent element
const getRelativeCenterCoords = (element, parent) => {
  const { x, y, width, height } = element.getBoundingClientRect()
  const { x: parentX, y: parentY } = parent.getBoundingClientRect()

  return {
    x: (x + (width / 2)) - parentX,
    y: (y + (height / 2) - parentY)
  }
}

export { getRelativeCenterCoords }
