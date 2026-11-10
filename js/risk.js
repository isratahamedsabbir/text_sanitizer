/**
 * Risk Module
 * Turns sanitizer statistics into a simple, human-readable risk summary.
 * This is a helpful indicator, not a guarantee of Fiverr approval.
 */

(function() {
  window.Risk = {
    evaluate(stats = {}) {
      const detectedCount = Number(stats.detectedCount) || 0;
      const smartMatchCount = Number(stats.smartMatchCount) || 0;
      const smartCounts = stats.smartCounts || {};
      const wordMatchCount = Math.max(0, detectedCount - smartMatchCount);

      const score = Math.min(100, detectedCount * 9 + smartMatchCount * 24);
      let level = 'clean';
      let label = 'Clean';
      let detail = 'No risky content detected';

      if (score >= 70) {
        level = 'high';
        label = 'High risk';
      } else if (score >= 31) {
        level = 'medium';
        label = 'Needs review';
      } else if (score > 0) {
        level = 'low';
        label = 'Low risk';
      }

      const reasons = [];
      if (smartCounts.email) reasons.push(`${smartCounts.email} email address${smartCounts.email > 1 ? 'es' : ''}`);
      if (smartCounts.phone) reasons.push(`${smartCounts.phone} phone number${smartCounts.phone > 1 ? 's' : ''}`);
      if (smartCounts.url) reasons.push(`${smartCounts.url} link${smartCounts.url > 1 ? 's' : ''}`);
      if (smartCounts.handle) reasons.push(`${smartCounts.handle} social handle${smartCounts.handle > 1 ? 's' : ''}`);
      if (wordMatchCount) reasons.push(`${wordMatchCount} restricted term${wordMatchCount > 1 ? 's' : ''}`);

      if (reasons.length > 0) {
        detail = `${reasons.length} issue${reasons.length > 1 ? 's' : ''} found`;
      }

      return {
        score,
        level,
        label,
        detail,
        reasons,
        detectedCount,
        smartMatchCount,
        wordMatchCount
      };
    }
  };
})();
