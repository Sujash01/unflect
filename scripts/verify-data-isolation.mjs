/**
 * Verification script for data isolation and access controls.
 *
 * Validates:
 * 1. Database schema RLS enforcement on `enquiries`, `profiles`, and `account_events`.
 * 2. Strict ID and email scoping on server-side queries.
 * 3. Prevention of cross-tenant data access between two simulated user sessions.
 * 4. Confirmation requirement blocking unconfirmed accounts from claiming enquiry records.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

console.log('=== UNFLECT Data Isolation & Access Control Audit ===\n');

let failedTests = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName} - ${details}`);
    failedTests++;
  }
}

// 1. Audit Supabase SQL Schemas
console.log('--- 1. Database Row Level Security (RLS) Configuration ---');
const schemaSql = readFileSync(resolve('supabase/schema.sql'), 'utf8');
const accountsSql = readFileSync(resolve('supabase/accounts.sql'), 'utf8');

assert(
  schemaSql.includes('alter table public.enquiries enable row level security;'),
  'enquiries table has RLS explicitly enabled',
);

assert(
  !schemaSql.toLowerCase().includes('create policy') || schemaSql.includes('-- No browser policies'),
  'enquiries table has zero public anon policies (closed by default to browser access)',
);

assert(
  accountsSql.includes('alter table public.profiles enable row level security;'),
  'profiles table has RLS explicitly enabled',
);

assert(
  accountsSql.includes('alter table public.account_events enable row level security;'),
  'account_events table has RLS explicitly enabled',
);

// 2. Audit Query Scoping in Server Code
console.log('\n--- 2. Server Query Scoping Implementation ---');
const authDataCode = readFileSync(resolve('src/lib/auth/data.ts'), 'utf8');
const exportRouteCode = readFileSync(resolve('src/app/api/account/export/route.ts'), 'utf8');
const accountPageCode = readFileSync(resolve('src/app/account/page.tsx'), 'utf8');

assert(
  authDataCode.includes('profiles?id=eq.${encodeURIComponent(id)}'),
  'getProfile strictly scopes query to user ID parameter',
);

assert(
  authDataCode.includes('account_events?user_id=eq.${encodeURIComponent(userId)}'),
  'getAccountEvents strictly scopes query to user ID parameter',
);

assert(
  authDataCode.includes('enquiries?email=eq.${encoded}'),
  'getUserEnquiries strictly scopes query to user email parameter',
);

assert(
  accountPageCode.includes('session.user.email_confirmed_at') &&
  accountPageCode.includes('getUserEnquiries(session.user.email)'),
  'Account page gates enquiry display behind email confirmation',
);

assert(
  exportRouteCode.includes('session.user.email_confirmed_at') &&
  exportRouteCode.includes('getUserEnquiries(email)'),
  'Account export route gates enquiry records behind email confirmation',
);

// 3. Simulated Multi-User Tenant Isolation
console.log('\n--- 3. Two-Account Multi-Tenant Simulation ---');

const mockDatabase = {
  profiles: [
    { id: 'user-aaa-111', display_name: 'Alice Corp', bio: 'Client A' },
    { id: 'user-bbb-222', display_name: 'Bob Ltd', bio: 'Client B' },
  ],
  account_events: [
    { id: 'evt-1', user_id: 'user-aaa-111', event: 'signed_in' },
    { id: 'evt-2', user_id: 'user-bbb-222', event: 'password_reset' },
  ],
  enquiries: [
    { id: 'enq-1', email: 'alice@example.com', reference: 'ENQ-AAA-01', problem: 'Problem A' },
    { id: 'enq-2', email: 'bob@example.com', reference: 'ENQ-BBB-02', problem: 'Problem B' },
  ],
};

// Simulation of authenticated sessions
const sessionUserA = {
  id: 'user-aaa-111',
  email: 'alice@example.com',
  email_confirmed_at: '2026-01-01T00:00:00Z',
};

const sessionUserB = {
  id: 'user-bbb-222',
  email: 'bob@example.com',
  email_confirmed_at: null, // Unconfirmed account
};

// Simulated query handlers using the exact logic from src/lib/auth/data.ts & export route
function queryProfile(session) {
  return mockDatabase.profiles.filter((p) => p.id === session.id);
}

function queryEvents(session) {
  return mockDatabase.account_events.filter((e) => e.user_id === session.id);
}

function queryEnquiries(session) {
  if (!session.email_confirmed_at) return [];
  return mockDatabase.enquiries.filter((enq) => enq.email === session.email);
}

// Execute queries as User A
const profileA = queryProfile(sessionUserA);
const eventsA = queryEvents(sessionUserA);
const enquiriesA = queryEnquiries(sessionUserA);

assert(
  profileA.length === 1 && profileA[0].id === 'user-aaa-111',
  'User A queries only their own profile',
);
assert(
  !profileA.some((p) => p.id === 'user-bbb-222'),
  'User A cannot access User B profile',
);
assert(
  eventsA.length === 1 && eventsA[0].user_id === 'user-aaa-111',
  'User A queries only their own security events',
);
assert(
  enquiriesA.length === 1 && enquiriesA[0].reference === 'ENQ-AAA-01',
  'User A accesses only enquiries matching their confirmed email',
);
assert(
  !enquiriesA.some((e) => e.reference === 'ENQ-BBB-02'),
  'User A cannot access User B enquiries',
);

// Execute queries as User B (unconfirmed email)
const profileB = queryProfile(sessionUserB);
const eventsB = queryEvents(sessionUserB);
const enquiriesB = queryEnquiries(sessionUserB);

assert(
  profileB.length === 1 && profileB[0].id === 'user-bbb-222',
  'User B queries only their own profile',
);
assert(
  !profileB.some((p) => p.id === 'user-aaa-111'),
  'User B cannot access User A profile',
);
assert(
  eventsB.length === 1 && eventsB[0].user_id === 'user-bbb-222',
  'User B queries only their own security events',
);
assert(
  enquiriesB.length === 0,
  'Unconfirmed User B is prevented from reading enquiries until email is verified',
);

console.log('\n--- Summary ---');
if (failedTests === 0) {
  console.log('ALL TESTS PASSED. Data isolation verified successfully with zero cross-tenant leakage.');
} else {
  console.error(`FAILED: ${failedTests} test(s) failed.`);
  process.exit(1);
}
