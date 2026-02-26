export default function ProgressBar({
    value,
    max = 100,
    color = "bg-blue-600",
    height = "h-2"
}: {
    value: number;
    max?: number;
    color?: string;
    height?: string;
}) {
    // If value is a percentage (e.g. 0.7 for repayment), handle it or assume 0-100
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={`w-full bg-slate-100 rounded-full ${height} overflow-hidden`}>
            <div
                className={`${color} h-full rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
