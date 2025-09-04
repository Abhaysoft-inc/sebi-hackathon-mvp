'use client'

import { useState, useMemo } from 'react'
import CaseStudyCard from './CaseStudyCard'

interface CaseStudy {
    id: number
    createdAt?: string
    slug: string | null
    title: string
    narrative: string
    challengeQuestion: string
    options: string[]
    correctOptionIndex: number | null
    explanation: string
    questionCount: number
}

interface CaseLibraryProps {
    caseStudies: CaseStudy[]
}

type SortOption = 'newest' | 'oldest'
type FilterOption = 'all' | 'fraud' | 'market'

export default function CaseLibrary({ caseStudies }: CaseLibraryProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState<SortOption>('newest')
    const [filterBy, setFilterBy] = useState<FilterOption>('all')

    const filteredAndSortedCases = useMemo(() => {
        const filtered = caseStudies.filter(cs => {
            // Search filter
            const matchesSearch = searchTerm === '' ||
                cs.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cs.narrative.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cs.challengeQuestion.toLowerCase().includes(searchTerm.toLowerCase())

            // Category filter (basic implementation - you can enhance this based on your data)
            const matchesFilter = filterBy === 'all' ||
                (filterBy === 'fraud' && (cs.title.toLowerCase().includes('fraud') || cs.narrative.toLowerCase().includes('fraud'))) ||
                (filterBy === 'market' && (cs.title.toLowerCase().includes('market') || cs.narrative.toLowerCase().includes('market')))

            return matchesSearch && matchesFilter
        })

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            } else {
                return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
            }
        })

        return filtered
    }, [caseStudies, searchTerm, sortBy, filterBy])

    return (
        <div className="space-y-8">
            {/* Header */}
            <header className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Case Library</h1>
                <p className="text-md text-gray-600 max-w-3xl mx-auto">
                    Investigative scenarios and structured analytical exercises. Each case includes a narrative and quiz prompts to test detection and reasoning skills.
                </p>
            </header>

            {/* Search and Filter Controls - Minimal Design */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-sm">
                    <input
                        type="text"
                        placeholder="Search cases..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                    </svg>
                </div>

                {/* Filters - Compact */}
                <div className="flex items-center gap-2">
                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>

                    {/* Filter Dropdown */}
                    <select
                        value={filterBy}
                        onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                        className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value="all">All Categories</option>
                        <option value="fraud">Fraud Cases</option>
                        <option value="market">Market Cases</option>
                    </select>

                    {/* Results Count - Compact */}
                    <span className="text-xs text-gray-500 ml-2">
                        {filteredAndSortedCases.length}/{caseStudies.length}
                    </span>
                </div>
            </div>

            {/* Cases Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedCases.length > 0 ? (
                    filteredAndSortedCases.map(cs => (
                        <div key={cs.id} className="transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
                            <CaseStudyCard caseStudy={cs} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-16 text-center bg-gray-50">
                        <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-12 h-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0-1.125-.504-1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No cases found</h3>
                        <p className="text-gray-500 mb-4">
                            {searchTerm || filterBy !== 'all'
                                ? 'Try adjusting your search or filter criteria.'
                                : 'Check back soon or create a new case study!'
                            }
                        </p>
                        {(searchTerm || filterBy !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('')
                                    setFilterBy('all')
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
