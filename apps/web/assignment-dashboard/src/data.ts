export interface AnnotatorAnalytics {
  annotatorId: string;
  totalAnnotations: number;
  avgLeadTime: number;
  leadTimeDiffVsAverage: number;
  avgAgreement: number;
}

export interface AnnotatorAccuracy {
  annotatorId: string;
  tasksComparedAgainstGroundTruth: number;
  correctAnswers: number;
  accuracyPercent: number;
  flaggedForReview: boolean;
}

export interface DashboardAnnotator {
  id: string;
  totalAnnotations: number;
  avgLeadTime: number;
  leadTimeDiffVsAverage: number;
  avgAgreement: number;
  accuracyPercent: number | null;
  tasksCompared: number;
  correctAnswers: number;
  flagged: boolean;
}

const analytics: AnnotatorAnalytics[] = [
  { annotatorId: "Cx121", totalAnnotations: 12, avgLeadTime: 50.41, leadTimeDiffVsAverage: -1.53, avgAgreement: 75 },
  { annotatorId: "RWIej", totalAnnotations: 11, avgLeadTime: 53.86, leadTimeDiffVsAverage: 1.92, avgAgreement: 77.27 },
  { annotatorId: "zkyxz", totalAnnotations: 11, avgLeadTime: 51.48, leadTimeDiffVsAverage: -0.45, avgAgreement: 86.36 },
  { annotatorId: "xpkWQ", totalAnnotations: 9, avgLeadTime: 55.41, leadTimeDiffVsAverage: 3.48, avgAgreement: 72.22 },
  { annotatorId: "76lWW", totalAnnotations: 9, avgLeadTime: 51.14, leadTimeDiffVsAverage: -0.79, avgAgreement: 77.78 },
  { annotatorId: "2w04p", totalAnnotations: 9, avgLeadTime: 48.79, leadTimeDiffVsAverage: -3.14, avgAgreement: 66.67 },
  { annotatorId: "azEvj", totalAnnotations: 8, avgLeadTime: 40.66, leadTimeDiffVsAverage: -11.27, avgAgreement: 81.25 },
  { annotatorId: "7JMHx", totalAnnotations: 8, avgLeadTime: 56.68, leadTimeDiffVsAverage: 4.75, avgAgreement: 68.75 },
  { annotatorId: "wcLJ8", totalAnnotations: 8, avgLeadTime: 58.18, leadTimeDiffVsAverage: 6.25, avgAgreement: 62.5 },
  { annotatorId: "kabTG", totalAnnotations: 5, avgLeadTime: 53.61, leadTimeDiffVsAverage: 1.68, avgAgreement: 80 },
];

const accuracy: AnnotatorAccuracy[] = [
  { annotatorId: "2w04p", tasksComparedAgainstGroundTruth: 1, correctAnswers: 0, accuracyPercent: 0, flaggedForReview: true },
  { annotatorId: "RWIej", tasksComparedAgainstGroundTruth: 1, correctAnswers: 0, accuracyPercent: 0, flaggedForReview: true },
  { annotatorId: "zkyxz", tasksComparedAgainstGroundTruth: 4, correctAnswers: 1, accuracyPercent: 25, flaggedForReview: true },
  { annotatorId: "kabTG", tasksComparedAgainstGroundTruth: 2, correctAnswers: 1, accuracyPercent: 50, flaggedForReview: true },
  { annotatorId: "76lWW", tasksComparedAgainstGroundTruth: 3, correctAnswers: 2, accuracyPercent: 66.67, flaggedForReview: true },
  { annotatorId: "Cx121", tasksComparedAgainstGroundTruth: 4, correctAnswers: 3, accuracyPercent: 75, flaggedForReview: false },
  { annotatorId: "azEvj", tasksComparedAgainstGroundTruth: 1, correctAnswers: 1, accuracyPercent: 100, flaggedForReview: false },
  { annotatorId: "7JMHx", tasksComparedAgainstGroundTruth: 1, correctAnswers: 1, accuracyPercent: 100, flaggedForReview: false },
  { annotatorId: "xpkWQ", tasksComparedAgainstGroundTruth: 1, correctAnswers: 1, accuracyPercent: 100, flaggedForReview: false },
];

export const PROJECT_AVG_LEAD_TIME = 51.93;
export const PROJECT_AVG_ACCURACY = 57.41;
export const FLAG_THRESHOLD = 70;

export function getDashboardData(): DashboardAnnotator[] {
  const accuracyMap = new Map(accuracy.map((a) => [a.annotatorId, a]));

  return analytics
    .map((a) => {
      const acc = accuracyMap.get(a.annotatorId);
      return {
        id: a.annotatorId,
        totalAnnotations: a.totalAnnotations,
        avgLeadTime: a.avgLeadTime,
        leadTimeDiffVsAverage: a.leadTimeDiffVsAverage,
        avgAgreement: a.avgAgreement,
        accuracyPercent: acc?.accuracyPercent ?? null,
        tasksCompared: acc?.tasksComparedAgainstGroundTruth ?? 0,
        correctAnswers: acc?.correctAnswers ?? 0,
        flagged: acc?.flaggedForReview ?? false,
      };
    })
    .sort((a, b) => b.totalAnnotations - a.totalAnnotations);
}

export const flaggedAnnotators = accuracy.filter((a) => a.flaggedForReview).map((a) => a.annotatorId);
export const passingAnnotators = accuracy.filter((a) => !a.flaggedForReview).map((a) => a.annotatorId);