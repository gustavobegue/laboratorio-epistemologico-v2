import { create } from 'zustand'
import type { User } from 'firebase/auth'
import type { Rol } from '../types'

interface AuthStore {
  user: User | null
  nombre: string | null
  rol: Rol | null
  cargando: boolean
  setUser: (user: User | null, nombre: string | null, rol: Rol | null) => void
  setCargando: (v: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  nombre: null,
  rol: null,
  cargando: true,
  setUser: (user, nombre, rol) => set({ user, nombre, rol }),
  setCargando: (cargando) => set({ cargando }),
}))
