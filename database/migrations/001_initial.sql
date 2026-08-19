-- =============================================================
-- CloudStay — Initial Migration
-- MySQL 8.0
-- File: database/migrations/001_initial.sql
-- This file is kept for version control history.
-- For fresh setup, use schema.sql + seeds.sql directly.
-- =============================================================

-- Migration metadata
-- Version:     001
-- Description: Initial schema — users, hostels, rooms, bookings, refresh_tokens
-- Author:      Member 3 — Database & API
-- Date:        2024-08-01

-- This migration is a pointer to schema.sql.
-- In a production migration tool (e.g. Flyway, Liquibase, db-migrate),
-- the content of schema.sql would be reproduced here verbatim.

-- For this project, run:
--   mysql -u root -p cloudstay < database/schema.sql
--   mysql -u root -p cloudstay < database/procedures.sql
--   mysql -u root -p cloudstay < database/seeds.sql   (dev only)

SELECT 'Migration 001 — initial schema applied via schema.sql' AS migration_status;
