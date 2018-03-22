import util from '../util'

exports.generateRunId = function () {
  return util.randomAlphanumericSequence('xxxxx')
}

// examples

// Join run
// {
//   "type":"join",
//   "payload": {
//       "run_id" : "tempid",
//       "user_id" : "user_id",
//       "type" : "JOIN"
//     }
// }

// {
//   "type":"setname",
//   "payload": {
//       "name" : "what is the name you want :>"
//     }
// }
