import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://snpbhzbuactcwsikgkkn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucGJoemJ1YWN0Y3dzaWtna2tuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczODQ2NTUsImV4cCI6MjA2Mjk2MDY1NX0.qgJ56xlWYLQkQYXNJ-WcA-t3R5KFJU0qJ9xN5scVAuQ"

export const supabase = createClient(supabaseUrl, supabaseKey)