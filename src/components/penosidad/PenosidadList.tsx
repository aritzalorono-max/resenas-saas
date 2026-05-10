'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePenosidadLevels, updatePenosidadItem } from '@/lib/actions/penosidad'
import { type PenosidadConfig } from '@/types'
import { ArrowUp, ArrowDown, Save, Check, AlertCircle } from 'lucide-react'

interface Props {
  items: PenosidadConfig[]
  canEdit: boolean
}

export function PenosidadList({ items: initialItems, canEdit }: Props) {
  const router  = useRouter()
  const [items, setItems]     = useState<PenosidadConfig[]>([...initialItems].sort((a,b) => a.nivel - b.nivel))
  const [dirty, setDirty]     = useState(false)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editColor, setEditColor] = useState('')
  const [editPuntos, setEditPuntos] = useState('')

  function moveUp(index: number) {
    if (index === 0) return
    const next = [...items]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    next.forEach((item, i) => (item.nivel = i + 1))
    setItems(next)
    setDirty(true)
    setSaved(false)
  }

  function moveDown(index: number) {
    if (index === items.length - 1) return
    const next = [...items]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    next.forEach((item, i) => (item.nivel = i + 1))
    setItems(next)
    setDirty(true)
    setSaved(false)
  }

  async function saveOrder() {
    setSaving(true)
    setError('')
    const updates = items.map(item => ({ id: item.id, nivel: item.nivel }))
    const result = await updatePenosidadLevels(updates)
    setSaving(false)
    if (result.error) { setError(result.error); return }
    setDirty(false)
    setSaved(true)
    router.refresh()
    setTimeout(() => setSaved(false), 3000)
  }

  function startEdit(item: PenosidadConfig) {
    setEditingId(item.id)
    setEditColor(item.color)
    setEditPuntos(String(item.puntos_base))
  }

  async function saveEdit(item: PenosidadConfig) {
    const result = await updatePenosidadItem(item.id, {
      color:       editColor,
      puntos_base: Number(editPuntos),
    })
    if (result.error) { setError(result.error); return }
    setItems(prev => prev.map(it => it.id === item.id
      ? { ...it, color: editColor, puntos_base: Number(editPuntos) }
      : it
    ))
    setEditingId(null)
    router.refresh()
  }

  const penosidadDesc = [
    'Máxima penosidad',
    'Muy alta',
    'Alta',
    'Media-alta',
    'Media',
    'Baja',
    'Mínima penosidad',
  ]

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <AlertCircle size={18} className="text-blue-600 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-700">
          <strong>Jerarquía de penosidad:</strong> nivel 1 = máxima penosidad (se prefiere repartir primero).
          Arrastra o usa las flechas para reordenar. Los puntos base determinan el peso en el cálculo de equidad.
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
      )}

      {/* Lista */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm hover:border-gray-300 transition-colors"
          >
            {/* Número de nivel */}
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ backgroundColor: item.color }}
            >
              {item.nivel}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{item.etiqueta}</span>
                <span className="text-xs text-gray-400">({index < penosidadDesc.length ? penosidadDesc[index] : ''})</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 truncate">{item.descripcion}</p>
            </div>

            {/* Puntos y color (editables) */}
            {canEdit && editingId === item.id ? (
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1">
                  <label className="text-xs text-gray-500">Color:</label>
                  <input type="color" value={editColor} onChange={e => setEditColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-200" />
                </div>
                <div className="flex items-center gap-1">
                  <label className="text-xs text-gray-500">Pts:</label>
                  <input type="number" value={editPuntos} onChange={e => setEditPuntos(e.target.value)}
                    step="0.25" min="0.25" max="10"
                    className="w-16 input py-1 px-2 text-sm" />
                </div>
                <button onClick={() => saveEdit(item)} className="btn-primary py-1 px-3 text-xs">
                  OK
                </button>
                <button onClick={() => setEditingId(null)} className="btn-secondary py-1 px-3 text-xs">
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-400">Puntos base</p>
                  <p className="font-semibold text-gray-900">{Number(item.puntos_base).toFixed(2)}</p>
                </div>
                {canEdit && (
                  <button onClick={() => startEdit(item)}
                    className="text-xs text-gray-400 hover:text-blue-600 px-2 py-1 rounded border border-gray-200 hover:border-blue-300">
                    Editar
                  </button>
                )}
              </div>
            )}

            {/* Controles de orden */}
            {canEdit && editingId !== item.id && (
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                  title="Más penosidad"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === items.length - 1}
                  className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                  title="Menos penosidad"
                >
                  <ArrowDown size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Guardar orden */}
      {canEdit && (
        <div className="flex items-center gap-3">
          <button
            onClick={saveOrder}
            disabled={!dirty || saving}
            className={`btn-primary ${!dirty ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Save size={16} />
            {saving ? 'Guardando…' : 'Guardar orden'}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-emerald-600">
              <Check size={14} /> Guardado correctamente
            </span>
          )}
          {dirty && !saving && (
            <span className="text-sm text-amber-600">Hay cambios sin guardar</span>
          )}
        </div>
      )}

      {/* Leyenda */}
      <div className="card mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Cómo funciona la penosidad</h3>
        <ul className="space-y-1.5 text-sm text-gray-600">
          <li>• <strong>Nivel 1</strong> = máxima penosidad (festivos especiales, Navidad, etc.).</li>
          <li>• El sistema intentará equilibrar los puntos acumulados entre médicos al planificar guardias.</li>
          <li>• Un médico con más puntos acumulados recibirá preferentemente guardias de menor penosidad.</li>
          <li>• Los <strong>puntos base</strong> se suman al contador de cada médico por cada guardia realizada.</li>
          <li>• El Gestor puede reordenar esta jerarquía en cualquier momento; el cambio se refleja en futuros cálculos.</li>
        </ul>
      </div>
    </div>
  )
}
