export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-20 text-brand-400">
      <div className="mb-4">
        <svg
          className="mx-auto text-brand-300"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <p className="text-base font-normal">{message}</p>
    </div>
  )
}
