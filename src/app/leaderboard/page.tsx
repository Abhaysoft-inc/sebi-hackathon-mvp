import Link from "next/link";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function getLeaderboard() {
  try {
    const topUsers = await pool.query(`
      SELECT u.id, u.email, up.score, 
             COALESCE(array_length(up.completedCases, 1), 0) as completed_cases_count
      FROM Users u
      LEFT JOIN UserProgress up ON u.id = up.user_id
      ORDER BY up.score DESC NULLS LAST
      LIMIT 10
    `);

    return topUsers.rows.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      name: user.email || 'Anonymous',
      totalScore: user.score || 0,
      completedCases: user.completed_cases_count || 0
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    // Return demo data if database is not available
    return [
      {
        rank: 1,
        id: '1',
        name: 'financialexpert@example.com',
        totalScore: 300,
        completedCases: 30
      },
      {
        rank: 2,
        id: '2',
        name: 'investor22@example.com',
        totalScore: 270,
        completedCases: 27
      },
      {
        rank: 3,
        id: '3',
        name: 'stocktrader@example.com',
        totalScore: 240,
        completedCases: 24
      },
      {
        rank: 4,
        id: '4',
        name: 'marketanalyst@example.com',
        totalScore: 210,
        completedCases: 21
      },
      {
        rank: 5,
        id: '5',
        name: 'securityexpert@example.com',
        totalScore: 180,
        completedCases: 18
      },
      {
        rank: 6,
        id: '6',
        name: 'wealthmanager@example.com',
        totalScore: 150,
        completedCases: 15
      },
      {
        rank: 7,
        id: '7',
        name: 'portfolioadvisor@example.com',
        totalScore: 120,
        completedCases: 12
      }
    ];
  }
}

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();

  return (
    <div className="mt-4 md:mt-8">
      <section className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-2xl overflow-hidden shadow-xl mb-12">
        <div className="p-8 md:p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
              <div className="text-6xl relative z-10">🏆</div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Financial Detectives Hall of Fame
          </h1>
          <p className="text-lg md:text-xl text-yellow-100 mb-8 max-w-3xl mx-auto">
            Our top investigators who have cracked the most financial cases and demonstrated exceptional analytical skills.
          </p>
          <Link
            href="/"
            className="bg-white hover:bg-yellow-50 text-yellow-600 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Cases
          </Link>
        </div>
      </section>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-8">
        {leaderboard.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Detective
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Total Score
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Cases Solved
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard.map((user) => (
                  <tr key={user.id} className={`${
                    user.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''
                  } hover:bg-blue-50 transition-colors`}>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.rank <= 3 ? (
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            user.rank === 1 ? "bg-yellow-100 text-yellow-600" :
                            user.rank === 2 ? "bg-gray-100 text-gray-600" :
                            "bg-amber-100 text-amber-700"
                          } mr-3`}>
                            <span className="text-2xl">
                              {user.rank === 1 ? "🥇" :
                               user.rank === 2 ? "🥈" :
                               user.rank === 3 ? "🥉" : ""}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mr-3">
                            <span className="text-lg font-bold text-gray-600">
                              {user.rank}
                            </span>
                          </div>
                        )}
                        <span className={`text-lg font-bold ${
                          user.rank === 1 ? "text-yellow-600" :
                          user.rank === 2 ? "text-gray-600" :
                          user.rank === 3 ? "text-amber-700" : 
                          "text-gray-900"
                        }`}>
                          #{user.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          {user.rank === 1 && (
                            <span className="badge badge-yellow text-xs">Top Detective</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-2 w-24 bg-gray-200 rounded-full mr-3">
                          <div 
                            className={`h-2 rounded-full ${
                              user.rank === 1 ? "bg-yellow-500" :
                              user.rank === 2 ? "bg-gray-500" :
                              user.rank === 3 ? "bg-amber-600" :
                              "bg-blue-600"
                            }`}
                            style={{ width: `${(user.totalScore / leaderboard[0].totalScore) * 100}%` }}
                          ></div>
                        </div>
                        <span className={`text-xl font-bold ${
                          user.rank === 1 ? "text-yellow-600" :
                          user.rank === 2 ? "text-gray-600" :
                          user.rank === 3 ? "text-amber-700" :
                          "text-blue-600"
                        }`}>
                          {user.totalScore}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">pts</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-green-600">
                          {user.completedCases}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">
                          case{user.completedCases !== 1 ? 's' : ''}
                        </span>
                        
                        <div className="ml-3 flex">
                          {[...Array(Math.min(5, Math.floor(user.completedCases / 5)))].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">No Detectives Yet!</h3>
            <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">
              Be the first to solve a case and claim your spot at the top of the leaderboard.
            </p>
            <Link
              href="/"
              className="btn btn-primary"
            >
              Start Solving Cases
            </Link>
          </div>
        )}
      </div>

      {leaderboard.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-800">
                Scoring System
              </h3>
            </div>
            <p className="text-blue-700">
              Each correct solution earns you 10 points. Consecutive correct answers build up your streak multiplier for bonus points!
            </p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-full text-green-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-800">
                Badges & Achievements
              </h3>
            </div>
            <p className="text-green-700">
              Unlock special badges for solving multiple cases, maintaining streaks, and demonstrating exceptional detective skills.
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-full text-purple-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-purple-800">
                Weekly Rankings
              </h3>
            </div>
            <p className="text-purple-700">
              Rankings are updated in real-time. Weekly top performers are highlighted and receive special recognition on our platform.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
