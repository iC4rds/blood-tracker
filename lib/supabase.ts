import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://niksbcvuwjfimuhsdpwq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pa3NiY3Z1d2pmaW11aHNkcHdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4ODQ3MDUsImV4cCI6MjA3MjQ2MDcwNX0.9Tq05PlZ9WbBMzg2faPCfXmAEmrWDtIpYHwlSNZMjf4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
