// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { doc, setDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
// import { db, auth } from '../lib/firebaseClient';
// import Prism from 'prismjs';
// import 'prismjs/themes/prism.css';
// import 'prismjs/components/prism-diff';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/components/prism-python'; 
// import { GoogleGenerativeAI } from '@google/generative-ai';

// const genAI = new GoogleGenerativeAI("AIzaSyDavQ5TVmHXEeXeIe0GpSaUNzQqniBxBZo");

// export default function PullRequestsList({ repo, accessToken }) {
//   const [pullRequests, setPullRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedPR, setExpandedPR] = useState(null);
//   const [reviewComment, setReviewComment] = useState('');
//   const [reviewAction, setReviewAction] = useState('COMMENT');
//   const [submittingReview, setSubmittingReview] = useState(false);
//   const [reviewSubmitError, setReviewSubmitError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (expandedPR) {
//       Prism.highlightAll();
//     }
//   }, [expandedPR]);

//   useEffect(() => {
//     const fetchPullRequests = async () => {
//       if (!repo || !accessToken) {
//         setError('Missing repository or access token');
//         setLoading(false);
//         return;
//       }

//       const user = auth.currentUser;
//       if (!user) {
//         setError('User not authenticated');
//         setLoading(false);
//         navigate('/');
//         return;
//       }

//       const repoId = String(repo.github_id || repo.id);
//       if (!repoId) {
//         setError('Invalid repository ID');
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);

//         const repoRef = doc(db, 'repositories', repoId);
//         await setDoc(
//           repoRef,
//           {
//             id: repoId,
//             github_id: Number(repoId),
//             owner_uid: user.uid,
//             full_name: repo.full_name,
//             name: repo.name || repo.full_name.split('/')[1],
//             private: repo.private || false,
//             updated_at: new Date().toISOString(),
//           },
//           { merge: true }
//         );

//         const response = await fetch(`https://api.github.com/repos/${repo.full_name}/pulls?state=open`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             Accept: 'application/vnd.github.v3+json',
//           },
//         });

//         if (!response.ok) {
//           if (response.status === 401 || response.status === 403) {
//             window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
//             throw new Error('Authentication error. Please sign in again.');
//           }
//           if (response.status === 404) {
//             throw new Error(`Repository ${repo.full_name} not found or inaccessible`);
//           }
//           throw new Error(`Failed to fetch pull requests: ${response.statusText}`);
//         }

//         const data = await response.json();
//         setPullRequests(data);

//         if (data.length > 0) {
//           const batch = [];
//           for (const pr of data) {
//             const prRef = doc(db, 'pull_requests', `${repoId}_${pr.id}`);
//             batch.push(
//               setDoc(
//                 prRef,
//                 {
//                   id: `${repoId}_${pr.id}`,
//                   repo_id: repoId,
//                   pr_id: pr.id,
//                   number: pr.number,
//                   title: pr.title,
//                   html_url: pr.html_url,
//                   user: {
//                     login: pr.user.login,
//                     avatar_url: pr.user.avatar_url,
//                     html_url: pr.user.html_url,
//                   },
//                   state: pr.state,
//                   created_at: pr.created_at,
//                   updated_at: pr.updated_at,
//                   body: pr.body || '',
//                   last_synced: new Date().toISOString(),
//                 },
//                 { merge: true }
//               )
//             );
//           }
//           await Promise.all(batch);
//         }
//       } catch (err) {
//         console.error('Error fetching pull requests:', err);
//         setError(err.message);
//         if (err.message.includes('Authentication') || err.message.includes('not found')) {
//           navigate('/');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPullRequests();
//   }, [repo, accessToken, navigate]);

//   const parseDiff = (diff) => {
//     if (!diff) return { left: [], right: [], headers: [] };

//     const lines = diff.split('\n');
//     const result = { left: [], right: [], headers: [] };
//     let leftLineNum = 0;
//     let rightLineNum = 0;
//     let currentHunk = null;

//     for (const line of lines) {
//       if (line.startsWith('@@')) {
//         // Hunk header, e.g., @@ -1,3 +1,4 @@
//         currentHunk = line;
//         result.headers.push(line);
//         const match = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/);
//         if (match) {
//           leftLineNum = parseInt(match[1], 10);
//           rightLineNum = parseInt(match[2], 10);
//         }
//         continue;
//       }

//       if (line.startsWith('+')) {
//         // Added line
//         result.right.push({
//           content: line.slice(1),
//           lineNum: rightLineNum,
//           type: 'added',
//         });
//         result.left.push({ content: '', lineNum: null, type: 'empty' });
//         rightLineNum++;
//       } else if (line.startsWith('-')) {
//         // Removed line
//         result.left.push({
//           content: line.slice(1),
//           lineNum: leftLineNum,
//           type: 'removed',
//         });
//         result.right.push({ content: '', lineNum: null, type: 'empty' });
//         leftLineNum++;
//       } else {
//         // Unchanged line (starts with space or empty)
//         const content = line.startsWith(' ') ? line.slice(1) : line;
//         result.left.push({
//           content,
//           lineNum: leftLineNum,
//           type: 'unchanged',
//         });
//         result.right.push({
//           content,
//           lineNum: rightLineNum,
//           type: 'unchanged',
//         });
//         leftLineNum++;
//         rightLineNum++;
//       }
//     }

//     return result;
//   };

//   const fetchPRDetails = async (pr) => {
//     if (expandedPR === pr.number) {
//       setExpandedPR(null);
//       return;
//     }

//     const user = auth.currentUser;
//     if (!user) {
//       setError('User not authenticated');
//       setExpandedPR(null);
//       navigate('/');
//       return;
//     }

//     try {
//       setExpandedPR(pr.number);

//       const repoId = String(repo.github_id || repo.id);
//       if (!repoId) {
//         throw new Error('Invalid repository ID');
//       }

//       // Fetch reviews from Firestore
//       let storedReviews = [];
//       try {
//         const reviewsQuery = query(
//           collection(db, 'pull_request_reviews'),
//           where('pr_id', '==', `${repoId}_${pr.id}`)
//         );
//         console.log('Fetching reviews for pr_id:', `${repoId}_${pr.id}`);
//         const reviewsSnapshot = await getDocs(reviewsQuery);
//         if (!reviewsSnapshot.empty) {
//           reviewsSnapshot.forEach(doc => {
//             storedReviews.push(doc.data());
//           });
//         }
//       } catch (err) {
//         console.error('Error fetching reviews from Firestore:', err);
//         throw new Error(`Failed to fetch reviews: ${err.message}`);
//       }

//       // Fetch diff from Firestore
//       let storedDiff = null;
//       try {
//         const diffRef = doc(db, 'pull_requests', `${repoId}_${pr.id}`, 'diffs', 'latest');
//         console.log('Fetching diff at:', `pull_requests/${repoId}_${pr.id}/diffs/latest`);
//         const diffDoc = await getDoc(diffRef);
//         if (diffDoc.exists()) {
//           storedDiff = diffDoc.data().content;
//         }
//       } catch (err) {
//         console.error('Error fetching diff from Firestore:', err);
//         throw new Error(`Failed to fetch diff: ${err.message}`);
//       }

//       // Fetch AI analysis from Firestore
//       let storedAnalysis = null;
//       try {
//         const analysisRef = doc(db, 'pull_requests', `${repoId}_${pr.id}`, 'ai_analysis', 'latest');
//         console.log('Fetching AI analysis at:', `pull_requests/${repoId}_${pr.id}/ai_analysis/latest`);
//         const analysisDoc = await getDoc(analysisRef);
//         if (analysisDoc.exists()) {
//           storedAnalysis = analysisDoc.data().content;
//         }
//       } catch (err) {
//         console.error('Error fetching AI analysis from Firestore:', err);
//         throw new Error(`Failed to fetch AI analysis: ${err.message}`);
//       }

//       let reviewsData = storedReviews;
//       let diffData = storedDiff;
//       let analysisData = storedAnalysis;

//       if (storedReviews.length === 0 || !storedDiff || !storedAnalysis) {
//         if (storedReviews.length === 0) {
//           const reviewsResponse = await fetch(
//             `https://api.github.com/repos/${repo.full_name}/pulls/${pr.number}/reviews`,
//             {
//               headers: {
//                 Authorization: `Bearer ${accessToken}`,
//                 Accept: 'application/vnd.github.v3+json',
//               },
//             }
//           );

//           if (!reviewsResponse.ok) {
//             if (reviewsResponse.status === 401 || reviewsResponse.status === 403) {
//               window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
//               throw new Error('Authentication error. Please sign in again.');
//             }
//             if (reviewsResponse.status === 404) {
//               throw new Error(`Pull request #${pr.number} not found in ${repo.full_name}`);
//             }
//             throw new Error(`Failed to fetch reviews: ${reviewsResponse.statusText}`);
//           }

//           reviewsData = await reviewsResponse.json();

//           const batch = [];
//           for (const review of reviewsData) {
//             const reviewRef = doc(db, 'pull_request_reviews', `${repoId}_${pr.id}_${review.id}`);
//             batch.push(
//               setDoc(
//                 reviewRef,
//                 {
//                   id: `${repoId}_${pr.id}_${review.id}`,
//                   pr_id: `${repoId}_${pr.id}`,
//                   review_id: review.id,
//                   user: {
//                     login: review.user.login,
//                     avatar_url: review.user.avatar_url,
//                   },
//                   state: review.state,
//                   body: review.body || '',
//                   submitted_at: review.submitted_at,
//                   commit_id: review.commit_id,
//                   last_synced: new Date().toISOString(),
//                 },
//                 { merge: true }
//               )
//             );
//           }
//           await Promise.all(batch);
//         }

//         if (!storedDiff) {
//           const diffResponse = await fetch(
//             `https://api.github.com/repos/${repo.full_name}/pulls/${pr.number}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${accessToken}`,
//                 Accept: 'application/vnd.github.diff',
//               },
//             }
//           );

//           if (!diffResponse.ok) {
//             if (diffResponse.status === 401 || diffResponse.status === 403) {
//               window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
//               throw new Error('Authentication error. Please sign in again.');
//             }
//             if (diffResponse.status === 404) {
//               throw new Error(`Pull request #${pr.number} not found in ${repo.full_name}`);
//             }
//             throw new Error(`Failed to fetch diff: ${diffResponse.statusText}`);
//           }

//           diffData = await diffResponse.text();

//           const maxDiffSize = 1000000;
//           const truncatedDiff = diffData.length > maxDiffSize ? diffData.slice(0, maxDiffSize) + '\n... (truncated)' : diffData;
//           const diffRef = doc(db, 'pull_requests', `${repoId}_${pr.id}`, 'diffs', 'latest');
//           console.log('Storing diff at:', `pull_requests/${repoId}_${pr.id}/diffs/latest`);
//           await setDoc(
//             diffRef,
//             {
//               id: 'latest',
//               pr_id: `${repoId}_${pr.id}`,
//               content: truncatedDiff,
//               last_synced: new Date().toISOString(),
//             },
//             { merge: true }
//           );
//         }

//         if (!storedAnalysis && diffData) {
//           try {
//             const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//             const prompt = `Analyze this GitHub pull request diff for potential bugs, code quality issues, and improvement suggestions. Provide a concise summary and specific recommendations:\n\n${diffData.slice(0, 4000)}`;
//             const result = await model.generateContent(prompt);
//             const response = await result.response;
//             analysisData = await response.text();

//             const analysisRef = doc(db, 'pull_requests', `${repoId}_${pr.id}`, 'ai_analysis', 'latest');
//             console.log('Storing AI analysis at:', `pull_requests/${repoId}_${pr.id}/ai_analysis/latest`);
//             await setDoc(
//               analysisRef,
//               {
//                 id: 'latest',
//                 pr_id: `${repoId}_${pr.id}`,
//                 content: analysisData,
//                 last_synced: new Date().toISOString(),
//               },
//               { merge: true }
//             );
//           } catch (err) {
//             console.error('Error fetching AI analysis from Gemini AI:', err);
//             analysisData = 'Failed to generate AI analysis: ' + err.message;
//           }
//         }
//       }

//       setPullRequests(prevPRs =>
//         prevPRs.map(p => (p.id === pr.id ? { ...p, reviews: reviewsData, diff: diffData, aiAnalysis: analysisData } : p))
//       );
//     } catch (err) {
//       console.error('Error fetching PR details:', err);
//       setError(err.message);
//       setExpandedPR(null);
//       if (err.message.includes('Authentication') || err.message.includes('not found')) {
//         navigate('/');
//       }
//     }
//   };

//   const submitReview = async (pr) => {
//     try {
//       setSubmittingReview(true);
//       setReviewSubmitError(null);

//       const user = auth.currentUser;
//       if (!user) {
//         throw new Error('User not authenticated');
//       }

//       const prResponse = await fetch(
//         `https://api.github.com/repos/${repo.full_name}/pulls/${pr.number}`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             Accept: 'application/vnd.github.v3+json',
//           },
//         }
//       );

//       if (!prResponse.ok) {
//         if (prResponse.status === 404) {
//           throw new Error(`Pull request #${pr.number} not found in ${repo.full_name}`);
//         }
//         if (prResponse.status === 401 || prResponse.status === 403) {
//           window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
//           throw new Error('Authentication error. Please sign in again.');
//         }
//         throw new Error(`Failed to validate PR: ${prResponse.statusText}`);
//       }

//       const response = await fetch(
//         `https://api.github.com/repos/${repo.full_name}/pulls/${pr.number}/reviews`,
//         {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             Accept: 'application/vnd.github.v3+json',
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             body: reviewComment,
//             event: reviewAction,
//           }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 404) {
//           throw new Error(`Pull request #${pr.number} not found in ${repo.full_name}`);
//         }
//         if (response.status === 401 || response.status === 403) {
//           window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
//           throw new Error('Authentication error. Please sign in again.');
//         }
//         throw new Error(`Failed to submit review: ${errorData.message || response.statusText}`);
//       }

//       const data = await response.json();

//       const repoId = String(repo.github_id || repo.id);
//       if (!repoId) {
//         throw new Error('Invalid repository ID');
//       }

//       const reviewRef = doc(db, 'pull_request_reviews', `${repoId}_${pr.id}_${data.id}`);
//       await setDoc(
//         reviewRef,
//         {
//           id: `${repoId}_${pr.id}_${data.id}`,
//           pr_id: `${repoId}_${pr.id}`,
//           review_id: data.id,
//           user: {
//             login: data.user.login,
//             avatar_url: data.user.avatar_url,
//           },
//           state: data.state,
//           body: data.body || '',
//           submitted_at: data.submitted_at,
//           commit_id: data.commit_id,
//           last_synced: new Date().toISOString(),
//         },
//         { merge: true }
//       );

//       setPullRequests(prevPRs =>
//         prevPRs.map(p =>
//           p.id === pr.id
//             ? {
//                 ...p,
//                 reviews: [...(p.reviews || []), data],
//               }
//             : p
//         )
//       );

//       setReviewComment('');
//       setReviewAction('COMMENT');
//     } catch (err) {
//       console.error('Error submitting review:', err);
//       setReviewSubmitError(err.message);
//       if (err.message.includes('Authentication') || err.message.includes('not found')) {
//         navigate('/');
//       }
//     } finally {
//       setSubmittingReview(false);
//     }
//   };

//   const handleNavigateToReview = (pr) => {
//     navigate(`/review/${repo.full_name}/${pr.number}`);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const month = date.toLocaleString('default', { month: 'short' });
//     const year = date.getFullYear();
//     return `${day} ${month} ${year}`;
//   };

//   const getReviewStatusClass = (state) => {
//     switch (state) {
//       case 'APPROVED':
//         return 'bg-green-100 text-green-800';
//       case 'REQUEST_CHANGES':
//         return 'bg-red-100 text-red-800';
//       case 'COMMENTED':
//       case 'COMMENT':
//         return 'bg-blue-100 text-blue-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center p-6">
//         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//         <p className="text-red-600">Error: {error}</p>
//         <button
//           className="mt-2 text-sm text-violet-600 hover:text-violet-800"
//           onClick={() => setError(null)}
//         >
//           Try again
//         </button>
//       </div>
//     );
//   }

//   if (pullRequests.length === 0) {
//     return (
//       <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
//         <p className="text-gray-500">No open pull requests found for this repository</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-semibold text-violet-800">Pull Requests ({pullRequests.length})</h3>

//       <div className="space-y-4">
//         {pullRequests.map(pr => (
//           <div key={pr.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div
//               className="p-4 cursor-pointer hover:bg-gray-50"
//               onClick={() => fetchPRDetails(pr)}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <img
//                     src={pr.user.avatar_url}
//                     alt={`${pr.user.login}'s avatar`}
//                     className="w-8 h-8 rounded-full mr-3"
//                   />
//                   <div>
//                     <h4 className="font-medium text-violet-800">
//                       PR #{pr.number}: {pr.title}
//                     </h4>
//                     <p className="text-sm text-gray-600">
//                       Opened by <span className="font-medium">{pr.user.login}</span> on{' '}
//                       {formatDate(pr.created_at)}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
//                     {pr.state}
//                   </span>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleNavigateToReview(pr);
//                     }}
//                     className="text-sm text-violet-600 hover:text-violet-800"
//                   >
//                     Review
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {expandedPR === pr.number && (
//               <div className="p-4 border-t border-gray-200 bg-gray-50">
//                 {pr.body && (
//                   <div className="mb-4 p-3 bg-white rounded border border-gray-200">
//                     <h5 className="text-sm font-semibold text-gray-700 mb-2">Description:</h5>
//                     <p className="text-sm text-gray-600 whitespace-pre-line">{pr.body}</p>
//                   </div>
//                 )}

//                 {pr.diff && (
//                   <div className="mb-4">
//                     <h5 className="text-sm font-semibold text-gray-700 mb-2">Changes:</h5>
//                     <div className="bg-white rounded border border-gray-200 overflow-auto max-h-96">
//                       {(() => {
//                         const { left, right, headers } = parseDiff(pr.diff);
//                         return (
//                           <div className="flex">
//                             {/* Left side (original) */}
//                             <div className="w-1/2 border-r border-gray-200">
//                               {left.map((line, index) => (
//                                 <div
//                                   key={`left-${index}`}
//                                   className={`flex text-sm font-mono ${
//                                     line.type === 'removed'
//                                       ? 'bg-red-100'
//                                       : line.type === 'unchanged'
//                                       ? 'bg-white'
//                                       : 'bg-gray-50'
//                                   }`}
//                                 >
//                                   <div className="w-12 bg-gray-50 text-gray-500 text-right pr-2 py-1">
//                                     {line.lineNum || ''}
//                                   </div>
//                                   <pre className="flex-1 py-1 px-2">
//                                     <code
//                                       className={
//                                         line.content && !headers.includes(line.content)
//                                           ? 'language-javascript'
//                                           : ''
//                                       }
//                                     >
//                                       {line.content}
//                                     </code>
//                                   </pre>
//                                 </div>
//                               ))}
//                             </div>
//                             {/* Right side (modified) */}
//                             <div className="w-1/2">
//                               {right.map((line, index) => (
//                                 <div
//                                   key={`right-${index}`}
//                                   className={`flex text-sm font-mono ${
//                                     line.type === 'added'
//                                       ? 'bg-green-100'
//                                       : line.type === 'unchanged'
//                                       ? 'bg-white'
//                                       : 'bg-gray-50'
//                                   }`}
//                                 >
//                                   <div className="w-12 bg-gray-50 text-gray-500 text-right pr-2 py-1">
//                                     {line.lineNum || ''}
//                                   </div>
//                                   <pre className="flex-1 py-1 px-2">
//                                     <code
//                                       className={
//                                         line.content && !headers.includes(line.content)
//                                           ? 'language-javascript'
//                                           : ''
//                                       }
//                                     >
//                                       {line.content}
//                                     </code>
//                                   </pre>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         );
//                       })()}
//                     </div>
//                   </div>
//                 )}

//                 {pr.aiAnalysis && (
//                   <div className="mb-4">
//                     <h5 className="text-sm font-semibold text-gray-700 mb-2">AI Analysis:</h5>
//                     <div className="bg-white rounded border border-gray-200 p-3 overflow-auto max-h-96">
//                       <p className="text-sm text-gray-600 whitespace-pre-line">{pr.aiAnalysis}</p>
//                     </div>
//                   </div>
//                 )}

//                 <div className="mb-4">
//                   <h5 className="text-sm font-semibold text-gray-700 mb-2">Reviews:</h5>
//                   {pr.reviews && pr.reviews.length > 0 ? (
//                     <div className="space-y-3">
//                       {pr.reviews.map(review => (
//                         <div
//                           key={review.id}
//                           className="p-3 bg-white rounded border border-gray-200"
//                         >
//                           <div className="flex items-center mb-2">
//                             <img
//                               src={review.user.avatar_url}
//                               alt={`${review.user.login}'s avatar`}
//                               className="w-6 h-6 rounded-full mr-2"
//                             />
//                             <span className="text-sm font-medium text-gray-700">
//                               {review.user.login}
//                             </span>
//                             <span
//                               className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getReviewStatusClass(
//                                 review.state
//                               )}`}
//                             >
//                               {review.state}
//                             </span>
//                             <span className="ml-auto text-xs text-gray-500">
//                               {formatDate(review.submitted_at)}
//                             </span>
//                           </div>
//                           {review.body && (
//                             <p className="text-sm text-gray-600 whitespace-pre-line">
//                               {review.body}
//                             </p>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-sm text-gray-500">No reviews yet</p>
//                   )}
//                 </div>

//                 <div className="mt-4 pt-4 border-t border-gray-200">
//                   <h5 className="text-sm font-semibold text-gray-700 mb-2">Submit a review:</h5>
//                   <div className="space-y-3">
//                     <textarea
//                       value={reviewComment}
//                       onChange={e => setReviewComment(e.target.value)}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
//                       placeholder="Write your review comment here..."
//                       rows={3}
//                     />

//                     <div className="flex flex-wrap items-center gap-2">
//                       <select
//                         value={reviewAction}
//                         onChange={e => setReviewAction(e.target.value)}
//                         className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
//                       >
//                         <option value="COMMENT">Comment only</option>
//                         <option value="APPROVE">Approve</option>
//                         <option value="REQUEST_CHANGES">Request changes</option>
//                       </select>

//                       <button
//                         onClick={() => submitReview(pr)}
//                         disabled={submittingReview || !reviewComment.trim()}
//                         className="ml-auto bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white px-4 py-2 rounded-lg transition-colors"
//                       >
//                         {submittingReview ? 'Submitting...' : 'Submit Review'}
//                       </button>
//                     </div>

//                     {reviewSubmitError && (
//                       <p className="text-sm text-red-600">Error: {reviewSubmitError}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="mt-4 text-center">
//                   <a
//                     href={pr.html_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-sm text-violet-600 hover:text-violet-800"
//                   >
//                     View on GitHub →
//                   </a>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }