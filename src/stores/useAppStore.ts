import { create } from 'zustand'

interface AppState {
  activeBeneficiaryId: string | null
  setActiveBeneficiary: (id: string | null) => void
}

export const useAppStore = create<AppState>()((set) => ({
  activeBeneficiaryId: null,
  setActiveBeneficiary: (id) => set({ activeBeneficiaryId: id }),
}))
