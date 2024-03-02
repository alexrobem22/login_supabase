import { createClient } from '@supabase/supabase-js'
import userAuthUser from 'src/composables/UseAuthUser'
//coloque a aviriavel de ambiente no quasar.config
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

supabase.auth.onAuthStateChange((event, session) => {
    const { user } = userAuthUser()

    user.value = session ? session.user : null
})

export default function useSupabase () {
return { supabase }
}