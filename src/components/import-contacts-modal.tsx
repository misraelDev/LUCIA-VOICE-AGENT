"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { createContact } from "@/services/ContactService"
import * as XLSX from "xlsx"
import { toast } from "sonner"
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  FileText,
  Loader2,
} from "lucide-react"
import { Poppins } from "next/font/google"
import Image from "next/image"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

interface ImportContactsModalProps {
  isOpen: boolean
  onClose: () => void
  onImportComplete: () => void
}

interface ContactRow {
  email?: string
  phone_number?: string | number
  creation_date?: string
  name?: string
  birthdate?: string
}

export function ImportContactsModal({ isOpen, onClose, onImportComplete }: ImportContactsModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [importStats, setImportStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    errors: [] as string[],
  })

  const validateRow = (row: ContactRow) => {
    const errors: string[] = []

    // Validate email format
    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push(`Formato de correo electrónico inválido: ${row.email}`)
    }

    // Validate phone number
    if (row.phone_number && !/^\d+$/.test(row.phone_number.toString())) {
      errors.push(`Número de teléfono inválido: ${row.phone_number}`)
    }

    // Validate dates
    const dateFields = ["creation_date", "birthdate"]
    dateFields.forEach((field) => {
      if (row[field as keyof ContactRow] && isNaN(Date.parse(row[field as keyof ContactRow] as string))) {
        errors.push(`Formato de fecha inválido para ${field}: ${row[field as keyof ContactRow]}`)
      }
    })

    return errors
  }

  const processFile = async (file: File) => {
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".xlsx")) {
      toast.error("Solo se permiten archivos CSV o XLSX")
      return
    }

    setIsLoading(true)
    setImportProgress(0)
    setImportStats({ total: 0, success: 0, failed: 0, errors: [] })

    try {
      const data = await readFile(file)
      const rows = parseFileData(data, file.name) as ContactRow[]
      let successCount = 0
      let failedCount = 0
      let errors: string[] = []

      setImportStats((prev) => ({ ...prev, total: rows.length }))

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const rowErrors = validateRow(row)

        if (rowErrors.length > 0) {
          failedCount++
          errors = [...errors, ...rowErrors]
          continue
        }

        try {
          // Crear contacto usando el nuevo servicio
          await createContact({
            name: row.name || null,
            email: row.email || null,
            phone_number: row.phone_number ? parseInt(row.phone_number.toString(), 10) : null,
          })

          successCount++
        } catch (error: unknown) {
          failedCount++
          const errorMessage = error instanceof Error ? error.message : "Error desconocido"
          errors.push(`Error al importar fila ${i + 1}: ${errorMessage}`)
        }

        setImportProgress(((i + 1) / rows.length) * 100)
      }

      // Actualizar el estado final después de procesar todas las filas
      setImportStats({
        total: rows.length,
        success: successCount,
        failed: failedCount,
        errors,
      })

      if (successCount > 0) {
        toast.success(`Se importaron ${successCount} contactos exitosamente`)
        onImportComplete()
        if (failedCount === 0) {
          onClose()
        }
      }

      if (failedCount > 0) {
        toast.error(`No se pudieron importar ${failedCount} contactos`)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      toast.error("Error al procesar el archivo: " + errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const readFile = (file: File): Promise<string | ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = e.target?.result
          if (!data) throw new Error("No data read from file")
          resolve(data)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = (error) => reject(error)

      if (file.name.endsWith(".csv")) {
        reader.readAsText(file)
      } else {
        reader.readAsArrayBuffer(file)
      }
    })
  }

  const parseFileData = (data: string | ArrayBuffer, fileName: string): ContactRow[] => {
    if (fileName.endsWith(".csv")) {
      const workbook = XLSX.read(data as string, { type: "string" })
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      return XLSX.utils.sheet_to_json(firstSheet)
    } else {
      const workbook = XLSX.read(data as ArrayBuffer, { type: "array" })
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      return XLSX.utils.sheet_to_json(firstSheet)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
    }
  }

  const downloadTemplate = () => {
    const template = [
      {
        name: "Juan Pérez",
        email: "juan@ejemplo.com",
        phone_number: "1234567890",
      },
      {
        name: "María García",
        email: "maria@ejemplo.com",
        phone_number: "0987654321",
      },
    ]

    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Contactos")
    XLSX.writeFile(wb, "plantilla_contactos.xlsx")
  }

  const resetModal = () => {
    setSelectedFile(null)
    setImportProgress(0)
    setImportStats({ total: 0, success: 0, failed: 0, errors: [] })
    setIsLoading(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`sm:max-w-[700px] max-h-[90vh] overflow-hidden ${poppins.className}`}>
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-6 h-6 relative overflow-hidden flex items-center justify-center">
              <Image 
                className="w-full h-full object-cover" 
                fill 
                alt="Contacts icon" 
                src="/contact.svg" 
              />
            </div>
            Importar contactos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download Section */}
          <Card className="border-[#1868db]/20 bg-[#1868db]/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1868db]/10 rounded-lg">
                    <Download className="h-4 w-4 text-[#1868db]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1868db]">¿Necesitas una plantilla?</p>
                    <p className="text-sm text-[#1868db]/80">Descarga un archivo de ejemplo con el formato correcto</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadTemplate}
                  className="rounded-md bg-[#1868db] hover:bg-[#1458c4] flex flex-row items-center justify-center py-2.5 px-4 gap-2.5 text-white"
                >
                  <Download className="h-4 w-4 mr-2 brightness-0 invert" />
                  Descargar plantilla
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* File Upload Section */}
          {!selectedFile && !isLoading && importStats.total === 0 && (
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-[#1868db] bg-[#1868db]/5" : "border-slate-300 hover:border-[#1868db]"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".xlsx,.csv"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isLoading}
              />
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-[#1868db]/5 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-[#1868db]" />
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-900">
                    Arrastra tu archivo aquí o haz clic para seleccionar
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Formatos soportados: CSV, XLSX (máximo 10MB)</p>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <FileSpreadsheet className="h-4 w-4" />
                    Excel
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    CSV
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Selected File Display */}
          {selectedFile && !isLoading && importStats.total === 0 && (
            <Card className="border-[#1868db]/20 bg-[#1868db]/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1868db]/10 rounded-lg">
                      <FileSpreadsheet className="h-5 w-5 text-[#1868db]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1868db]">{selectedFile.name}</p>
                      <p className="text-sm text-[#1868db]/80">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                      className="border-[#1868db] text-[#1868db] hover:bg-[#1868db]/10"
                    >
                      Cambiar archivo
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => processFile(selectedFile)}
                      className="bg-[#1868db] hover:bg-[#1458c4] text-white"
                    >
                      Importar contactos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading Progress */}
          {isLoading && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-[#1868db]" />
                    <div>
                      <p className="font-medium">Procesando archivo...</p>
                      <p className="text-sm text-slate-500">
                        Importando contactos ({Math.round(importProgress)}% completado)
                      </p>
                    </div>
                  </div>
                  <Progress value={importProgress} className="w-full" />
                  {importStats.total > 0 && (
                    <div className="flex gap-4 text-sm">
                      <span className="text-slate-600">Total: {importStats.total}</span>
                      <span className="text-[#1868db]">Exitosos: {importStats.success}</span>
                      <span className="text-red-600">Fallidos: {importStats.failed}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Import Results */}
          {!isLoading && importStats.total > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#1868db]" />
                    <h3 className="font-semibold">Importación completada</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-slate-900">{importStats.total}</p>
                      <p className="text-sm text-slate-600">Total procesados</p>
                    </div>
                    <div className="text-center p-3 bg-[#1868db]/5 rounded-lg">
                      <p className="text-2xl font-bold text-[#1868db]">{importStats.success}</p>
                      <p className="text-sm text-[#1868db]">Importados</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{importStats.failed}</p>
                      <p className="text-sm text-red-700">Fallidos</p>
                    </div>
                  </div>

                  {importStats.errors.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <p className="font-medium text-red-700">Errores encontrados:</p>
                      </div>
                      <ScrollArea className="h-32 w-full rounded-md border p-3 bg-red-50">
                        <div className="space-y-1">
                          {importStats.errors.map((error, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <XCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-red-700">{error}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={resetModal} className="flex-1 border-slate-300 hover:bg-slate-100">
                      Importar otro archivo
                    </Button>
                    <Button onClick={handleClose} className="flex-1 bg-[#1868db] hover:bg-[#1458c4] text-white">
                      Finalizar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Format Guidelines */}
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-[#1868db]" />
                Formato requerido
              </h4>
              <div className="text-sm">
                <div>
                  <p className="font-medium text-slate-700 mb-1">Columnas requeridas:</p>
                  <ul className="space-y-1 text-slate-600">
                    <li>
                      • <code className="bg-slate-100 px-1 rounded">name</code> - Nombre completo
                    </li>
                    <li>
                      • <code className="bg-slate-100 px-1 rounded">email</code> - Correo electrónico
                    </li>
                    <li>
                      • <code className="bg-slate-100 px-1 rounded">phone_number</code> - Número de teléfono
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
