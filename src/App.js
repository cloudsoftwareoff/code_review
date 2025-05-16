import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import { signInWithGitHub, getGitHubClient, storeGitHubRepos } from './components/GitHubAuth'
import RepoList from './components/RepoList'
import PRList from './components/PRList'
import CodeReview from './components/CodeReview'

function App() {
  const [session, setSession] = useState(null)
  const [repos, setRepos] = useState([])
  const [selectedRepo, setSelectedRepo] = useState(null)
  const [prs, setPRs] = useState([])
  const [selectedPR, setSelectedPR] = useState(null)
  const [review, setReview] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchRepos()
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchRepos = async () => {
    try {
      const octokit = await getGitHubClient()
      const { data } = await octokit.request('GET /user/repos', {
        sort: 'updated',
        direction: 'desc'
      })
      
      await storeGitHubRepos(data)
      setRepos(data)
    } catch (error) {
      console.error('Error fetching repos:', error)
    }
  }

  const fetchPRs = async (repo) => {
    try {
      const octokit = await getGitHubClient()
      const { data } = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
        owner: repo.owner.login,
        repo: repo.name,
        state: 'open'
      })
      setPRs(data)
      setSelectedRepo(repo)
      setSelectedPR(null)
      setReview(null)
    } catch (error) {
      console.error('Error fetching PRs:', error)
    }
  }

  const analyzePR = async (pr) => {
    try {
      setSelectedPR(pr)
      setReview(null)
      
      const { data: { user } } = await supabase.auth.getUser()
      const octokit = await getGitHubClient()
      
      // Get PR details
      const { data: prData } = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
        owner: selectedRepo.owner.login,
        repo: selectedRepo.name,
        pull_number: pr.number
      })
      
      // Get changed files
      const { data: files } = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/files', {
        owner: selectedRepo.owner.login,
        repo: selectedRepo.name,
        pull_number: pr.number
      })
      
      // Store in Supabase and get AI review
      const { data: review, error } = await supabase.functions.invoke('analyze-pr', {
        body: {
          user_id: user.id,
          repo_id: selectedRepo.id,
          pr_data: prData,
          files: files
        }
      })
      
      if (error) throw error
      setReview(review)
    } catch (error) {
      console.error('Error analyzing PR:', error)
    }
  }

  return (
    <div className="container">
      {!session ? (
        <button onClick={signInWithGitHub}>Sign in with GitHub</button>
      ) : (
        <>
          <h1>Code Review Assistant</h1>
          <div className="layout">
            <RepoList repos={repos} onSelect={fetchPRs} />
            {selectedRepo && (
              <PRList 
                prs={prs} 
                repo={selectedRepo} 
                onSelect={analyzePR} 
                selectedPR={selectedPR}
              />
            )}
            {review && <CodeReview review={review} />}
          </div>
        </>
      )}
    </div>
  )
}

export default App