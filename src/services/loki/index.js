import Loki from 'lokijs'
import run from '../run'

const db = new Loki('loki.json')
const runs = db.addCollection('runs')

exports.generateRun = function () {
  return runs.insert({ run_id: run.generateRunId() })
}
