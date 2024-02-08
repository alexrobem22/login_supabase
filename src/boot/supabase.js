import { createClient } from '@supabase/supabase-js'
import userAuthUser from 'src/composables/UseAuthUser'

const supabaseUrl = 'https://uvdqpfjnqygqkwhmdwvo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2ZHFwZmpucXlncWt3aG1kd3ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcxNjY0ODUsImV4cCI6MjAyMjc0MjQ4NX0.1U-lpV4peRJnYjboPizCs4Sql6gLBjkoeRYw9KqbIcw'
const supabase = createClient(supabaseUrl, supabaseKey)

supabase.auth.onAuthStateChange((event, session) => {
    const { user } = userAuthUser()

    user.value = session ? session.user : null
})

export default function useSupabase () {
return { supabase }
}