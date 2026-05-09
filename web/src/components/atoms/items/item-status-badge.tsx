type ItemStatusBadgeProps = {
  completed: boolean
}

export function ItemStatusBadge({ completed }: ItemStatusBadgeProps) {
  const classes = completed
    ? 'bg-emerald-500/15 text-emerald-200'
    : 'bg-amber-500/15 text-amber-200'

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}>
      {completed ? 'Completed' : 'Pending'}
    </span>
  )
}
