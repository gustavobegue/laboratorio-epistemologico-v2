import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
} from 'firebase/auth'
import { httpsCallable } from 'firebase/functions'

import { auth, functions } from './firebase'
import type { Rol } from '../types'

interface CrearPerfilInput {
  nombre: string
  rol: Rol
  codigoProfesor?: string
}

const crearPerfilFn = httpsCallable<CrearPerfilInput, { ok: boolean }>(functions, 'crearPerfil')

export async function iniciarSesion(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password)
}

export async function registrar(
  email: string,
  password: string,
  nombre: string,
  rol: Rol,
  codigoProfesor?: string,
): Promise<void> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  try {
    await crearPerfilFn({ nombre, rol, codigoProfesor })
  } catch (err) {
    await deleteUser(user)
    throw err
  }
}

export function cerrarSesion(): Promise<void> {
  return signOut(auth)
}
