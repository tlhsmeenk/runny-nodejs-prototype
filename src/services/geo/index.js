import turf from 'turf'

const UNIT = 'meters'

const distance = (point1, point2) => {
  let from = turf.point([point1.longtitude, point1.latitude])
  let to = turf.point([point2.longtitude, point2.latitude])

  return turf.distance(from, to, UNIT)
}

module.exports = {
  distance
}
