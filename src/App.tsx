import { Suspense, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { QueryProvider } from './providers/QueryProvider'
import { AuthProvider } from './providers/AuthProvider'
import { ToastContainer } from './components/feedback'
import { ErrorBoundary } from './components/feedback'
import { FullPageSpinner } from './components/ui'
import { useUIStore } from './stores/useUIStore'

function DarkModeInitializer() {
  const darkMode = useUIStore((s) => s.darkMode)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])
  return null
}

export function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AuthProvider>
          <DarkModeInitializer />
          <Suspense fallback={<FullPageSpinner />}>
            <RouterProvider router={router} />
          </Suspense>
          <ToastContainer />
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  )
}
