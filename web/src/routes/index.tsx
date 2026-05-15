import { createFileRoute } from '@tanstack/react-router'

function HomePage() {
  return (
    <p className="text-lg text-slate-300">Hello, world!</p>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
})
