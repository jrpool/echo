import r from '../../db/connect'

import {RETROSPECTIVE} from '../../common/models/cycle'
import {findCycles} from '../../server/db/cycle'
import {getPlayerById} from '../../server/db/player'
import {getQuestionById} from '../../server/db/question'
import {findProjectByPlayerIdAndCycleId} from '../../server/db/project'

export const surveysTable = r.table('surveys')

export function saveSurvey(survey) {
  if (survey.id) {
    return update(survey.id, survey)
  }
  return insert(survey)
}

export function getRetrospectiveSurveyForPlayer(playerId) {
  return getCurrentCycleIdAndProjectIdForPlayer(playerId).do(
    ids => getProjectRetroSurvey(ids('projectId'), ids('cycleId'))
  )
}

function getCurrentCycleIdAndProjectIdForPlayer(playerId) {
  const cycle = findCycles({
    state: RETROSPECTIVE,
    chapterId: getPlayerById(playerId)('chapterId'),
  }).nth(0)

  return cycle.do(
    cycle => findProjectByPlayerIdAndCycleId(playerId, cycle('id'))
      .pluck('id')
      .merge(project => ({projectId: project('id'), cycleId: cycle('id')}))
      .without('id')
  )
}

export function getFullRetrospectiveSurveyForPlayer(playerId) {
  return r.do(
    getRetrospectiveSurveyForPlayer(playerId),
    inflateQuestionRefs
  ).merge(survey => ({
    project: {id: survey('projectId')},
    cycle: {id: survey('cycleId')},
  }))
}

function inflateQuestionRefs(surveyQuery) {
  return surveyQuery.merge(survey => ({
    questions: mapRefsToQuestions(survey('questionRefs'))
  }))
}

function mapRefsToQuestions(questionRefs) {
  return questionRefs.map(ref =>
    getQuestionById(ref('questionId'))
      .merge(() => ({
        subject: ref('subject')
      }))
  )
}

export function getProjectRetroSurvey(projectId, cycleId) {
  return surveysTable.getAll([cycleId, projectId], {index: 'cycleIdAndProjectId'}).nth(0)
}

function update(id, survey) {
  const surveyWithTimestamps = Object.assign({}, survey, {
    updatedAt: r.now(),
  })
  return surveysTable.get(id).update(surveyWithTimestamps)
}

function insert(survey) {
  const surveyWithTimestamps = Object.assign({}, survey, {
    updatedAt: r.now(),
    createdAt: r.now(),
  })
  return surveysTable.insert(surveyWithTimestamps)
}
