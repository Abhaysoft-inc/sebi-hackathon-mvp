// ...existing code...
export function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-200 w-full bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12 text-sm text-gray-600 flex flex-col md:flex-row gap-8 md:items-start md:justify-between">
          <div className="space-y-3 max-w-sm ">
            <div className="flex items-center gap-2 font-semibold text-gray-900 text-base">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white text-sm">EX</span>
              EduFinX
            </div>
            <p className="leading-relaxed">A platform for market education, gamified learning, expert insights, multilingual resources, and accessibility for all investors.</p>
          </div>
          <div className="flex flex-wrap gap-10 text-xs">
            <div className="space-y-3 min-w-[120px]">
              <h4 className="font-semibold text-gray-900 tracking-wide text-[11px] uppercase">Platform</h4>
              <ul className="space-y-2">
                <li><a href="/cases" className="hover:text-indigo-600">Cases</a></li>
                <li><a href="/leaderboard" className="hover:text-indigo-600">Leaderboard</a></li>
                <li><a href="/feed" className="hover:text-indigo-600">Feed</a></li>
              </ul>
            </div>
            <div className="space-y-3 min-w-[120px]">
              <h4 className="font-semibold text-gray-900 tracking-wide text-[11px] uppercase">Create</h4>
              <ul className="space-y-2">
                <li><a href="/admin" className="hover:text-indigo-600">Generate</a></li>
                <li><a href="/admin" className="hover:text-indigo-600">Enrich</a></li>
                <li><a href="/admin" className="hover:text-indigo-600">Publish</a></li>
              </ul>
            </div>
            <div className="space-y-3 min-w-[120px]">
              <h4 className="font-semibold text-gray-900 tracking-wide text-[11px] uppercase">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-indigo-600">Docs</a></li>
                <li><a href="#" className="hover:text-indigo-600">Changelog</a></li>
                <li><a href="#" className="hover:text-indigo-600">Status</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full border-t border-gray-100 mt-6">
          <div className="max-w-7xl mx-auto px-6 py-4 text-[11px] text-gray-400 text-center">
            © {new Date().getFullYear()} EduFinX. All rights reserved.
          </div>
        </div>
    </footer>
  )
}
// ...existing code...