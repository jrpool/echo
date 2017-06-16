const GAME_PLAY = [
  'moderator',
  'player',
]

const GAME_VIEW = GAME_PLAY.concat(['backoffice'])

const CAPABILITY_ROLES = {
  listChapters: ['backoffice'],
  findChapters: ['backoffice'],
  createChapter: ['backoffice'],
  updateChapter: ['backoffice'],
  createInviteCode: ['backoffice'],
  reassignPlayersToChapter: ['backoffice'],

  createCycle: ['moderator'],
  launchCycle: ['moderator'],
  updateCycle: ['moderator'],
  deleteProject: ['moderator'],
  viewCycleVotingResults: GAME_PLAY,

  updateUser: ['sep', 'moderator'],
  importProject: ['moderator'],
  updateProject: ['moderator'],
  listProjects: GAME_VIEW,
  findProjects: GAME_VIEW,
  viewProject: GAME_VIEW,
  viewProjectStats: GAME_VIEW,
  viewProjectSummary: GAME_VIEW,
  viewProjectEvaluation: ['moderator', 'backoffice'],
  viewProjectUserSummary: ['moderator', 'backoffice'],
  setProjectArtifact: GAME_PLAY,

  viewUser: GAME_VIEW,
  viewUserStats: ['moderator', 'backoffice'],
  viewUserSummary: GAME_VIEW,
  listUsers: GAME_VIEW,
  findUsers: GAME_VIEW,
  deactivateUser: ['moderator', 'backoffice'],

  saveResponse: GAME_PLAY,
  reviewClosedProject: ['sep', 'moderator', 'backoffice'],
  getRetrospectiveSurvey: GAME_PLAY,
  findRetrospectiveSurveys: GAME_PLAY,
  lockAndUnlockSurveys: ['moderator'],

  viewSensitiveReports: ['moderator', 'sysadmin'],
  monitorJobQueues: ['sysadmin'],
  beExcludedFromVoting: ['moderator'],
}

export const VALID_ROLES = Object.keys(CAPABILITY_ROLES).map(capability => {
  return CAPABILITY_ROLES[capability]
}).reduce((prev, curr) => {
  return [...new Set(prev.concat(curr))]
}, [])

export default function userCan(currentUser, capability) {
  if (!currentUser) {
    return false
  }
  const {roles} = currentUser
  if (!roles) {
    return false
  }
  if (!CAPABILITY_ROLES[capability]) {
    throw new Error(`No such capability '${capability}'`)
  }
  const permitted = roles.filter(role => (
    CAPABILITY_ROLES[capability].indexOf(role) >= 0
  )).length > 0

  return permitted
}
