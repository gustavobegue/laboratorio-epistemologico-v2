import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

import { auth, db } from './firebase'
import type { Rol } from '../types'

export async function iniciarSesion(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password)
}

export async function registrar(
  email: string,
  password: string,
  nombre: string,
  rol: Rol,
): Promise<void> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  try {
    await setDoc(doc(db, 'usuarios', user.uid), {
      nombre,
      email,
      rol,
      evaluacionesHoy: 0,
      fechaContadorEvaluaciones: new Date().toISOString().split('T')[0],
      creadoEn: serverTimestamp(),
    })
  } catch (err) {
    // Si falla el documento, eliminar la cuenta para no dejar estado inconsistente
    await deleteUser(user)
    throw err
  }
}

export function cerrarSesion(): Promise<void> {
  return signOut(auth)
}
