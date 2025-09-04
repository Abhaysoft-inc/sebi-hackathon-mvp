'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Clock, Users, Trophy, CheckCircle, XCircle, ArrowRight, ArrowLeft, Flag } from 'lucide-react';

interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topic: string;
}

interface QuizData {
    id: string;
    title: string;
    description: string;
    duration: number; // in minutes
    participants: number;
    prizePool: string;
    questions: Question[];
}

const QuizPlayPage = () => {
    const params = useParams();
    const quizId = params.quizId as string;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    // Mock quiz data - in real app, this would come from API
    const quizData: QuizData = {
        id: quizId,
        title: 'NSE Trading Fundamentals',
        description: 'Test your knowledge of NSE trading, order types, and market mechanics.',
        duration: 30, // 30 minutes
        participants: 234,
        prizePool: '₹50,000',
        questions: [
            {
                id: '1',
                question: 'What is the full form of NSE?',
                options: [
                    'National Stock Exchange',
                    'New Stock Exchange',
                    'National Securities Exchange',
                    'National Share Exchange'
                ],
                correctAnswer: 0,
                explanation: 'NSE stands for National Stock Exchange, which is one of the leading stock exchanges in India.',
                difficulty: 'Easy',
                topic: 'Basic Knowledge'
            },
            {
                id: '2',
                question: 'What are the trading hours of NSE for equity segment?',
                options: [
                    '9:00 AM to 4:00 PM',
                    '9:15 AM to 3:30 PM',
                    '9:30 AM to 4:00 PM',
                    '9:00 AM to 3:30 PM'
                ],
                correctAnswer: 1,
                explanation: 'NSE equity trading hours are from 9:15 AM to 3:30 PM on trading days.',
                difficulty: 'Easy',
                topic: 'Trading Hours'
            },
            {
                id: '3',
                question: 'Which of the following is a market order type?',
                options: [
                    'Limit Order',
                    'Stop Loss Order',
                    'Market Order',
                    'All of the above'
                ],
                correctAnswer: 3,
                explanation: 'All mentioned options are valid order types in stock trading. Market Order executes immediately at current market price.',
                difficulty: 'Medium',
                topic: 'Order Types'
            },
            {
                id: '4',
                question: 'What is the circuit limit for most stocks on NSE?',
                options: [
                    '5%',
                    '10%',
                    '20%',
                    '25%'
                ],
                correctAnswer: 2,
                explanation: 'Most stocks on NSE have a circuit limit of 20% (10% upper and 10% lower circuit).',
                difficulty: 'Medium',
                topic: 'Circuit Limits'
            },
            {
                id: '5',
                question: 'What does T+2 settlement mean in Indian stock markets?',
                options: [
                    'Trade execution in 2 days',
                    'Settlement occurs 2 days after trade date',
                    'Trading for 2 days',
                    'Transfer takes 2 days'
                ],
                correctAnswer: 1,
                explanation: 'T+2 settlement means that the actual transfer of securities and funds happens 2 working days after the trade date.',
                difficulty: 'Medium',
                topic: 'Settlement'
            }
        ]
    };

    useEffect(() => {
        if (quizStarted && !quizCompleted) {
            setTimeLeft(quizData.duration * 60); // Convert minutes to seconds
        }
    }, [quizStarted, quizCompleted, quizData.duration]);

    useEffect(() => {
        if (timeLeft > 0 && quizStarted && !quizCompleted) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && quizStarted) {
            // Auto-submit when time runs out (no confirmation needed)
            confirmSubmitQuiz();
        }
    }, [timeLeft, quizStarted, quizCompleted]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartQuiz = () => {
        setQuizStarted(true);
    };

    const handleAnswerSelect = (answerIndex: number) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestion]: answerIndex
        });
    };

    const handleNextQuestion = () => {
        if (currentQuestion < quizData.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleCompleteQuiz = () => {
        setShowSubmitConfirm(true);
    };

    const confirmSubmitQuiz = () => {
        setQuizCompleted(true);
        setShowResults(true);
        setShowSubmitConfirm(false);
    };

    const calculateScore = () => {
        let correct = 0;
        quizData.questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                correct++;
            }
        });
        return correct;
    };

    const getScorePercentage = () => {
        return Math.round((calculateScore() / quizData.questions.length) * 100);
    };

    if (!quizStarted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-2xl mx-auto w-full">
                    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-center">
                        <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-4" />
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{quizData.title}</h1>
                        <p className="text-sm sm:text-base text-gray-600 mb-6">{quizData.description}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                            <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mx-auto mb-2" />
                                <div className="text-base sm:text-lg font-semibold text-blue-600">{quizData.duration} min</div>
                                <div className="text-xs sm:text-sm text-blue-700">Duration</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mx-auto mb-2" />
                                <div className="text-base sm:text-lg font-semibold text-green-600">{quizData.participants}</div>
                                <div className="text-xs sm:text-sm text-green-700">Participants</div>
                            </div>
                            <div className="bg-yellow-50 rounded-lg p-3 sm:p-4">
                                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 mx-auto mb-2" />
                                <div className="text-base sm:text-lg font-semibold text-yellow-600">{quizData.prizePool}</div>
                                <div className="text-xs sm:text-sm text-yellow-700">Prize Pool</div>
                            </div>
                        </div>

                        <div className="mb-6 sm:mb-8">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quiz Instructions</h3>
                            <ul className="text-left text-sm sm:text-base text-gray-600 space-y-1 sm:space-y-2">
                                <li>• You have {quizData.duration} minutes to complete {quizData.questions.length} questions</li>
                                <li>• Each question has only one correct answer</li>
                                <li>• You can navigate between questions during the quiz</li>
                                <li>• Quiz will auto-submit when time expires</li>
                                <li>• Make sure you have a stable internet connection</li>
                            </ul>
                        </div>

                        <button
                            onClick={handleStartQuiz}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 sm:px-8 rounded-lg transition-colors text-sm sm:text-base"
                        >
                            Start Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showResults) {
        const score = calculateScore();
        const percentage = getScorePercentage();

        return (
            <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
                <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
                    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
                        <div className="text-center mb-6 sm:mb-8">
                            <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${percentage >= 80 ? 'bg-green-100' : percentage >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                                }`}>
                                <Trophy className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                                    }`} />
                            </div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
                            <p className="text-base sm:text-lg lg:text-xl text-gray-600">
                                You scored {score} out of {quizData.questions.length} ({percentage}%)
                            </p>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            {quizData.questions.map((question, index) => {
                                const userAnswer = selectedAnswers[index];
                                const isCorrect = userAnswer === question.correctAnswer;

                                return (
                                    <div key={question.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                                        <div className="flex items-start space-x-3 mb-3">
                                            {isCorrect ? (
                                                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mt-1 flex-shrink-0" />
                                            ) : (
                                                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mt-1 flex-shrink-0" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm sm:text-base text-gray-900 mb-2 leading-tight">
                                                    {index + 1}. {question.question}
                                                </p>
                                                <div className="space-y-1 sm:space-y-2">
                                                    {question.options.map((option, optionIndex) => (
                                                        <div
                                                            key={optionIndex}
                                                            className={`p-2 sm:p-3 rounded text-xs sm:text-sm leading-tight ${optionIndex === question.correctAnswer
                                                                    ? 'bg-green-100 text-green-800 border border-green-300'
                                                                    : optionIndex === userAnswer && !isCorrect
                                                                        ? 'bg-red-100 text-red-800 border border-red-300'
                                                                        : 'bg-gray-50 text-gray-700'
                                                                }`}
                                                        >
                                                            {option}
                                                            {optionIndex === question.correctAnswer && (
                                                                <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
                                                            )}
                                                            {optionIndex === userAnswer && !isCorrect && (
                                                                <span className="ml-2 text-red-600 font-medium">✗ Your answer</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 italic leading-tight">
                                                    <strong>Explanation:</strong> {question.explanation}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="text-center mt-6 sm:mt-8">
                            <button
                                onClick={() => window.location.href = '/quiz/ranked'}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 sm:px-8 rounded-lg transition-colors text-sm sm:text-base"
                            >
                                Back to Quiz List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = quizData.questions[currentQuestion];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{quizData.title}</h1>
                            <p className="text-xs sm:text-sm text-gray-600">
                                Question {currentQuestion + 1} of {quizData.questions.length}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                                <span className={`font-mono text-sm sm:text-lg ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                            <button
                                onClick={handleCompleteQuiz}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1 sm:space-x-2"
                            >
                                <Flag className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Submit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-200 h-2">
                <div
                    className="bg-blue-600 h-2 transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%` }}
                />
            </div>

            {/* Question Content */}
            <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
                    <div className="mb-4 sm:mb-6">
                        <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                {currentQ.difficulty}
                            </span>
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                                {currentQ.topic}
                            </span>
                        </div>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                            {currentQ.question}
                        </h2>
                    </div>

                    <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                        {currentQ.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-colors ${selectedAnswers[currentQuestion] === index
                                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-start sm:items-center space-x-3">
                                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0 ${selectedAnswers[currentQuestion] === index
                                            ? 'border-blue-500 bg-blue-500'
                                            : 'border-gray-300'
                                        }`}>
                                        {selectedAnswers[currentQuestion] === index && (
                                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
                                        )}
                                    </div>
                                    <span className="text-sm sm:text-base text-gray-900 leading-tight">
                                        <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                                        {option}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                        <button
                            onClick={handlePrevQuestion}
                            disabled={currentQuestion === 0}
                            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${currentQuestion === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Previous</span>
                        </button>

                        <div className="text-xs sm:text-sm text-gray-500 order-first sm:order-none">
                            {Object.keys(selectedAnswers).length} of {quizData.questions.length} answered
                        </div>

                        <button
                            onClick={handleNextQuestion}
                            disabled={currentQuestion === quizData.questions.length - 1}
                            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${currentQuestion === quizData.questions.length - 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                        >
                            <span>Next</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Submit Confirmation Dialog */}
            {showSubmitConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Quiz?</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to submit your quiz? You have answered {Object.keys(selectedAnswers).length} out of {quizData.questions.length} questions.
                            This action cannot be undone.
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowSubmitConfirm(false)}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSubmitQuiz}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                Submit Quiz
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizPlayPage;