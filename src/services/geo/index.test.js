import * as geo from '.'

let locations

beforeEach(() => {
  locations = {
    location_a: {longtitude: 6.210742, latitude: 51.961916},
    location_b: {longtitude: 6.210162, latitude: 51.962114}
  }
})

describe('Check various distance operations', () => {
  it('Expecting the distance between to points to always be the same', () => {
    var value = geo.distance(locations.location_a, locations.location_b)
    expect(value).toEqual(45.44513541368626)
  })
})
