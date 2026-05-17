import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import { auth, db } from '../lib/firebase'
import { useAuthStore } from '../stores/authStore'
import type { Rol } from '../types'

// Llamar este hook UNA sola vez en App.tsx — inicializa el listener de auth
export function useAuth() {
  const setUser = useAuthStore((s) => s.setUser)
  const setCargando = useAuthStore((s) => s.setCargando)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null, null, null)
        setCargando(false)
        return
      }

      try {
        const snap = await getDoc(doc(db, 'usuarios', firebaseUser.uid))
        if (snap.exists()) {
          const d = snap.data()
          setUser(firebaseUser, d.nombre as string, d.rol as Rol)
        } else {
          setUser(firebaseUser, null, null)
        }
      } catch {
        setUser(firebaseUser, null, null)
      }
      setCargando(false)
    })

    return unsubscribe
  }, [setUser, setCargando])
}
