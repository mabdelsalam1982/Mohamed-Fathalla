export interface JobDescription {
  roleTitle: string;
  companyName: string;
  location: string;
  employmentType: string;
  compensation: string;
  hook: string;
  aboutTheRole: string;
  responsibilities: string[];
  mustHaveHardSkills: string[];
  mustHaveSoftSkills: string[];
  niceToHaveSkills: string[];
  whyJoinUs: string[];
  linkedInPostFormatted: string;
}

export interface QuestionRubric {
  strongSignal: string[];
  neutralSignal: string[];
  redFlags: string[];
}

export interface BehavioralQuestion {
  number: number;
  skillTarget: string;
  skillType: 'hard' | 'soft' | string;
  category: string;
  jdDirectMapping: string;
  question: string;
  probingQuestions: string[];
  rubric: QuestionRubric;
  scoringGuidance: string;
}

export interface InterviewGuide {
  targetRole: string;
  seniorityLevel: string;
  competencyFocus: {
    hardSkillsTargeted: string[];
    softSkillsTargeted: string[];
  };
  questions: BehavioralQuestion[];
  interviewerDebriefAdvice: string;
}

export interface RecruitmentSuite {
  jobDescription: JobDescription;
  interviewGuide: InterviewGuide;
}

export interface CandidateScore {
  rating: number; // 1 to 5
  notes: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}
