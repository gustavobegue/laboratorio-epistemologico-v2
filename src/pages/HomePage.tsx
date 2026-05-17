import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'

import { db } from '../lib/firebase'
import { useAuthStore } from '../stores/authStore'
import { cerrarSesion } from '../lib/auth'
import { useLaboratorioStore } from '../stores/laboratorioStore'
import { CrearLaboratorioForm } from '../components/CrearLaboratorioForm'

interface LabResumen {
  id: string
  titulo: string
  descripcion?: string
  cantidadProposiciones: number
  actualizadoEn: Date
}

function VistaProfesor() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const setLaboratorioActivo = useLaboratorioStore((s) => s.setLaboratorioActivo)
  const [labs, setLabs] = useState<LabResumen[]>([])
  const [cargando, setCargando] = useState(true)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const cargarLabs = async () => {
    if (!user) return
    setCargando(true)
    try {
      const q = query(
        collection(db, 'laboratorios'),
        where('ownerId', '==', user.uid),
        orderBy('actualizadoEn', 'desc'),
      )
      const snap = await getDocs(q)
      setLabs(
        snap.docs.map((d) => ({
          id: d.id,
          titulo: d.data().titulo,
          descripcion: d.data().descripcion ?? undefined,
          cantidadProposiciones: (d.data().proposiciones ?? []).length,
          actualizadoEn: d.data().actualizadoEn?.toDate() ?? new Date(),
        })),
      )
    } catch {
      setLabs([])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarLabs()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid])

  const handleAbrir = (lab: LabResumen) => {
    setLaboratorioActivo(null)
    navigate(`/lab/${lab.id}`)
  }

  const handleCreado = (labId: string) => {
    setMostrarFormulario(false)
    navigate(`/lab/${labId}`)
  }

  return (
    <section aria-label="Mis laboratorios">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-pizarra uppercase tracking-wide">
          Mis laboratorios
        </h2>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="text-sm px-4 py-1.5 bg-azul text-white rounded-lg
                     hover:bg-azul/90 transition-colors"
        >
          + Nuevo laboratorio
        </button>
      </div>

      {cargando ? (
        <p className="text-pizarra text-sm animate-pulse py-8 text-center">
          Cargando laboratorios…
        </p>
      ) : labs.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center">
          <p className="text-pizarra text-sm">No tenés laboratorios todavía.</p>
          <button
            onClick={() => setMostrarFormulario(true)}
            className="mt-3 text-sm text-azul underline hover:text-azul/80"
          >
            Crear el primero
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {labs.map((lab) => (
            <article
              key={lab.id}
              className="bg-white border border-gray-200 rounded-xl p-5
                         hover:border-azul/40 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => handleAbrir(lab)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleAbrir(lab)}
              aria-label={`Abrir laboratorio: ${lab.titulo}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-azul">{lab.titulo}</h3>
                  {lab.descripcion && (
                    <p className="text-pizarra text-sm mt-0.5">{lab.descripcion}</p>
                  )}
                  <p className="text-xs text-pizarra opacity-60 mt-2">
                    {lab.cantidadProposiciones} proposición
                    {lab.cantidadProposiciones !== 1 ? 'es' : ''} · Actualizado{' '}
                    {lab.actualizadoEn.toLocaleDateString('es-AR')}
                  </p>
                </div>
                <span className="text-azul text-lg" aria-hidden>
                  →
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {mostrarFormulario && (
        <CrearLaboratorioForm
          onCreado={handleCreado}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}
    </section>
  )
}

function VistaAlumno() {
  return (
    <section className="bg-white border border-gray-200 rounded-xl p-10 text-center">
      <p className="text-pizarra font-medium">Bienvenido al Laboratorio Epistemológico</p>
      <p className="text-pizarra/70 text-sm mt-2 max-w-sm mx-auto">
        Para comenzar, usá el enlace que te compartió tu docente. Cada laboratorio tiene su propia
        URL de acceso.
      </p>
    </section>
  )
}

export function HomePage() {
  const { nombre, rol } = useAuthStore()

  const handleCerrarSesion = async () => {
    await cerrarSesion()
  }

  return (
    <main className="min-h-screen bg-crema p-8 max-w-3xl mx-auto">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-azul">Laboratorio Epistemológico</h1>
          <p className="text-pizarra mt-1">Introducción al Pensamiento Científico — UNPSJB</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm text-pizarra font-medium">{nombre}</p>
          <p className="text-xs text-pizarra/60 capitalize">{rol}</p>
          <button
            onClick={handleCerrarSesion}
            className="text-xs text-pizarra/50 hover:text-pizarra mt-1 underline"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {rol === 'profesor' ? <VistaProfesor /> : <VistaAlumno />}
    </main>
  )
}
