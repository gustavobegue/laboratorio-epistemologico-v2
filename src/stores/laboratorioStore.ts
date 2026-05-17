import { create } from 'zustand'

import type { Laboratorio, Proposicion } from '../types'

interface LaboratorioStore {
  laboratorioActivo: Laboratorio | null
  setLaboratorioActivo: (lab: Laboratorio | null) => void

  proposicionActiva: Proposicion | null
  setProposicionActiva: (prop: Proposicion | null) => void
}

export const useLaboratorioStore = create<LaboratorioStore>((set) => ({
  laboratorioActivo: null,
  setLaboratorioActivo: (lab) => set({ laboratorioActivo: lab }),

  proposicionActiva: null,
  setProposicionActiva: (prop) => set({ proposicionActiva: prop }),
}))
