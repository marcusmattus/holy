const DEFAULT_MINIMUM_REVIEW_SCORE = 4

export function runReviewScoreCheck(score: number, minimum = DEFAULT_MINIMUM_REVIEW_SCORE) {
  return {
    passed: score >= minimum,
    score,
    minimum,
  }
}
