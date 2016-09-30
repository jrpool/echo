/* eslint-disable import/imports-first */

// FIXME: replace globals with central (non-global) config
global.__SERVER__ = true

const Promise = require('bluebird')

const updateProjectCycleStats = require('src/server/actions/updateProjectStats')
const {findPlayers, getPlayerById} = require('src/server/db/player')
const {findChapters} = require('src/server/db/chapter')
const {getCyclesForChapter} = require('src/server/db/cycle')
const {getProjectsForChapterInCycle} = require('src/server/db/project')
const {COMPLETE} = require('src/common/models/cycle')
const {finish} = require('./util')

const LOG_PREFIX = '[runStats]'

// FIXME: hardcoded, yuck
const PRO_PLAYERS = {
  '070b3063-0ff7-40c6-b3d1-321fa49b6c94': {handle: 'bluemihai', initialEloRating: 1300, initialXp: 0},
  '75dbe257-a701-4725-ba74-4341376f540d': {handle: 'jrob8577', initialEloRating: 1300, initialXp: 0},
  'dcf14075-6fbe-44ab-89bf-cba2511f0278': {handle: 'deadlyicon', initialEloRating: 1300, initialXp: 0},
  '3760fbe8-2c2e-46d9-bca7-a9610dc0d417': {handle: 'prattsj', initialEloRating: 1300, initialXp: 0},
  'ed958f6f-1870-4ba9-8de9-e1092c9fa758': {handle: 'deonna', initialEloRating: 1300, initialXp: 0},
  'f490c8ee-e609-4774-bcf5-9ed7f938676d': {handle: 'tannerwelsh', initialEloRating: 1150, initialXp: 500},
}

run()
  .then(() => finish())
  .catch(err => finish(err))

async function run() {
  const errors = []

  const players = await findPlayers()
  await Promise.each(players, player => {
    return clearPlayerStats(player)
  })

  const proPlayers = players.filter(player => PRO_PLAYERS[player.id])
  await Promise.each(proPlayers, proPlayer => {
    return setPlayerStats(proPlayer, {
      elo: {
        rating: PRO_PLAYERS[proPlayer.id].initialEloRating,
      },
      xp: PRO_PLAYERS[proPlayer.id].initialXp,
    })
  })

  const chapters = await findChapters()
  await Promise.each(chapters, chapter => {
    return updateChapterStats(chapter).catch(err => {
      errors.push(err)
    })
  })

  if (errors.length) {
    console.error(LOG_PREFIX, 'Errors:')
    errors.forEach(err => console.error('\n', err))
    throw new Error('Stats computation failed')
  }

  const playersFinal = await findPlayers()

  // log final/current ratings
  playersFinal
    .filter(player => player.stats && player.stats.elo)
    .map(player => ({
      id: player.id,
      elo: ((player.stats || {}).elo || {}).rating || null
    }))
    .sort((a, b) => a.elo - b.elo)
    .forEach(player => console.log(player.id.slice(0, 8), player.elo))
}

async function clearPlayerStats(player) {
  console.log(LOG_PREFIX, `Clearing stats for player ${player.id}`)

  await getPlayerById(player.id)
    .replace(player => player.without('stats'))
    .run()
}

async function setPlayerStats(player, stats) {
  console.log(LOG_PREFIX, `Setting stats for player ${player.id}`)

  await getPlayerById(player.id)
    .update({stats})
    .run()
}

async function updateChapterStats(chapter) {
  console.log(LOG_PREFIX, `Updating stats for chapter ${chapter.name} (${chapter.id})`)

  const chapterCycles = await getCyclesForChapter(chapter.id)
  const chapterCyclesSorted = chapterCycles.sort((a, b) => a.cycleNumber - b.cycleNumber)

  return Promise.each(chapterCyclesSorted, cycle => {
    if (cycle.state !== COMPLETE) {
      console.log(LOG_PREFIX, `Skipping cycle ${cycle.id} in state ${cycle.state}`)
      return
    }
    return updateChapterCycleStats(chapter, cycle)
  })
}

async function updateChapterCycleStats(chapter, cycle) {
  console.log(LOG_PREFIX, `Updating stats for cycle ${cycle.cycleNumber} (${cycle.id})`)

  const cycleProjects = await getProjectsForChapterInCycle(chapter.id, cycle.id)
  return Promise.each(cycleProjects, project => {
    return updateCycleProjectStats(cycle, project)
  })
}

function updateCycleProjectStats(cycle, project) {
  console.log(LOG_PREFIX, `Updating stats for project ${project.name} (${project.id})`)

  const projectCycleHistory = (project.cycleHistory || []).find(ch => ch.cycleId === cycle.id)
  if (!projectCycleHistory) {
    console.warn(LOG_PREFIX, `Cycle history not found for project ${project.name} (${project.id})`)
    return
  }

  return updateProjectCycleStats(project, cycle.id)
}
