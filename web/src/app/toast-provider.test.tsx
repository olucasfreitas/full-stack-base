import { fireEvent, render, screen } from '@testing-library/react'

import { ToastProvider } from './toast-provider'
import { useToast } from '@hooks/use-toast'

function ToastHarness() {
  const { showToast } = useToast()

  return (
    <button
      type="button"
      onClick={() => {
        showToast({
          message: 'Saved item successfully.',
          tone: 'success',
        })
      }}
    >
      Trigger toast
    </button>
  )
}

describe('ToastProvider', () => {
  it('renders a toast when a child requests success feedback', async () => {
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: /trigger toast/i }))

    expect(await screen.findByText(/saved item successfully\./i)).toBeInTheDocument()
  })
})
