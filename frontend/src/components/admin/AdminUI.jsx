import React from 'react'

export const AdminCard = ({ children, className = '' }) => (
    <div className={`rounded-3xl border bg-white p-5 shadow-sm ${className}`}>
        {children}
    </div>
)

export const PageHeader = ({ eyebrow, title, description, action }) => (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">{eyebrow}</p>
            <h2 className="mt-2 text-2xl font-semibold text-black sm:text-3xl">{title}</h2>
            {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">{description}</p>}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
    </div>
)

export const StatusBadge = ({ children, tone = 'neutral' }) => {
    const tones = {
        neutral: 'bg-gray-100 text-gray-600',
        success: 'bg-green-50 text-green-700',
        warning: 'bg-yellow-50 text-yellow-700',
        danger: 'bg-red-50 text-red-700',
        dark: 'bg-black text-white',
        info: 'bg-blue-50 text-blue-700',
    }

    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${tones[tone] || tones.neutral}`}>
            {children}
        </span>
    )
}

export const Field = ({ label, error, children }) => (
    <label className="block">
        <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
        {children}
        {error && <span className="mt-2 block text-xs text-red-500">{error}</span>}
    </label>
)

export const inputClass = 'w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/5'

export const tableWrapperClass = 'overflow-hidden rounded-3xl border bg-white shadow-sm'

export const Pagination = ({ page, totalPages, onPrev, onNext }) => (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4 text-sm text-gray-500">
        <p>Page {page} of {totalPages}</p>
        <div className="flex gap-2">
            <button type="button" onClick={onPrev} disabled={page === 1} className="rounded-full border px-4 py-2 disabled:opacity-40">
                Previous
            </button>
            <button type="button" onClick={onNext} disabled={page === totalPages} className="rounded-full border px-4 py-2 disabled:opacity-40">
                Next
            </button>
        </div>
    </div>
)

export const ConfirmModal = ({ title, message, confirmLabel = 'Confirm', onCancel, onConfirm }) => (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
    <div className="w-full max-w-md rounded-3xl bg-white p-5 sm:p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-black">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-500">{message}</p>
            <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={onCancel} className="rounded-full border px-5 py-2 text-sm">
                    Cancel
                </button>
                <button type="button" onClick={onConfirm} className="rounded-full bg-black px-5 py-2 text-sm text-white">
                    {confirmLabel}
                </button>
            </div>
        </div>
    </div>
)
