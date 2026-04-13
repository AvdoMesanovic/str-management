-- ============================================================================
-- STR Management — Seed Data
-- Mirrors the mock data from src/data/mockData.ts and src/data/mockClients.ts
-- ============================================================================

-- Fixed UUIDs for referential integrity across seed data
-- Clients
-- C-01: Sarah Johnson     = 11111111-0001-4000-a000-000000000001
-- C-02: Michael Chen      = 11111111-0002-4000-a000-000000000002
-- C-03: Jennifer Martinez = 11111111-0003-4000-a000-000000000003
-- C-04: Robert Williams   = 11111111-0004-4000-a000-000000000004
-- C-05: Emily Thompson    = 11111111-0005-4000-a000-000000000005
-- C-06: David Anderson    = 11111111-0006-4000-a000-000000000006

-- Properties
-- P-01: Dogtown House A         = 22222222-0001-4000-a000-000000000001
-- P-02: Soulard Loft B          = 22222222-0002-4000-a000-000000000002
-- P-03: Tower Grove Suite       = 22222222-0003-4000-a000-000000000003
-- P-04: The Hill Villa C        = 22222222-0004-4000-a000-000000000004
-- P-05: CWE Penthouse           = 22222222-0005-4000-a000-000000000005
-- P-06: University City Studio  = 22222222-0006-4000-a000-000000000006

-- Guests
-- G-01 through G-10             = 33333333-00XX-4000-a000-000000000001..10

-- Bookings
-- B-01 through B-10             = 44444444-00XX-4000-a000-000000000001..10

-- Market Events
-- E-01 through E-15             = 55555555-00XX-4000-a000-000000000001..15

-- ============================================================================
-- CLIENTS
-- ============================================================================

INSERT INTO client (id, name, email, phone, join_date, status, preferred_contact, notes) VALUES
  ('11111111-0001-4000-a000-000000000001', 'Sarah Johnson',     'sarah.johnson@email.com', '(314) 555-0123', '2024-01-15', 'active',   'email', 'Excellent client - always responsive. Owns premium properties in CWE and Dogtown.'),
  ('11111111-0002-4000-a000-000000000002', 'Michael Chen',      'mchen@email.com',         '(314) 555-0456', '2023-08-22', 'active',   'text',  'Prefers minimal communication. Automated systems work best.'),
  ('11111111-0003-4000-a000-000000000003', 'Jennifer Martinez', 'jmartinez@email.com',     '(314) 555-0789', '2025-02-10', 'active',   'phone', 'New investor - requires frequent updates and hand-holding.'),
  ('11111111-0004-4000-a000-000000000004', 'Robert Williams',   'rwilliams@email.com',     '(314) 555-0321', '2022-11-05', 'active',   'email', 'Long-term client. High-volume property on The Hill. Experienced investor.'),
  ('11111111-0005-4000-a000-000000000005', 'Emily Thompson',    'ethompson@email.com',     '(314) 555-0654', '2026-03-15', 'pending',  'email', 'Onboarding in progress. Property inspection scheduled for next week.'),
  ('11111111-0006-4000-a000-000000000006', 'David Anderson',    'danderson@email.com',     '(314) 555-0987', '2024-06-20', 'inactive', 'phone', 'Property sold in Q4 2025. Maintaining relationship for future opportunities.');

-- ============================================================================
-- PROPERTIES
-- ============================================================================

INSERT INTO property (id, client_id, name, address, bedrooms, bathrooms, risk_level, risk_reason, compliance_progress, safety_score, listing_active, pricelabs_synced, listing_description, listing_photo_count, occupied_temp, empty_temp, avg_temp_adj, sms_enabled, alarm_battery_level, alarm_last_tested, lock_status, leak_status, main_valve, monthly_savings) VALUES
  (
    '22222222-0001-4000-a000-000000000001',
    '11111111-0001-4000-a000-000000000001',
    '63139 Dogtown House A',
    '1234 Tamm Ave, St. Louis, MO 63139',
    2, 1.0, 'high',
    'Cardinals Home Game tonight + High Historic Volume',
    85, 92, true, true,
    'Charming Dogtown bungalow steps from iconic Tamm Ave bars and restaurants. Perfect for Cardinals fans — walk to Busch Stadium. Modern amenities, original hardwoods.',
    18, 70, 65, 3, true, 87, '2026-03-15',
    'online', 'clear', 'open', 48.00
  ),
  (
    '22222222-0002-4000-a000-000000000002',
    '11111111-0002-4000-a000-000000000002',
    '63108 Soulard Loft B',
    '567 Russell Blvd, St. Louis, MO 63108',
    1, 1.0, 'low',
    'Normal operations - Low occupancy period',
    100, 98, true, true,
    'Gorgeous renovated loft in the heart of Soulard. Steps from the Soulard Farmers Market. Exposed brick, soaring ceilings, and a rooftop deck with city views.',
    24, 71, 66, 4, true, 94, '2026-03-20',
    'online', 'clear', 'open', 62.00
  ),
  (
    '22222222-0003-4000-a000-000000000003',
    '11111111-0003-4000-a000-000000000003',
    '63104 Tower Grove Suite',
    '890 S Grand Blvd, St. Louis, MO 63104',
    1, 1.0, 'medium',
    'First-time guest + Weekend booking',
    72, 88, true, true,
    'Modern suite steps from the S. Grand restaurant corridor and Tower Grove Park. Ideal for foodies, walkers, and culture seekers. Fully equipped kitchen, fast WiFi.',
    14, 69, 64, 3, true, 71, '2026-02-28',
    'online', 'clear', 'open', 35.00
  ),
  (
    '22222222-0004-4000-a000-000000000004',
    '11111111-0004-4000-a000-000000000004',
    '63118 The Hill Villa C',
    '2345 Shaw Ave, St. Louis, MO 63118',
    4, 2.0, 'critical',
    'Multiple concurrent events: Blues game + Convention + Large group booking',
    45, 75, true, false,
    'Spacious Italian-American villa on the historic Hill neighborhood. Sleeps 10, full chef''s kitchen, private courtyard. Walk to award-winning restaurants. Perfect for groups.',
    22, 72, 67, 2, true, 45, '2026-01-10',
    'offline', 'critical', 'open', 28.00
  ),
  (
    '22222222-0005-4000-a000-000000000005',
    '11111111-0001-4000-a000-000000000001',
    '63110 Central West End Penthouse',
    '456 Maryland Ave, St. Louis, MO 63110',
    2, 2.0, 'low',
    'Verified repeat guest - Excellent history',
    95, 99, true, true,
    'Luxurious top-floor penthouse in the heart of CWE. Panoramic city views, Bose sound system, chef''s kitchen, and concierge-style amenities. Walk to Whole Foods, Barnes-Jewish area.',
    31, 70, 64, 5, true, 98, '2026-03-28',
    'online', 'clear', 'open', 74.00
  ),
  (
    '22222222-0006-4000-a000-000000000006',
    '11111111-0003-4000-a000-000000000003',
    '63130 University City Studio',
    '789 Delmar Loop, St. Louis, MO 63130',
    1, 1.0, 'medium',
    'Extended stay booking - Week 2 of 4',
    88, 91, true, true,
    'Stylish studio on the vibrant Delmar Loop. Walk to 50+ restaurants, live music venues, and Blueberry Hill. Perfect for WashU/SLU visitors, academics, and urban explorers. Forest Park: Hot Chocolate recommendations added.',
    11, 68, 63, 3, false, 82, '2026-03-10',
    'online', 'clear', 'open', 29.00
  );

-- ============================================================================
-- GUESTS
-- ============================================================================

INSERT INTO guest (id, name, email, phone, notes, is_flagged) VALUES
  ('33333333-0001-4000-a000-000000000001', 'Marcus T.',              NULL, NULL, '', false),
  ('33333333-0002-4000-a000-000000000002', 'Priya K.',               NULL, NULL, '', false),
  ('33333333-0003-4000-a000-000000000003', 'James R.',               NULL, NULL, '', false),
  ('33333333-0004-4000-a000-000000000004', 'Laura M.',               NULL, NULL, '', false),
  ('33333333-0005-4000-a000-000000000005', 'David W.',               NULL, NULL, '', false),
  ('33333333-0006-4000-a000-000000000006', 'Samantha B.',            NULL, NULL, '', false),
  ('33333333-0007-4000-a000-000000000007', 'Kevin O.',               NULL, NULL, '', false),
  ('33333333-0008-4000-a000-000000000008', 'Connor F.',              NULL, NULL, '', false),
  ('33333333-0009-4000-a000-000000000009', 'Rachel & Tom B.',        NULL, NULL, '', false),
  ('33333333-0010-4000-a000-000000000010', 'Dr. Aisha P. (WashU)',   NULL, NULL, '', false);

-- ============================================================================
-- BOOKINGS
-- ============================================================================

INSERT INTO booking (id, property_id, guest_id, check_in, check_out, status, source, guest_count, notes) VALUES
  -- P-01 Dogtown House A
  ('44444444-0001-4000-a000-000000000001', '22222222-0001-4000-a000-000000000001', '33333333-0001-4000-a000-000000000001',
   '2026-04-01 15:00:00-05', '2026-04-03 11:00:00-05', 'checked_in', 'hospitable', 2, ''),
  ('44444444-0002-4000-a000-000000000002', '22222222-0001-4000-a000-000000000001', '33333333-0002-4000-a000-000000000002',
   '2026-03-28 15:00:00-05', '2026-04-01 11:00:00-05', 'checked_out', 'hospitable', 1, ''),
  ('44444444-0003-4000-a000-000000000003', '22222222-0001-4000-a000-000000000001', '33333333-0003-4000-a000-000000000003',
   '2026-03-24 16:00:00-05', '2026-03-28 10:00:00-05', 'checked_out', 'airbnb', 1, ''),

  -- P-02 Soulard Loft B
  ('44444444-0004-4000-a000-000000000004', '22222222-0002-4000-a000-000000000002', '33333333-0004-4000-a000-000000000004',
   '2026-04-02 15:00:00-05', '2026-04-06 11:00:00-05', 'checked_in', 'hospitable', 2, ''),
  ('44444444-0005-4000-a000-000000000005', '22222222-0002-4000-a000-000000000002', '33333333-0005-4000-a000-000000000005',
   '2026-03-30 16:00:00-05', '2026-04-02 10:00:00-05', 'checked_out', 'vrbo', 1, ''),

  -- P-03 Tower Grove Suite
  ('44444444-0006-4000-a000-000000000006', '22222222-0003-4000-a000-000000000003', '33333333-0006-4000-a000-000000000006',
   '2026-04-01 16:00:00-05', '2026-04-04 11:00:00-05', 'checked_in', 'direct', 1, ''),
  ('44444444-0007-4000-a000-000000000007', '22222222-0003-4000-a000-000000000003', '33333333-0007-4000-a000-000000000007',
   '2026-03-27 15:00:00-05', '2026-04-01 10:00:00-05', 'checked_out', 'hospitable', 1, ''),

  -- P-04 The Hill Villa C
  ('44444444-0008-4000-a000-000000000008', '22222222-0004-4000-a000-000000000004', '33333333-0008-4000-a000-000000000008',
   '2026-04-01 14:00:00-05', '2026-04-03 10:00:00-05', 'checked_in', 'hospitable', 8, 'Large group booking'),

  -- P-05 CWE Penthouse
  ('44444444-0009-4000-a000-000000000009', '22222222-0005-4000-a000-000000000005', '33333333-0009-4000-a000-000000000009',
   '2026-03-31 15:00:00-05', '2026-04-05 12:00:00-05', 'checked_in', 'direct', 2, 'Repeat guest - VIP'),

  -- P-06 University City Studio
  ('44444444-0010-4000-a000-000000000010', '22222222-0006-4000-a000-000000000006', '33333333-0010-4000-a000-000000000010',
   '2026-03-22 15:00:00-05', '2026-04-19 11:00:00-05', 'checked_in', 'hospitable', 1, 'Extended stay - WashU academic');

-- ============================================================================
-- ACCESS CODES
-- ============================================================================

INSERT INTO access_code (property_id, booking_id, code, guest_name, type, status, valid_from, valid_until) VALUES
  -- P-01 guest codes
  ('22222222-0001-4000-a000-000000000001', '44444444-0001-4000-a000-000000000001', '4829', 'Marcus T.',   'guest', 'active',  '2026-04-01 15:00:00-05', '2026-04-03 11:00:00-05'),
  ('22222222-0001-4000-a000-000000000001', '44444444-0002-4000-a000-000000000002', '7341', 'Priya K.',    'guest', 'expired', '2026-03-28 15:00:00-05', '2026-04-01 11:00:00-05'),
  ('22222222-0001-4000-a000-000000000001', '44444444-0003-4000-a000-000000000003', '1056', 'James R.',    'guest', 'expired', '2026-03-24 16:00:00-05', '2026-03-28 10:00:00-05'),

  -- P-02 guest codes
  ('22222222-0002-4000-a000-000000000002', '44444444-0004-4000-a000-000000000004', '3314', 'Laura M.',    'guest', 'active',  '2026-04-02 15:00:00-05', '2026-04-06 11:00:00-05'),
  ('22222222-0002-4000-a000-000000000002', '44444444-0005-4000-a000-000000000005', '9902', 'David W.',    'guest', 'expired', '2026-03-30 16:00:00-05', '2026-04-02 10:00:00-05'),

  -- P-03 guest codes
  ('22222222-0003-4000-a000-000000000003', '44444444-0006-4000-a000-000000000006', '6671', 'Samantha B.', 'guest', 'active',  '2026-04-01 16:00:00-05', '2026-04-04 11:00:00-05'),
  ('22222222-0003-4000-a000-000000000003', '44444444-0007-4000-a000-000000000007', '2248', 'Kevin O.',    'guest', 'expired', '2026-03-27 15:00:00-05', '2026-04-01 10:00:00-05'),

  -- P-04 guest codes
  ('22222222-0004-4000-a000-000000000004', '44444444-0008-4000-a000-000000000008', '0088', 'Group Booking (8)', 'guest', 'active', '2026-04-01 14:00:00-05', '2026-04-03 10:00:00-05'),
  ('22222222-0004-4000-a000-000000000004', NULL,                                   '5512', 'Connor F.',         'guest', 'expired','2026-03-26 16:00:00-05', '2026-04-01 11:00:00-05'),

  -- P-05 guest codes
  ('22222222-0005-4000-a000-000000000005', '44444444-0009-4000-a000-000000000009', '9921', 'Rachel & Tom B.',         'guest', 'active',  '2026-03-31 15:00:00-05', '2026-04-05 12:00:00-05'),
  ('22222222-0005-4000-a000-000000000005', NULL,                                   '4477', 'Corporate Guest - Apex LLC','guest', 'expired','2026-03-25 16:00:00-05', '2026-03-31 10:00:00-05'),

  -- P-06 guest codes
  ('22222222-0006-4000-a000-000000000006', '44444444-0010-4000-a000-000000000010', '7766', 'Dr. Aisha P. (WashU)', 'guest', 'active', '2026-03-22 15:00:00-05', '2026-04-19 11:00:00-05'),

  -- Standalone operational codes (no booking)
  ('22222222-0001-4000-a000-000000000001', NULL, '9999', 'Cleaning Crew A', 'cleaner',     'active', '2026-01-01 00:00:00-06', '2026-12-31 23:59:59-06'),
  ('22222222-0004-4000-a000-000000000004', NULL, '1234', 'Owner - Robert',  'owner',       'active', '2022-11-05 00:00:00-06', '2027-12-31 23:59:59-06'),
  ('22222222-0002-4000-a000-000000000002', NULL, '5555', 'HVAC Maintenance','maintenance', 'active', '2026-04-01 08:00:00-05', '2026-04-30 18:00:00-05');

-- ============================================================================
-- FINANCIAL PERIODS (monthly snapshots — sample: March & April 2026)
-- ============================================================================

INSERT INTO financial_period (property_id, period_year, period_month, gross_rent, tax_liability, tax_readiness, monthly_roi, remittance_days, remittance_period) VALUES
  -- March 2026
  ('22222222-0001-4000-a000-000000000001', 2026, 3, 4250.00,  127.50, 85, 18.50, 90, 'Q2 Filing'),
  ('22222222-0002-4000-a000-000000000002', 2026, 3, 5800.00,  174.00, 100, 22.30, 90, 'Q2 Filing'),
  ('22222222-0003-4000-a000-000000000003', 2026, 3, 3100.00,   93.00, 72, 16.80, 90, 'Q2 Filing'),
  ('22222222-0004-4000-a000-000000000004', 2026, 3, 7200.00,  216.00, 45, 25.70, 90, 'Q2 Filing'),
  ('22222222-0005-4000-a000-000000000005', 2026, 3, 8500.00,  255.00, 95, 28.20, 90, 'Q2 Filing'),
  ('22222222-0006-4000-a000-000000000006', 2026, 3, 2400.00,   72.00, 88, 14.50, 90, 'Q2 Filing'),

  -- April 2026 (current month — partial)
  ('22222222-0001-4000-a000-000000000001', 2026, 4, 2100.00,   63.00, 85, 9.20, 90, 'Q2 Filing'),
  ('22222222-0002-4000-a000-000000000002', 2026, 4, 2900.00,   87.00, 100, 11.10, 90, 'Q2 Filing'),
  ('22222222-0003-4000-a000-000000000003', 2026, 4, 1500.00,   45.00, 72, 8.40, 90, 'Q2 Filing'),
  ('22222222-0004-4000-a000-000000000004', 2026, 4, 3600.00,  108.00, 45, 12.80, 90, 'Q2 Filing'),
  ('22222222-0005-4000-a000-000000000005', 2026, 4, 4200.00,  126.00, 95, 14.10, 90, 'Q2 Filing'),
  ('22222222-0006-4000-a000-000000000006', 2026, 4, 1200.00,   36.00, 88, 7.20, 90, 'Q2 Filing');

-- ============================================================================
-- ACTIVITY LOG
-- ============================================================================

INSERT INTO activity_log (property_id, booking_id, type, message, occurred_at) VALUES
  -- P-01 Dogtown House A
  ('22222222-0001-4000-a000-000000000001', '44444444-0001-4000-a000-000000000001', 'automated', 'AC set-point limited to 72° (Energy Saving)',                    '2026-04-01 14:02:00-05'),
  ('22222222-0001-4000-a000-000000000001', '44444444-0001-4000-a000-000000000001', 'automated', 'Sent automated check-in code via Schlage API',                   '2026-04-01 16:45:00-05'),
  ('22222222-0001-4000-a000-000000000001', '44444444-0001-4000-a000-000000000001', 'alert',     'Proactive noise warning sent to guest (dB spike detected)',       '2026-04-01 19:12:00-05'),
  ('22222222-0001-4000-a000-000000000001', '44444444-0001-4000-a000-000000000001', 'manual',    'Manager reviewed guest profile - flagged for follow-up',          '2026-04-01 20:05:00-05'),
  ('22222222-0001-4000-a000-000000000001', '44444444-0001-4000-a000-000000000001', 'automated', 'Noise level normalized - auto-cleared alert',                     '2026-04-01 22:30:00-05'),

  -- P-02 Soulard Loft B
  ('22222222-0002-4000-a000-000000000002', NULL,                                   'automated', 'Smart lock battery check: 87% remaining',                        '2026-04-02 08:15:00-05'),
  ('22222222-0002-4000-a000-000000000002', '44444444-0005-4000-a000-000000000005', 'automated', 'Guest check-out completed - cleaning scheduled',                  '2026-04-02 10:30:00-05'),
  ('22222222-0002-4000-a000-000000000002', NULL,                                   'automated', 'Cleaning verified via photo upload',                              '2026-04-02 14:22:00-05'),
  ('22222222-0002-4000-a000-000000000002', '44444444-0004-4000-a000-000000000004', 'automated', 'New guest check-in code generated',                               '2026-04-02 15:45:00-05'),

  -- P-03 Tower Grove Suite
  ('22222222-0003-4000-a000-000000000003', '44444444-0006-4000-a000-000000000006', 'manual',    'Sent personalized welcome message with local recommendations',    '2026-04-01 11:20:00-05'),
  ('22222222-0003-4000-a000-000000000003', '44444444-0006-4000-a000-000000000006', 'automated', 'HVAC optimization: Adjusted to guest preference profile',         '2026-04-01 13:40:00-05'),
  ('22222222-0003-4000-a000-000000000003', '44444444-0006-4000-a000-000000000006', 'alert',     'First-time guest reminder: Check-in instructions sent',           '2026-04-01 17:15:00-05'),
  ('22222222-0003-4000-a000-000000000003', '44444444-0006-4000-a000-000000000006', 'automated', 'Guest successfully checked in - no issues reported',              '2026-04-01 18:50:00-05'),

  -- P-04 The Hill Villa C
  ('22222222-0004-4000-a000-000000000004', '44444444-0008-4000-a000-000000000008', 'automated', 'Group booking confirmed: 8 guests',                               '2026-04-01 09:00:00-05'),
  ('22222222-0004-4000-a000-000000000004', '44444444-0008-4000-a000-000000000008', 'alert',     'Pre-emptive noise policy reminder sent to guests',                '2026-04-01 12:30:00-05'),
  ('22222222-0004-4000-a000-000000000004', '44444444-0008-4000-a000-000000000008', 'manual',    'Manager note: Monitoring closely - high-risk night',              '2026-04-01 15:45:00-05'),
  ('22222222-0004-4000-a000-000000000004', '44444444-0008-4000-a000-000000000008', 'automated', 'Smart noise sensor: Currently 68dB (within limits)',              '2026-04-01 19:00:00-05'),
  ('22222222-0004-4000-a000-000000000004', '44444444-0008-4000-a000-000000000008', 'alert',     'Noise threshold breach detected - automated warning sent',        '2026-04-01 21:15:00-05'),
  ('22222222-0004-4000-a000-000000000004', '44444444-0008-4000-a000-000000000008', 'manual',    'Manager called guest - situation resolved amicably',               '2026-04-01 21:20:00-05'),

  -- P-05 CWE Penthouse
  ('22222222-0005-4000-a000-000000000005', '44444444-0009-4000-a000-000000000009', 'automated', 'Repeat guest recognition: VIP amenities prepared',                '2026-03-31 07:30:00-05'),
  ('22222222-0005-4000-a000-000000000005', '44444444-0009-4000-a000-000000000009', 'automated', 'Early check-in approved - unit ready',                             '2026-03-31 14:00:00-05'),
  ('22222222-0005-4000-a000-000000000005', '44444444-0009-4000-a000-000000000009', 'automated', 'Guest satisfaction survey sent (auto-timed)',                      '2026-03-31 16:20:00-05'),

  -- P-06 University City Studio
  ('22222222-0006-4000-a000-000000000006', '44444444-0010-4000-a000-000000000010', 'automated', 'Mid-stay maintenance check scheduled',                            '2026-04-05 10:15:00-05'),
  ('22222222-0006-4000-a000-000000000006', '44444444-0010-4000-a000-000000000010', 'manual',    'Housekeeping completed mid-stay refresh',                          '2026-04-05 11:45:00-05'),
  ('22222222-0006-4000-a000-000000000006', '44444444-0010-4000-a000-000000000010', 'automated', 'Guest feedback: 5-star rating received',                           '2026-04-05 13:00:00-05'),
  ('22222222-0006-4000-a000-000000000006', '44444444-0010-4000-a000-000000000010', 'automated', 'Energy usage tracking: On target for month',                       '2026-04-05 20:30:00-05');

-- ============================================================================
-- MARKET EVENTS
-- ============================================================================

INSERT INTO market_event (id, name, date_start, date_end, description) VALUES
  ('55555555-0001-4000-a000-000000000001', 'Cardinals Opening Day',              '2026-04-04', NULL,        'MLB season opener at Busch Stadium'),
  ('55555555-0002-4000-a000-000000000002', 'St. Pat''s Dogtown Parade',          '2026-04-05', NULL,        'Annual St. Patrick''s Day celebration in Dogtown'),
  ('55555555-0003-4000-a000-000000000003', 'Blues Playoff Game 1',               '2026-04-18', NULL,        'NHL Playoffs Round 1'),
  ('55555555-0004-4000-a000-000000000004', 'Blues Playoff Game 2',               '2026-04-20', NULL,        'NHL Playoffs Round 1'),
  ('55555555-0005-4000-a000-000000000005', 'St. Louis Marathon',                 '2026-04-05', NULL,        'Annual marathon through downtown St. Louis'),
  ('55555555-0006-4000-a000-000000000006', 'Cinco de Mayo - Soulard',            '2026-05-03', NULL,        'Cinco de Mayo celebrations in Soulard neighborhood'),
  ('55555555-0007-4000-a000-000000000007', 'Mardi Gras Soulard (post)',          '2026-04-08', NULL,        'Post-Mardi Gras events in Soulard'),
  ('55555555-0008-4000-a000-000000000008', 'Earth Day Festival - Tower Grove',   '2026-04-19', NULL,        'Earth Day Festival in Tower Grove Park'),
  ('55555555-0009-4000-a000-000000000009', 'S. Grand International Food Festival','2026-05-10', NULL,       'International food festival on South Grand'),
  ('55555555-0010-4000-a000-000000000010', 'Cardinals Home Series',              '2026-04-08', '2026-04-10','3-day home series at Busch Stadium'),
  ('55555555-0011-4000-a000-000000000011', 'MedTech Convention Downtown',        '2026-04-07', '2026-04-09','Medical technology conference at America''s Center'),
  ('55555555-0012-4000-a000-000000000012', 'Italian Heritage Festival - The Hill','2026-04-26', NULL,       'Annual heritage celebration on The Hill'),
  ('55555555-0013-4000-a000-000000000013', 'CWE Spring Art Fair',                '2026-04-26', '2026-04-27','Art fair in Central West End'),
  ('55555555-0014-4000-a000-000000000014', 'Forest Park Hot Chocolate 15k',      '2026-04-12', NULL,        'Running event through Forest Park'),
  ('55555555-0015-4000-a000-000000000015', 'WashU Commencement Weekend',         '2026-05-15', '2026-05-17','Washington University graduation weekend');

-- ============================================================================
-- PROPERTY EVENTS (junction with per-property overrides)
-- ============================================================================

INSERT INTO property_event (property_id, event_id, manual_override, pricing_notes) VALUES
  -- P-01 Dogtown House A
  ('22222222-0001-4000-a000-000000000001', '55555555-0001-4000-a000-000000000001', true,  NULL),  -- Cardinals Opening Day
  ('22222222-0001-4000-a000-000000000001', '55555555-0002-4000-a000-000000000002', true,  NULL),  -- St. Pat's Dogtown
  ('22222222-0001-4000-a000-000000000001', '55555555-0003-4000-a000-000000000003', false, NULL),  -- Blues Playoff 1
  ('22222222-0001-4000-a000-000000000001', '55555555-0005-4000-a000-000000000005', false, NULL),  -- Marathon

  -- P-02 Soulard Loft B
  ('22222222-0002-4000-a000-000000000002', '55555555-0006-4000-a000-000000000006', true,  NULL),  -- Cinco de Mayo
  ('22222222-0002-4000-a000-000000000002', '55555555-0007-4000-a000-000000000007', false, NULL),  -- Mardi Gras post
  ('22222222-0002-4000-a000-000000000002', '55555555-0004-4000-a000-000000000004', false, NULL),  -- Blues Playoff 2

  -- P-03 Tower Grove Suite
  ('22222222-0003-4000-a000-000000000003', '55555555-0008-4000-a000-000000000008', true,  NULL),  -- Earth Day
  ('22222222-0003-4000-a000-000000000003', '55555555-0009-4000-a000-000000000009', false, NULL),  -- Food Festival
  ('22222222-0003-4000-a000-000000000003', '55555555-0010-4000-a000-000000000010', false, NULL),  -- Cardinals Home Series

  -- P-04 The Hill Villa C
  ('22222222-0004-4000-a000-000000000004', '55555555-0003-4000-a000-000000000003', true,  NULL),  -- Blues Playoff 1
  ('22222222-0004-4000-a000-000000000004', '55555555-0011-4000-a000-000000000011', true,  NULL),  -- MedTech Convention
  ('22222222-0004-4000-a000-000000000004', '55555555-0012-4000-a000-000000000012', true,  NULL),  -- Italian Heritage
  ('22222222-0004-4000-a000-000000000004', '55555555-0010-4000-a000-000000000010', false, NULL),  -- Cardinals Home Series

  -- P-05 CWE Penthouse
  ('22222222-0005-4000-a000-000000000005', '55555555-0013-4000-a000-000000000013', true,  NULL),  -- CWE Art Fair
  ('22222222-0005-4000-a000-000000000005', '55555555-0014-4000-a000-000000000014', true,  NULL),  -- Hot Chocolate 15k
  ('22222222-0005-4000-a000-000000000005', '55555555-0004-4000-a000-000000000004', false, NULL),  -- Blues Playoff 2

  -- P-06 University City Studio
  ('22222222-0006-4000-a000-000000000006', '55555555-0015-4000-a000-000000000015', true,  NULL);  -- WashU Commencement

-- ============================================================================
-- SENSOR ALERTS (sample from mock activity log)
-- ============================================================================

INSERT INTO sensor_alert (property_id, booking_id, sensor_type, severity, threshold_value, actual_value, message, triggered_at, resolved_at) VALUES
  -- P-01: noise spike during Cardinals game
  ('22222222-0001-4000-a000-000000000001', '44444444-0001-4000-a000-000000000001',
   'noise_db', 'warning', 65, 72,
   'Proactive noise warning sent to guest (dB spike detected)',
   '2026-04-01 19:12:00-05', '2026-04-01 22:30:00-05'),

  -- P-04: noise threshold breach during group booking
  ('22222222-0004-4000-a000-000000000004', '44444444-0008-4000-a000-000000000008',
   'noise_db', 'critical', 65, 78,
   'Noise threshold breach detected - automated warning sent',
   '2026-04-01 21:15:00-05', '2026-04-01 21:20:00-05'),

  -- P-04: water leak (unresolved)
  ('22222222-0004-4000-a000-000000000004', NULL,
   'utility_usage', 'critical', 0, 1,
   'Water leak detected - main valve status critical',
   '2026-04-01 08:00:00-05', NULL);
