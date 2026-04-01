'use client'

import React from 'react'
import { useCallRateLimit } from '@/hooks/useCallRateLimit'
import CallLimitModal from '@/components/modals/CallLimitModal'

const RateLimitTester: React.FC = () => {
    const rateLimit = useCallRateLimit()
    const [showModal, setShowModal] = React.useState(false)

    if (process.env.NODE_ENV !== 'development') {
        return null
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm">
            <h3 className="font-bold text-sm mb-2">Rate Limit Tester (DEV)</h3>

            <div className="space-y-2 text-xs">
                <div>Rate Limit: {rateLimit.isRateLimitActive() ? 'Habilitado' : 'Deshabilitado'}</div>
                <div>Llamadas: {rateLimit.callCount}/{rateLimit.callLimit}</div>
                <div>Restantes: {rateLimit.remainingCalls === Infinity ? '∞' : rateLimit.remainingCalls}</div>
                <div>Límite alcanzado: {rateLimit.isLimitReached ? 'Sí' : 'No'}</div>
                <div>Reset: {rateLimit.resetDate?.toLocaleString() || 'N/A'}</div>
            </div>

            <div className="flex gap-2 mt-3 flex-wrap">
                <button
                    onClick={rateLimit.incrementCallCount}
                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    disabled={rateLimit.isLimitReached || !rateLimit.isRateLimitActive()}
                >
                    +1 Call
                </button>

                <button
                    onClick={() => setShowModal(true)}
                    className="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
                >
                    Show Modal
                </button>

                <button
                    onClick={() => rateLimit.debugCurrentState && rateLimit.debugCurrentState()}
                    className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                >
                    Debug
                </button>

                <button
                    onClick={() => rateLimit.syncState && rateLimit.syncState()}
                    className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                >
                    Sync
                </button>

                <button
                    onClick={rateLimit.resetCount}
                    className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                    Reset
                </button>
            </div>

            <CallLimitModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                resetDate={rateLimit.resetDate}
                callCount={rateLimit.callCount}
                callLimit={rateLimit.callLimit}
            />
        </div>
    )
}

export default RateLimitTester