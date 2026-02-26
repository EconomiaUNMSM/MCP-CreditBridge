'use client';

export default function ReportPreviewModal({
    onClose,
    onConfirm,
    pdfUrl
}: {
    onClose: () => void;
    onConfirm: () => void;
    pdfUrl: string | null;
}) {
    if (!pdfUrl) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl p-6 relative flex flex-col max-h-[90vh]">

                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Inclusion Assessment Preview</h3>
                        <p className="text-sm text-slate-500">Review the generated document before downloading.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 bg-slate-100 rounded border border-slate-200 overflow-hidden relative">
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full min-h-[500px]"
                        title="Report Preview"
                    />
                </div>

                <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 rounded-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Confirm & Download
                    </button>
                </div>

            </div>
        </div>
    );
}
