const DesignPreviewModal = ({ item, onClose }) => {
  if (!item) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6" onClick={(event) => event.stopPropagation()}>
        <h3 className="text-xl font-semibold text-black">Review your design</h3>
        <p className="mt-2 text-sm text-gray-500">
          Front and back of the customized {item.productName || 'item'}.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {[
            { label: 'Front', src: item.previewFront },
            { label: 'Back', src: item.previewBack },
          ].map((side) => (
            <div key={side.label}>
              <p className="mb-3 text-sm font-medium">{side.label}</p>
              {side.src ? (
                <img src={side.src} alt={`${side.label} preview`} className="w-full rounded-lg border bg-gray-50 object-contain" />
              ) : (
                <div className="grid aspect-[4/5] place-items-center rounded-lg border bg-gray-50 text-sm text-gray-400">
                  No {side.label.toLowerCase()} design
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default DesignPreviewModal
