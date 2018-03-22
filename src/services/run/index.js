import util from '../util'

exports.generateRunId = function () {
  return util.randomAlphanumericSequence('xxxxx')
}

// examples

// Update request
// {
//   "run_id" : "tempid",
//   "user_id" : "user_id",
//   "longitude":"6.210742",
//   "latitude":"51.961916",
//   "type" : "UPDATE"
// }

// Set name
// {
//   "run_id" : "tempid",
//   "user_id" : "user_id",
//   "name" : "Cool Kid",
//   "type" : "SETNAME"
// }

// Join run
// {
//   "run_id" : "tempid",
//   "user_id" : "user_id",
//   "type" : "JOIN"
// }
