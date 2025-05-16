import { supabase } from '../lib/supabaseClient'
import { Octokit } from '@octokit/core'

//secret: LfNIilRBawBH6rXQ
export const signInWithGitHub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      scopes: 'repo', 
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
      },
    },
  });
  
  if (error) throw error;
  return data;
};

export const getGitHubClient = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')
  
  return new Octokit({
    auth: session.provider_token
  })
}

export const storeGitHubRepos = async (repos) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { error } = await supabase.from('repositories').upsert(
    repos.map(repo => ({
      user_id: user.id,
      github_repo_id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      private: repo.private
    })),
    { onConflict: 'user_id,github_repo_id' }
  )
  
  if (error) throw error
}