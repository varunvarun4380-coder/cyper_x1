-- ============================================================
--  cyperX Symposium — Complete MySQL Database Script
--  Database : cyperx_db
--  Author   : cyperX Team
--  Date     : 2026
-- ============================================================


-- ============================================================
-- STEP 1: Create & Use Database
-- ============================================================

CREATE DATABASE IF NOT EXISTS cyperx_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cyperx_db;


-- ============================================================
-- STEP 2: Create Tables
-- ============================================================

-- Table 1: registrations
CREATE TABLE IF NOT EXISTS registrations (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    reg_id          VARCHAR(20)  UNIQUE NOT NULL,
    fullname        VARCHAR(100) NOT NULL,
    email           VARCHAR(100) NOT NULL,
    phone           VARCHAR(15)  NOT NULL,
    yearofstudy     INT,
    department      VARCHAR(50),
    college         VARCHAR(100),
    gender          VARCHAR(10),
    events          TEXT,
    arrivaltime     VARCHAR(10),
    regdate         VARCHAR(20),
    experience      INT DEFAULT 5,
    badgecolor      VARCHAR(10)  DEFAULT '#12b5cb',
    socialprofile   VARCHAR(255),
    specialrequests TEXT,
    payment_method  VARCHAR(30),
    accommodation   VARCHAR(5)   DEFAULT 'no',
    submittedAt     VARCHAR(50)
);

-- Table 2: contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100),
    email       VARCHAR(100),
    subject     VARCHAR(255),
    message     TEXT,
    submittedAt VARCHAR(50)
);


-- ============================================================
-- STEP 3: Sample Data — registrations
-- ============================================================

INSERT INTO registrations
  (reg_id, fullname, email, phone, yearofstudy, department, college,
   gender, events, arrivaltime, regdate, experience, badgecolor,
   socialprofile, specialrequests, payment_method, accommodation, submittedAt)
VALUES
  ('CYRX-AA0001', 'Kavin R',   'kavin@gmail.com',   '9751519068', 3, 'eee',   'Adithya Institute of Technology', 'male',   'paper, circuit',       '08:30', '2026-03-10', 7, '#12b5cb', 'https://github.com/kavin',   '',                         'online', 'yes', '2026-03-10T08:30:00'),
  ('CYRX-BB0002', 'Priya S',   'priya@gmail.com',   '9876543210', 2, 'cse',   'Adithya Institute of Technology', 'female', 'code, designchallenge','09:00', '2026-03-10', 8, '#ff6b6b', 'https://linkedin.com/priya', '',                         'cash',   'no',  '2026-03-10T09:05:00'),
  ('CYRX-CC0003', 'Arun M',    'arun@gmail.com',    '8765432109', 1, 'mech',  'Adithya Institute of Technology', 'male',   'paper, waterrocketry', '08:00', '2026-03-10', 5, '#f9ca24', '',                           '',                         'online', 'no',  '2026-03-10T09:10:00'),
  ('CYRX-DD0004', 'Divya K',   'divya@gmail.com',   '7654321098', 4, 'it',    'Adithya Institute of Technology', 'female', 'techquest, shortfilm', '09:30', '2026-03-10', 6, '#6ab04c', '',                           'Vegetarian food needed.',  'cash',   'yes', '2026-03-10T09:15:00'),
  ('CYRX-EE0005', 'Sathish V', 'sathish@gmail.com', '9988776655', 3, 'ece',   'Adithya Institute of Technology', 'male',   'roborace, squidgame',  '08:45', '2026-03-10', 9, '#12b5cb', 'https://github.com/sathish', '',                         'online', 'no',  '2026-03-10T09:20:00'),
  ('CYRX-FF0006', 'Meena L',   'meena@gmail.com',   '9123456780', 2, 'aids',  'Adithya Institute of Technology', 'female', 'workshop, aimusic',    '10:00', '2026-03-10', 7, '#e056fd', '',                           '',                         'online', 'no',  '2026-03-10T09:25:00'),
  ('CYRX-GG0007', 'Ravi T',    'ravi@gmail.com',    '8234567891', 1, 'civil', 'Adithya Institute of Technology', 'male',   'techhunt, bridgeit',   '09:00', '2026-03-10', 4, '#12b5cb', '',                           '',                         'cash',   'yes', '2026-03-10T09:30:00'),
  ('CYRX-HH0008', 'Lakshmi P', 'lakshmi@gmail.com', '7345678912', 4, 'eee',   'Adithya Institute of Technology', 'female', 'paper, linefollower',  '08:30', '2026-03-10', 8, '#badc58', '',                           'Wheelchair access needed.','online', 'yes', '2026-03-10T09:35:00');


-- ============================================================
-- STEP 4: Sample Data — contact_messages
-- ============================================================

INSERT INTO contact_messages (name, email, subject, message, submittedAt)
VALUES
  ('Varun',   'varun@gmail.com',   'Event Timing Query',    'What time does the paper presentation event start?',  '2026-03-08T10:00:00'),
  ('Sneha',   'sneha@gmail.com',   'Registration Issue',    'I submitted the form but did not receive a reg ID.',  '2026-03-09T11:30:00'),
  ('Rithvik', 'rithvik@gmail.com', 'Accommodation Details', 'Can you share more info about hostel accommodation?', '2026-03-09T14:00:00');


-- ============================================================
-- STEP 5: Useful SELECT Queries
-- ============================================================

-- 1. View all registrations
SELECT * FROM registrations;

-- 2. View all contact messages
SELECT * FROM contact_messages;

-- 3. Latest registrations first
SELECT reg_id, fullname, email, phone, department, events, payment_method, submittedAt
FROM registrations
ORDER BY id DESC;

-- 4. Total number of registrations
SELECT COUNT(*) AS total_registrations FROM registrations;

-- 5. Department-wise registration count
SELECT department, COUNT(*) AS count
FROM registrations
GROUP BY department
ORDER BY count DESC;

-- 6. Students who need accommodation
SELECT reg_id, fullname, phone, department
FROM registrations
WHERE accommodation = 'yes';

-- 7. Online payment students
SELECT reg_id, fullname, email, payment_method
FROM registrations
WHERE payment_method = 'online';

-- 8. Cash payment students
SELECT reg_id, fullname, email, payment_method
FROM registrations
WHERE payment_method = 'cash';

-- 9. Search by registration ID
SELECT * FROM registrations WHERE reg_id = 'CYRX-AA0001';

-- 10. Search by email
SELECT * FROM registrations WHERE email = 'kavin@gmail.com';

-- 11. Gender-wise count
SELECT gender, COUNT(*) AS count
FROM registrations
GROUP BY gender;

-- 12. Year of study wise count
SELECT yearofstudy, COUNT(*) AS count
FROM registrations
GROUP BY yearofstudy
ORDER BY yearofstudy;

-- 13. Students with special requests
SELECT reg_id, fullname, specialrequests
FROM registrations
WHERE specialrequests IS NOT NULL AND specialrequests != '';

-- 14. Top experienced students
SELECT reg_id, fullname, department, experience
FROM registrations
ORDER BY experience DESC
LIMIT 5;


-- ============================================================
-- STEP 6: Update Queries (Use carefully!)
-- ============================================================

-- Update payment method for a specific student
-- UPDATE registrations SET payment_method = 'cash' WHERE reg_id = 'CYRX-AA0001';

-- Update accommodation status
-- UPDATE registrations SET accommodation = 'yes' WHERE reg_id = 'CYRX-BB0002';


-- ============================================================
-- STEP 7: Delete Queries (Use VERY carefully!)
-- ============================================================

-- Delete a specific registration
-- DELETE FROM registrations WHERE reg_id = 'CYRX-AA0001';

-- Delete all test/sample data
-- DELETE FROM registrations;

-- Drop tables (DANGER — all data lost!)
-- DROP TABLE IF EXISTS registrations;
-- DROP TABLE IF EXISTS contact_messages;

-- Drop database (EXTREME DANGER!)
-- DROP DATABASE IF EXISTS cyperx_db;


-- ============================================================
-- END OF SCRIPT
-- ============================================================
