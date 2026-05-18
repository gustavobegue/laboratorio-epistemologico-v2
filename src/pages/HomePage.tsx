import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore'

import { db } from '../lib/firebase'
import { useAuthStore } from '../stores/authStore'
import { cerrarSesion } from '../lib/auth'
import { useLaboratorioStore } from '../stores/laboratorioStore'
import { CrearLaboratorioForm } from '../components/CrearLaboratorioForm'

interface LabResumen {
  id: string
  titulo: string
  descripcion?: string
  proposiciones: Array<{ id: string; texto: string; fuenteContexto: string }>
  actualizadoEn: Date
}

type ModoFormulario =
  | { tipo: 'crear' }
  | { tipo: 'editar'; lab: LabResumen }
  | null

function VistaProfesor() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const setLaboratorioActivo = useLaboratorioStore((s) => s.setLaboratorioActivo)
  const [labs, setLabs] = useState<LabResumen[]>([])
  const [cargando, setCargando] = useState(true)
  const [formulario, setFormulario] = useState<ModoFormulario>(null)
  const [eliminando, setEliminando] = useState<string | null>(null)
  const [confirmarEliminar, setConfirmarEliminar] = useState<string | null>(null)
  const [copiadoId, setCopiadoId] = useState<string | null>(null)

  const handleCopiarEnlace = (labId: string) => {
    const url = `${window.location.origin}/lab/${labId}`
    navigator.clipboard.writeText(url).then(() => {
      setCopiadoId(labId)
      setTimeout(() => setCopiadoId(null), 2000)
    })
  }

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
          titulo: d.data().titulo as string,
          descripcion: d.data().descripcion ?? undefined,
          proposiciones: (d.data().proposiciones ?? []) as Array<{
            id: string; texto: string; fuenteContexto: string
          }>,
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

  const handleGuardado = (labId: string) => {
    const eraEdicion = formulario?.tipo === 'editar'
    setFormulario(null)
    if (eraEdicion) {
      cargarLabs()
    } else {
      navigate(`/lab/${labId}`)
    }
  }

  const handleEliminar = async (labId: string) => {
    setEliminando(labId)
    try {
      await deleteDoc(doc(db, 'laboratorios', labId))
      setLabs((prev) => prev.filter((l) => l.id !== labId))
    } catch {
      // falla silenciosamente — el usuario puede reintentar
    } finally {
      setEliminando(null)
      setConfirmarEliminar(null)
    }
  }

  return (
    <section aria-label="Mis laboratorios">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-pizarra uppercase tracking-wide">
          Mis laboratorios
        </h2>
        <button
          onClick={() => setFormulario({ tipo: 'crear' })}
          className="text-sm px-4 py-1.5 bg-azul text-white rounded-lg hover:bg-azul/90 transition-colors"
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
            onClick={() => setFormulario({ tipo: 'crear' })}
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
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-azul/40 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <button
                  className="flex-1 text-left min-w-0"
                  onClick={() => handleAbrir(lab)}
                  aria-label={`Abrir laboratorio: ${lab.titulo}`}
                >
                  <h3 className="font-medium text-azul">{lab.titulo}</h3>
                  {lab.descripcion && (
                    <p className="text-pizarra text-sm mt-0.5">{lab.descripcion}</p>
                  )}
                  <p className="text-xs text-pizarra opacity-60 mt-2">
                    {lab.proposiciones.length} proposición
                    {lab.proposiciones.length !== 1 ? 'es' : ''} · Actualizado{' '}
                    {lab.actualizadoEn.toLocaleDateString('es-AR')}
                  </p>
                </button>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleCopiarEnlace(lab.id)}
                    className="px-3 py-1.5 text-xs text-pizarra border border-gray-200 rounded-lg
                               hover:border-azul/40 hover:text-azul transition-colors"
                    aria-label={`Copiar enlace de ${lab.titulo}`}
                    title={`${window.location.origin}/lab/${lab.id}`}
                  >
                    {copiadoId === lab.id ? '¡Copiado!' : 'Copiar enlace'}
                  </button>
                  <button
                    onClick={() => setFormulario({ tipo: 'editar', lab })}
                    className="px-3 py-1.5 text-xs text-pizarra border border-gray-200 rounded-lg
                               hover:border-azul/40 hover:text-azul transition-colors"
                    aria-label={`Editar ${lab.titulo}`}
                  >
                    Editar
                  </button>

                  {confirmarEliminar === lab.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEliminar(lab.id)}
                        disabled={eliminando === lab.id}
                        className="px-3 py-1.5 text-xs text-white bg-red-500 hover:bg-red-600
                                   rounded-lg transition-colors disabled:opacity-50"
                      >
                        {eliminando === lab.id ? '…' : 'Confirmar'}
                      </button>
                      <button
                        onClick={() => setConfirmarEliminar(null)}
                        className="px-2 py-1.5 text-xs text-pizarra hover:text-pizarra/70"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmarEliminar(lab.id)}
                      className="px-3 py-1.5 text-xs text-red-500 border border-red-200 rounded-lg
                                 hover:bg-red-50 transition-colors"
                      aria-label={`Eliminar ${lab.titulo}`}
                    >
                      Eliminar
                    </button>
                  )}

                  <span
                    className="text-azul text-lg cursor-pointer"
                    onClick={() => handleAbrir(lab)}
                    aria-hidden
                  >
                    →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {formulario?.tipo === 'crear' && (
        <CrearLaboratorioForm
          onCreado={handleGuardado}
          onCancelar={() => setFormulario(null)}
        />
      )}

      {formulario?.tipo === 'editar' && (
        <CrearLaboratorioForm
          onCreado={handleGuardado}
          onCancelar={() => setFormulario(null)}
          modoEdicion={{
            labId: formulario.lab.id,
            titulo: formulario.lab.titulo,
            descripcion: formulario.lab.descripcion,
            proposiciones: formulario.lab.proposiciones,
          }}
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
            onClick={cerrarSesion}
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
