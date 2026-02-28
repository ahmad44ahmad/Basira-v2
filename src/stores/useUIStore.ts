import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarOpen: boolean
  darkMode: boolean
  commandMenuOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleDarkMode: () => void
  setCommandMenuOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      darkMode: true,
      commandMenuOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleDarkMode: () =>
        set((s) => {
          const next = !s.darkMode
          document.body.parentElement?.classList.toggle('dark', next)
          return { darkMode: next }
        }),
      setCommandMenuOpen: (open) => set({ commandMenuOpen: open }),
    }),
    {
      name: 'basira-ui',
      partialize: (s) => ({ darkMode: s.darkMode, sidebarOpen: s.sidebarOpen }),
    },
  ),
)
