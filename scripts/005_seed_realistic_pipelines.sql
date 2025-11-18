-- Add realistic pipeline data based on reference screenshots
-- This will populate the pipelines table with various recruitment pipelines

-- First, let's clear existing test pipelines (keep only if needed)
-- DELETE FROM pipelines WHERE name IN ('US College Recruitment', 'European Pathway', 'UK Academy Pipeline');

-- Insert realistic pipelines from reference screenshots
INSERT INTO pipelines (name, description, created_at, updated_at) VALUES
('UCLan 2024', 'University of Central Lancashire 2024 recruitment pipeline', NOW(), NOW()),
('Barça University', 'FC Barcelona University recruitment programme', NOW(), NOW()),
('UCLan 2024 MKS', 'UCLan 2024 MKS cohort pipeline', NOW(), NOW()),
('BARCA GAP YEAR 2025', 'Barcelona Gap Year programme for 2025', NOW(), NOW()),
('Juventus Training Experience', 'Juventus Football Club training experience programme', NOW(), NOW()),
('UCLan 2023 - MKS', 'UCLan 2023 MKS cohort pipeline', NOW(), NOW()),
('UK GAP 2025', 'UK Gap Year programme 2025', NOW(), NOW()),
('UCLan 2024 TW', 'UCLan 2024 TW cohort pipeline', NOW(), NOW()),
('Barcelona Residency', 'Barcelona residential training programme', NOW(), NOW()),
('BARCA YEAR', 'Barcelona Year programme', NOW(), NOW()),
('Juventus Training Experience 2024', 'Juventus training experience 2024 cohort', NOW(), NOW()),
('Summer Residency 2025', 'Summer residential programme 2025', NOW(), NOW()),
('Summer Residency 2024 - AK', 'Summer 2024 residency - AK cohort', NOW(), NOW()),
('Gap 2023', 'Gap year programme 2023', NOW(), NOW()),
('UCLan 2024 PE', 'UCLan 2024 PE cohort pipeline', NOW(), NOW()),
('Barça 2023 - LH', 'Barcelona 2023 LH cohort', NOW(), NOW()),
('Summer Residency 2024 - MH', 'Summer 2024 residency - MH cohort', NOW(), NOW()),
('US College Recruitment', 'US College recruitment pipeline', NOW(), NOW()),
('European Pathway', 'European football pathway programme', NOW(), NOW()),
('UK Academy Pipeline', 'UK Academy recruitment pipeline', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;
