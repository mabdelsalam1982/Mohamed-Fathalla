export interface SampleRole {
  id: string;
  title: string;
  department: string;
  seniority: string;
  notes: string;
  recommendedTone: string;
  workModel: string;
}

export const SAMPLE_ROLES: SampleRole[] = [
  {
    id: 'staff-ai-engineer',
    title: 'Staff AI Infrastructure & LLM Platform Engineer',
    department: 'Engineering & Platform',
    seniority: 'Staff / Principal',
    recommendedTone: 'Direct & Technical',
    workModel: 'Remote (US/Canada)',
    notes: `Need a Staff AI Platform engineer to lead our genAI serving layer.
Current pain points:
- LLM inference latency is killing our margins and p99 is 4.8 seconds on vLLM clusters.
- Need someone who has actually run Triton / TensorRT-LLM or vLLM at scale (hundreds of GPUs).
- We use Python, PyTorch, Kubernetes, Ray, and CUDA profiling.
- Soft skills are critical: they need to mentor 4 junior/mid ML engineers and push back against Product when they ask for unrealistic real-time audio features without budget.
- Must know distributed caching (Redis/Milvus for vector search) and model quantization (FP8, AWQ).
- We pay competitively: around $210k - $265k base + significant equity. Full remote, US/Canada.
- They will own the infrastructure roadmap and partner directly with our VP of Eng.
- No resume polishers who just imported OpenAI API wrapper libraries; need real systems depth.`,
  },
  {
    id: 'lead-product-manager',
    title: 'Lead Product Manager — Growth & Self-Serve PLG',
    department: 'Product',
    seniority: 'Lead / Principal',
    recommendedTone: 'Engaging & Modern',
    workModel: 'Hybrid (San Francisco, CA)',
    notes: `Hiring a Lead PM for our Product-Led Growth (PLG) squad.
Context:
- We have 120,000 monthly active users on free tier, but our self-serve trial conversion to paid tier is stuck at 1.8%.
- Need a growth operator who lives in PostHog, SQL, Amplitude, and conducts weekly rapid experimentation (A/B testing on onboarding, paywalls, viral loops).
- Must have high customer empathy: talk to 5+ churned and paying customers weekly.
- Cross-functional leadership is make-or-break: will manage 1 dedicated growth designer and 5 fullstack engineers. Needs to run crisp sprint rituals and translate vague business goals into ruthless backlog prioritization.
- Nice to have: experience in B2B SaaS developer tools or creative tooling.
- Compensation: $185k - $225k base + equity + 401(k) match. Hybrid 2 days in SF office.`,
  },
  {
    id: 'director-people-ops',
    title: 'Director of People & Talent Acquisition',
    department: 'People & Operations',
    seniority: 'Director / Executive',
    recommendedTone: 'Inclusive & Values-Driven',
    workModel: 'Remote (Global)',
    notes: `We're scaling fast from 65 to 180 team members across 14 countries in the next 14 months.
Role needs:
- First dedicated People leader. Must build the global talent acquisition engine from scratch (currently founders are doing interviews on weekends).
- Implement structured hiring, compensation bands (Option Impact / Radford benchmarks), and reduce our average time-to-hire from 62 days to under 32 days.
- Culture resilience: protect our high-autonomy, async-first remote culture without introducing bureaucratic HR bloat.
- Must have navigated difficult employee relations, performance management, and DEI frameworks in distributed teams.
- Looking for high emotional intelligence, diplomatic firmness, and executive presence to sit in weekly leadership meetings.
- Budget: $170k - $210k + executive equity grant.`,
  },
  {
    id: 'principal-cloud-architect',
    title: 'Principal Cloud & Security Solutions Architect',
    department: 'Cloud Solutions',
    seniority: 'Principal',
    recommendedTone: 'Executive & Rigorous',
    workModel: 'Remote / US',
    notes: `Seeking a Principal Cloud Architect to lead enterprise migration and multi-cloud resilience (AWS + GCP).
Key requirements:
- Design zero-trust architectures, SOC2 / HIPAA compliant landing zones, and automated Terraform/Terragrunt infrastructure.
- Hard skill: deep expertise in container orchestration (EKS/GKE), service mesh (Istio), and cloud cost governance (FinOps - we need to shave 25% off our $1.2M cloud bill).
- Soft skill: client-facing diplomacy. They will frequently join our Enterprise Sales calls with Fortune 500 CISOs to dismantle security objections.
- Incident command: must have been the incident commander for severe production outages and led blameless post-mortems with executives.
- Compensation: $220k - $260k + 20% annual performance bonus.`,
  },
];
