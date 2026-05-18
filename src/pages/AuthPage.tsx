import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { iniciarSesion, registrar } from '../lib/auth'
import type { Rol } from '../types'

type Modo = 'login' | 'registro'

function mensajeDeError(err: unknown): string {
  const code = (err as { code?: string }).code ?? ''
  const mensaje = (err as { message?: string }).message ?? ''

  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
    return 'Email o contraseña incorrectos.'
  }
  if (code === 'auth/email-already-in-use') return 'Ya existe una cuenta con ese email.'
  if (code === 'auth/weak-password') return 'La contraseña debe tener al menos 6 caracteres.'
  if (code === 'auth/invalid-email') return 'El formato del email no es válido.'
  if (code === 'auth/too-many-requests') return 'Demasiados intentos fallidos. Esperá unos minutos.'
  if (code === 'functions/permission-denied' || mensaje.includes('Código')) {
    return 'Código de invitación incorrecto.'
  }
  return 'Ocurrió un error. Intentá de nuevo.'
}

export function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const destino = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/'

  const [modo, setModo] = useState<Modo>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [rol, setRol] = useState<Rol>('alumno')
  const [codigoProfesor, setCodigoProfesor] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const limpiar = (nuevoModo: Modo) => {
    setModo(nuevoModo)
    setError(null)
    setCodigoProfesor('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setCargando(true)

    try {
      if (modo === 'login') {
        await iniciarSesion(email, password)
      } else {
        if (!nombre.trim()) { setError('El nombre es obligatorio.'); setCargando(false); return }
        if (rol === 'profesor' && !codigoProfesor.trim()) {
          setError('El código de invitación docente es obligatorio.')
          setCargando(false)
          return
        }
        await registrar(email, password, nombre.trim(), rol, codigoProfesor.trim() || undefined)
      }
      navigate(destino, { replace: true })
    } catch (err) {
      setError(mensajeDeError(err))
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="min-h-screen bg-crema flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-azul">Laboratorio Epistemológico</h1>
          <p className="text-pizarra mt-1 text-sm">Introducción al Pensamiento Científico — UNPSJB</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => limpiar('login')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                modo === 'login'
                  ? 'text-azul border-b-2 border-azul bg-white'
                  : 'text-pizarra/60 hover:text-pizarra bg-gray-50'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => limpiar('registro')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                modo === 'registro'
                  ? 'text-azul border-b-2 border-azul bg-white'
                  : 'text-pizarra/60 hover:text-pizarra bg-gray-50'
              }`}
            >
              Crear cuenta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {modo === 'registro' && (
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-pizarra mb-1">
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre y apellido"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-azul/30 focus:border-azul"
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-pizarra mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-azul/30 focus:border-azul"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-pizarra mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={modo === 'registro' ? 'Mínimo 6 caracteres' : '••••••••'}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-azul/30 focus:border-azul"
                autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {modo === 'registro' && (
              <div>
                <p className="text-sm font-medium text-pizarra mb-2">Rol</p>
                <div className="grid grid-cols-2 gap-3">
                  {(['alumno', 'profesor'] as Rol[]).map((r) => (
                    <label
                      key={r}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer
                                  transition-all ${
                                    rol === r
                                      ? 'border-azul bg-azul/5 text-azul'
                                      : 'border-gray-200 text-pizarra hover:border-gray-300'
                                  }`}
                    >
                      <input
                        type="radio"
                        name="rol"
                        value={r}
                        checked={rol === r}
                        onChange={() => { setRol(r); setCodigoProfesor('') }}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium capitalize">{r}</span>
                      <span className="text-xs text-center opacity-70">
                        {r === 'alumno' ? 'Analizás proposiciones' : 'Creás laboratorios'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {modo === 'registro' && rol === 'profesor' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <label htmlFor="codigo" className="block text-sm font-medium text-amber-800 mb-1">
                  Código de invitación docente
                </label>
                <input
                  id="codigo"
                  type="text"
                  value={codigoProfesor}
                  onChange={(e) => setCodigoProfesor(e.target.value)}
                  placeholder="Solicitalo a la cátedra"
                  className="w-full border border-amber-300 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400
                             bg-white"
                  autoComplete="off"
                />
                <p className="text-xs text-amber-700 mt-1">
                  Solo los docentes de la cátedra pueden registrarse como profesores.
                </p>
              </div>
            )}

            {error && (
              <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-2.5 bg-azul text-white text-sm font-medium rounded-lg
                         hover:bg-azul/90 transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
              {cargando
                ? 'Cargando…'
                : modo === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
