"use client"

import { useState } from "react"

interface PublicCaseQuestion { prompt: string; options: string[]; correctOptionIndex: number; explanation: string }
interface CaseStudyDetailProps {
  caseStudy: {
    id: string | number
    title: string
    narrative: string
    challengeQuestion: string
    options: string[]
    correctOptionIndex: number | null
    explanation: string
    quiz?: PublicCaseQuestion[]
  }
}

export default function CaseStudyDetail({ caseStudy }: CaseStudyDetailProps) {
  const multi = Array.isArray(caseStudy.quiz) && caseStudy.quiz.length > 0
  const [qIndex, setQIndex] = useState(0)
  const activeQ: PublicCaseQuestion | null = multi ? caseStudy.quiz![qIndex] : null
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState<boolean[]>( multi ? new Array(caseStudy.quiz!.length).fill(false) : [false])
  const [answeredCorrect, setAnsweredCorrect] = useState<boolean[]>( multi ? new Array(caseStudy.quiz!.length).fill(false) : [false])

  const handleSubmit = async () => {
    if (selectedAnswer === null) { alert('Select an answer'); return }
    // Multi-question handled locally; legacy single uses API for consistency
    if (multi && activeQ) {
  const correct = selectedAnswer === activeQ.correctOptionIndex
      setResult({ isCorrect: correct, explanation: activeQ.explanation, correctAnswer: { index: activeQ.correctOptionIndex, text: activeQ.options[activeQ.correctOptionIndex] }, pointsEarned: correct ? 10 : 0 })
      if (correct) setScore(s=> s+10)
      setSubmitted(true)
  setAnswered(arr=> arr.map((v,i)=> i===qIndex? true: v))
  setAnsweredCorrect(arr=> arr.map((v,i)=> i===qIndex? correct: v))
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/submit-answer', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ caseStudyId: caseStudy.id, answerIndex: selectedAnswer }) })
      const data = await response.json()
      if (response.ok) { setResult(data); setSubmitted(true); if (data.isCorrect) setScore(s=> s+data.pointsEarned||0) } else { alert(data.error||'Error') }
    } catch { alert('Error submitting answer') } finally { setLoading(false) }
  }

  const resetCase = () => { setSelectedAnswer(null); setSubmitted(false); setResult(null) }
  const nextQuestion = () => { if (!multi) return; setSelectedAnswer(null); setSubmitted(false); setResult(null); setQIndex(i=> Math.min(i+1, caseStudy.quiz!.length-1)) }
  const prevQuestion = () => { if (!multi) return; setSelectedAnswer(null); setSubmitted(false); setResult(null); setQIndex(i=> Math.max(i-1, 0)) }

  return (
    <div className="panel panel-spacious animate-fade-in space-y-10">
      {/* Title & meta */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 leading-snug">{caseStudy.title}</h1>
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <span className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-gray-50 px-2 py-0.5 font-medium">Case</span>
            {multi && <span className="text-gray-400">Quiz: {caseStudy.quiz!.length} questions</span>}
            {multi && <span className="text-gray-400">Score: {score}</span>}
          </div>
        </div>
      </div>

      {/* Narrative */}
      <section className="space-y-4">
        <h2 className="heading-section">Narrative</h2>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-line">
          {caseStudy.narrative}
        </div>
      </section>

      {/* Quiz */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="heading-section">{multi ? `Question ${qIndex+1} / ${caseStudy.quiz!.length}` : 'Question'}</h2>
          {multi && <div className="text-[11px] font-mono text-gray-500">Score: {score}</div>}
        </div>
        <p className="text-sm font-medium text-gray-900">{multi && activeQ ? activeQ.prompt : caseStudy.challengeQuestion}</p>
        <ul className="space-y-2">
          {(multi && activeQ ? activeQ.options : caseStudy.options).map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrect = submitted && result?.correctAnswer?.index === index
            const isIncorrectSelection = submitted && isSelected && !result?.isCorrect
            return (
              <li key={index}>
                <button
                  type="button"
                  disabled={submitted}
                  onClick={()=> !submitted && setSelectedAnswer(index)}
                  className={`w-full text-left rounded-lg border px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-default
                    ${!submitted && isSelected ? 'border-indigo-500 bg-indigo-50' : ''}
                    ${!submitted && !isSelected ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50' : ''}
                    ${submitted && isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : ''}
                    ${submitted && isIncorrectSelection ? 'border-rose-400 bg-rose-50 text-rose-800' : ''}
                    ${submitted && !isCorrect && !isIncorrectSelection ? 'border-gray-200 bg-gray-50 text-gray-600' : ''}`}
                >
                  <span className="flex items-center justify-between">
                    <span>{option}</span>
                    {isCorrect && (
                      <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    )}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* Actions & feedback */}
        <div className="space-y-5">
          {!submitted && (
            <button onClick={handleSubmit} disabled={loading || selectedAnswer===null} className="w-full btn-xs bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-sm font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed">{loading? 'Submitting…':'Submit Answer'}</button>
          )}
          {submitted && result && (
            <div className="space-y-4">
              <div className={`rounded-md border px-4 py-3 text-sm font-medium flex items-center gap-2 ${result.isCorrect? 'border-emerald-500 bg-emerald-50 text-emerald-800':'border-rose-400 bg-rose-50 text-rose-800'}`}>
                <span>{result.isCorrect? 'Correct':'Incorrect'}</span>
                {result.pointsEarned>0 && <span className="ml-auto rounded bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">+{result.pointsEarned}</span>}
              </div>
              <div className="rounded-md border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-700">
                <div className="font-semibold mb-1">Explanation</div>
                <p className="mb-0">{result.explanation}</p>
                {!result.isCorrect && (
                  <p className="mt-3 text-gray-600"><span className="font-semibold text-emerald-700">Correct answer:</span> {result.correctAnswer?.text}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3">
            {submitted && multi && qIndex < caseStudy.quiz!.length -1 && (
              <button onClick={()=> { nextQuestion() }} className="flex-1 btn-xs bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-sm font-semibold rounded-md">Next Question →</button>
            )}
            {submitted && multi && qIndex === caseStudy.quiz!.length -1 && (
              <button onClick={()=> { resetCase(); setQIndex(0); setAnswered(new Array(caseStudy.quiz!.length).fill(false)); setAnsweredCorrect(new Array(caseStudy.quiz!.length).fill(false)); setScore(0) }} className="flex-1 btn-xs bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-sm font-semibold rounded-md">Restart Quiz</button>
            )}
            {!multi && submitted && <button onClick={resetCase} className="flex-1 btn-xs btn-surface py-3 text-sm font-medium">Try Again</button>}
            <button onClick={()=> window.location.href='/cases'} className="flex-1 btn-xs btn-surface py-3 text-sm font-medium">Back to Cases</button>
          </div>

          {multi && (
            <div className="space-y-3">
              <div className="flex gap-1 flex-wrap text-[10px]">
                {caseStudy.quiz!.map((_,i)=>(
                  <button
                    key={i}
                    onClick={()=> { setQIndex(i); resetCase() }}
                    className={`w-7 h-7 rounded-full border flex items-center justify-center transition text-[11px]
                      ${i===qIndex? 'border-indigo-500 bg-indigo-50 text-indigo-700':'border-gray-300 bg-white hover:bg-gray-50'}
                      ${answered[i] && answeredCorrect[i]? 'border-emerald-500 bg-emerald-50 text-emerald-700':''}
                      ${answered[i] && !answeredCorrect[i]? 'border-rose-400 bg-rose-50 text-rose-700':''}`}
                  >{i+1}</button>
                ))}
              </div>
              {submitted && qIndex === caseStudy.quiz!.length -1 && (
                <div className="text-xs font-medium text-gray-600">Quiz Complete: {score} / {caseStudy.quiz!.length * 10} points</div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
