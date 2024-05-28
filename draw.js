const drawLine = (svg, coordinates, color) => {
  // Make group to set path styles
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g")
  group.setAttribute('stroke-linecap', 'round')
  group.setAttribute('stroke-width', '12')
  group.setAttribute('stroke', color)
  group.setAttribute('fill', 'none')

  // Make path
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
  let line = []

  for (const { x, y } of coordinates) {
    if (line.length === 0) {
      line.push(`M ${x} ${y}`) // M = Move to
    } else {
      line.push(`L ${x} ${y}`) // L = Line to
    }
  }

  path.setAttribute('d', line.join(' '))
  group.append(path)
  svg.append(group)
}

export { drawLine }
