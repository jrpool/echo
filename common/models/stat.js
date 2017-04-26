export const STAT_DESCRIPTORS = {
  // user stats: technical
  TECHNICAL_HEALTH: 'technicalHealth',

  // user stats: team play
  TEAM_PLAY: 'teamPlay',
  TEAM_PLAY_RECEPTIVENESS: 'teamPlayReceptiveness',
  TEAM_PLAY_RESULTS_FOCUS: 'teamPlayResultsFocus',
  TEAM_PLAY_FLEXIBLE_LEADERSHIP: 'teamPlayFlexibleLeadership',
  TEAM_PLAY_FRICTION_REDUCTION: 'teamPlayFrictionReduction',

  // user stats: culture
  CULTURE_CONTRIBUTION: 'cultureContribution',
  CULTURE_CONTRIBUTION_STRUCTURE: 'cultureContributionStructure',
  CULTURE_CONTRIBUTION_SAFETY: 'cultureContributionSafety',
  CULTURE_CONTRIBUTION_TRUTH: 'cultureContributionTruth',
  CULTURE_CONTRIBUTION_CHALLENGE: 'cultureContributionChallenge',
  CULTURE_CONTRIBUTION_SUPPORT: 'cultureContributionSupport',
  CULTURE_CONTRIBUTION_ENGAGEMENT: 'cultureContributionEngagement',
  CULTURE_CONTRIBUTION_ENJOYMENT: 'cultureContributionEnjoyment',

  // user stats: contribution
  RELATIVE_CONTRIBUTION: 'relativeContribution',
  RELATIVE_CONTRIBUTION_RAW: 'relativeContributionRaw',
  RELATIVE_CONTRIBUTION_OTHER: 'relativeContributionOther',
  RELATIVE_CONTRIBUTION_SELF: 'relativeContributionSelf',
  RELATIVE_CONTRIBUTION_HOURLY: 'relativeContributionHourly',
  RELATIVE_CONTRIBUTION_EXPECTED: 'relativeContributionExpected',
  RELATIVE_CONTRIBUTION_DELTA: 'relativeContributionDelta',
  RELATIVE_CONTRIBUTION_AGGREGATE_CYCLES: 'relativeContributionAggregateCycles',
  RELATIVE_CONTRIBUTION_EFFECTIVE_CYCLES: 'relativeContributionEffectiveCycles',

  // user stats: estimation
  ESTIMATION_ACCURACY: 'estimationAccuracy',
  ESTIMATION_BIAS: 'estimationBias',

  // user stats: misc
  CHALLENGE: 'challenge',
  EXPERIENCE_POINTS: 'experiencePoints',
  EXPERIENCE_POINTS_V2: 'experiencePointsV2',
  EXPERIENCE_POINTS_V2_PACE: 'experiencePointsV2Pace',
  ELO: 'elo',
  TEAM_HOURS: 'teamHours',
  LEVEL: 'level',

  // user "stats": freeform (clearly not really a stat)
  GENERAL_FEEDBACK: 'generalFeedback',

  // project stats
  PROJECT_COMPLETENESS: 'projectCompleteness',
  RAW_PROJECT_COMPLETENESS: 'rawProjectCompleteness',
  PROJECT_HOURS: 'projectHours',
  PROJECT_TIME_OFF_HOURS: 'projectTimeOffHours',

  PROJECT_REVIEW_EXPERIENCE: 'projectReviewExperience',
  PROJECT_REVIEW_ACCURACY: 'projectReviewAccuracy',
  EXTERNAL_PROJECT_REVIEW_COUNT: 'externalProjectReviewCount',
  INTERNAL_PROJECT_REVIEW_COUNT: 'internalProjectReviewCount',
}

export const PRO_PLAYER_STATS_BASELINE = {
  [STAT_DESCRIPTORS.PROJECT_REVIEW_ACCURACY]: 95,
  [STAT_DESCRIPTORS.EXTERNAL_PROJECT_REVIEW_COUNT]: 10,
  [STAT_DESCRIPTORS.INTERNAL_PROJECT_REVIEW_COUNT]: 0,
  [STAT_DESCRIPTORS.EXPERIENCE_POINTS]: 1001,
}

export const MIN_EXTERNAL_REVIEW_COUNT_FOR_ACCURACY = 8
export const RELEVANT_EXTERNAL_REVIEW_COUNT = 20
