import r from '../../db/connect'

export function updateInTable(record, table, options = {}) {
  const recordWithTimestamps = includeUpdateTimestamp(record)
  return table
      .get(recordWithTimestamps.id)
      .update(recordWithTimestamps, options)
      .then(result => checkForErrors(result))
}

export function updateAllInTable(records, table, options = {}) {
  return Promise.all(
    records.map(record => updateInTable(record, table, options))
  )
}

export function insertIntoTable(record, table, options = {}) {
  return insertAllIntoTable([record], table, options)
}

export function insertAllIntoTable(records, table, options = {}) {
  const recordsWithTimestamps = records.map(record => includeCreateAndUpdateTimestamps(record))
  return table.insert(recordsWithTimestamps, options)
    .then(result => checkForErrors(result))
}

export function replaceInTable(record, table, options = {}) {
  const recordWithTimestamps = record.createdAt ?
    includeUpdateTimestamp(record) :
    includeCreateAndUpdateTimestamps(record)

  return table.get(record.id).replace(recordWithTimestamps, options)
}

export function isRethinkDBQuery(itemToTest) {
  return typeof itemToTest === 'function'
}

function includeUpdateTimestamp(record) {
  return Object.assign({}, {
    updatedAt: r.now(),
  }, record)
}

function includeCreateAndUpdateTimestamps(record) {
  return Object.assign({}, {
    createdAt: r.now(),
  }, includeUpdateTimestamp(record))
}

export function checkForErrors(result) {
  if (result.errors > 0) {
    throw new Error(result.first_error)
  }
  return result
}

