import loki from 'lokijs'
import run from '../run'

const db = new loki('loki.json')
const runs = db.addCollection('runs');

exports.generateRun = function() {
  return runs.insert({ runId : run.generateRunId()})
}
