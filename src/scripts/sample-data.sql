-- Sample Business Cases for Caseforge
-- This script adds realistic business cases across different domains

-- --------------------------------------------
-- 📊 SAMPLE BUSINESS CASES
-- --------------------------------------------

INSERT INTO cases (title, domain, brief, evaluation_criteria, difficulty, estimated_time, tags, is_active) VALUES
(
  'TechStart Expansion Strategy',
  'Strategy',
  'TechStart, a successful SaaS company with $10M ARR, is considering expanding into the European market. They currently serve 500 US-based customers and have a team of 50 employees. The CEO wants to understand the best approach for international expansion, including market entry strategy, resource allocation, and potential challenges.',
  'Market analysis, Entry strategy, Resource planning, Risk assessment, Implementation timeline',
  2,
  45,
  ARRAY['expansion', 'international', 'SaaS', 'market-entry'],
  true
),
(
  'GreenEnergy Cost Optimization',
  'Operations',
  'GreenEnergy, a renewable energy provider, is facing increasing operational costs while maintaining competitive pricing. They operate 15 wind farms and 8 solar facilities across 3 states. The operations team needs to identify cost reduction opportunities without compromising service quality or safety standards.',
  'Cost analysis, Process optimization, Quality maintenance, Safety compliance, ROI calculation',
  3,
  60,
  ARRAY['operations', 'cost-optimization', 'renewable-energy', 'process-improvement'],
  true
),
(
  'RetailChain Digital Transformation',
  'Technology',
  'RetailChain, a traditional brick-and-mortar retailer with 200 stores, is struggling to compete with e-commerce giants. They have basic online presence but need a comprehensive digital transformation strategy. The board wants to understand the investment required, timeline, and expected ROI.',
  'Digital strategy, Technology assessment, Investment analysis, Change management, ROI projection',
  2,
  50,
  ARRAY['digital-transformation', 'retail', 'e-commerce', 'technology'],
  true
),
(
  'HealthTech Market Entry',
  'Marketing',
  'HealthTech, a startup developing AI-powered diagnostic tools, is preparing to launch their first product. They have FDA approval and $5M in funding. The marketing team needs to develop a go-to-market strategy targeting healthcare providers and patients.',
  'Target market analysis, Positioning strategy, Marketing channels, Budget allocation, Success metrics',
  1,
  40,
  ARRAY['healthcare', 'AI', 'startup', 'go-to-market', 'marketing'],
  true
),
(
  'ManufacturingCo Supply Chain Crisis',
  'Operations',
  'ManufacturingCo, a global manufacturer, is experiencing severe supply chain disruptions due to geopolitical tensions and natural disasters. They supply components to automotive and aerospace industries. The operations team needs to develop a resilient supply chain strategy.',
  'Supply chain analysis, Risk mitigation, Alternative sourcing, Cost impact, Implementation plan',
  3,
  75,
  ARRAY['supply-chain', 'manufacturing', 'risk-management', 'global-operations'],
  true
),
(
  'FinTech Regulatory Compliance',
  'Finance',
  'FinTech, a digital payment platform, is expanding into new markets and facing complex regulatory requirements. They process $2B in transactions annually and serve 1M users. The compliance team needs to develop a regulatory strategy for multiple jurisdictions.',
  'Regulatory analysis, Compliance framework, Risk assessment, Implementation cost, Timeline planning',
  2,
  55,
  ARRAY['fintech', 'compliance', 'regulations', 'payments'],
  true
),
(
  'EduTech Product Launch',
  'Marketing',
  'EduTech, an educational technology company, is launching a new AI-powered learning platform for K-12 students. They have partnerships with 50 schools and $3M in funding. The marketing team needs to create awareness and drive adoption among educators and parents.',
  'Target audience analysis, Value proposition, Marketing channels, Partnership strategy, Adoption metrics',
  1,
  35,
  ARRAY['education', 'AI', 'product-launch', 'B2B2C'],
  true
),
(
  'ConsultingFirm Merger Strategy',
  'Strategy',
  'ConsultingFirm, a mid-sized management consulting company, is considering a merger with a larger competitor. They have 200 consultants and $50M in revenue. The leadership team needs to evaluate the strategic fit, cultural alignment, and integration challenges.',
  'Strategic fit analysis, Cultural assessment, Integration planning, Risk evaluation, Value creation',
  3,
  70,
  ARRAY['merger', 'consulting', 'integration', 'strategy'],
  true
),
(
  'LogisticsCo Route Optimization',
  'Operations',
  'LogisticsCo, a delivery company with 500 vehicles, is looking to optimize their delivery routes using AI and data analytics. They deliver 10,000 packages daily across 5 states. The operations team needs to implement a route optimization system.',
  'Current process analysis, Technology requirements, Implementation strategy, Cost-benefit analysis, Success metrics',
  2,
  45,
  ARRAY['logistics', 'AI', 'optimization', 'operations'],
  true
),
(
  'RealEstateTech Market Analysis',
  'Finance',
  'RealEstateTech, a proptech startup, is analyzing investment opportunities in the commercial real estate market. They have $10M in capital and are looking at office, retail, and industrial properties. The investment team needs to develop an investment strategy.',
  'Market analysis, Investment criteria, Risk assessment, Portfolio strategy, Return expectations',
  2,
  50,
  ARRAY['real-estate', 'investment', 'proptech', 'commercial'],
  true
);

-- --------------------------------------------
-- 📅 SET UP DAILY CHALLENGE
-- --------------------------------------------

-- Set today's daily challenge (replace with actual case ID from above)
INSERT INTO daily_challenges (case_id, challenge_date, is_active)
SELECT 
  id as case_id,
  CURRENT_DATE as challenge_date,
  true as is_active
FROM cases 
WHERE title = 'HealthTech Market Entry'
LIMIT 1;

-- --------------------------------------------
-- 🏆 ADD MORE ACHIEVEMENTS
-- --------------------------------------------

INSERT INTO achievements (name, description, criteria, points) VALUES
('Case Explorer', 'Complete cases from 3 different domains', '{"domains_covered": 3}', 30),
('Speed Solver', 'Complete a case in under 30 minutes', '{"fast_completion": 1}', 20),
('Quality Analyst', 'Achieve 90%+ score on 5 cases', '{"high_scores": 5}', 75),
('Domain Master', 'Complete 20 cases in a single domain', '{"domain_mastery": 20}', 150),
('Weekend Warrior', 'Solve cases on 3 consecutive weekends', '{"weekend_streak": 3}', 40),
('Early Bird', 'Complete the daily challenge before 9 AM', '{"early_completion": 1}', 15),
('Night Owl', 'Complete a case after 10 PM', '{"late_completion": 1}', 15),
('Feedback Champion', 'Submit detailed feedback on 10 cases', '{"feedback_count": 10}', 50),
('Consistency King', 'Maintain a 30-day streak', '{"long_streak": 30}', 200),
('Perfect Week', 'Complete 7 cases in 7 days', '{"perfect_week": 1}', 100);

-- --------------------------------------------
-- 📊 ADD SAMPLE USER STATS (for testing)
-- --------------------------------------------

-- This will be populated automatically when users sign up and solve cases
-- No need to insert manually as the onboarding system handles this 