export function runReviewScoreCheck(score: number, minimum = 4) {
  return {
    passed: score >= minimum,
    score,
    minimum,
  }
}
