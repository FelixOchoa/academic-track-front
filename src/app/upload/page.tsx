'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { uploadIndicatorFile } from '@/services/academicIndicatorsService';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  BookOpen,
  Award,
  Microscope,
  Globe,
  Briefcase,
  Info
} from 'lucide-react';

export default function UploadIndicatorPage() {
  const [indicatorType, setIndicatorType] = useState<string>('academic');
  const [program, setProgram] = useState<string>('Ingeniería de Sistemas');
  const [period, setPeriod] = useState<string>('2025-1');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    fileName?: string;
    records?: number;
  } | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setUploadResult({
        success: false,
        message: 'Por favor seleccione un archivo válido en formato Excel (.xlsx, .xls) o CSV.'
      });
      return;
    }

    setSelectedFile(file);
    setUploadResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const result = await uploadIndicatorFile(indicatorType, program, period, selectedFile);
      setUploadResult({
        success: result.success,
        message: result.message,
        fileName: result.fileName,
        records: result.processedRecords
      });
    } catch (err: any) {
      setUploadResult({
        success: false,
        message: err.message || 'Error al procesar y subir el indicador'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/90 dark:bg-slate-950 pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#67a623] hover:border-[#67a623] transition-all shadow-sm"
              title="Volver al Panel Principal"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Carga e Ingesta de Indicadores
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Seleccione el módulo, programa y adjunte el archivo oficial de reporte para actualizar el panel en memoria
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#67a623] text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Panel
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1 space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#67a623]" />
                Instrucciones de Ingesta
              </h2>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#f4faec] text-[#406a16] font-bold flex items-center justify-center text-[11px] shrink-0">1</span>
                  <p>Seleccione el <strong>Módulo de Indicador</strong> que desea cargar.</p>
                </div>
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#f4faec] text-[#406a16] font-bold flex items-center justify-center text-[11px] shrink-0">2</span>
                  <p>Elija el <strong>Programa Académico</strong> correspondiente.</p>
                </div>
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#f4faec] text-[#406a16] font-bold flex items-center justify-center text-[11px] shrink-0">3</span>
                  <p>Adjunte el archivo oficial <strong>.xlsx, .xls o .csv</strong> exportado del sistema institucional.</p>
                </div>
              </div>

              <div className="pt-2">
                <div className="p-3.5 rounded-2xl bg-[#f4faec] dark:bg-[#152708] border border-[#ceeaad] text-[#406a16] dark:text-[#afdd7a] text-[11px] space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#67a623]" />
                    Almacenamiento en Memoria Activo
                  </p>
                  <p className="opacity-90">
                    Los datos procesados actualizarán inmediatamente las gráficas y KPIs del panel de control.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Módulo de Indicador
                  </label>
                  <select
                    value={indicatorType}
                    onChange={(e) => setIndicatorType(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#67a623]"
                  >
                    <option value="academic">Rendimiento Académico & Estudiantes (SACES)</option>
                    <option value="faculty">Cuerpo Docente & Formación</option>
                    <option value="research">Investigación e Innovación</option>
                    <option value="externalRelations">Relaciones Externas & Convenios</option>
                    <option value="graduates">Egresados e Impacto Laboral</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Programa Académico
                  </label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#67a623]"
                  >
                    <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                    <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                    <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
                  </select>
                </div>

                {indicatorType !== 'academic' ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Periodo Académico Base
                    </label>
                    <select
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#67a623]"
                    >
                      <option value="2025-1">2025-1 (Actual)</option>
                      <option value="2024-2">2024-2</option>
                      <option value="2024-1">2024-1</option>
                      <option value="2023-2">2023-2</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1.5 p-3 rounded-xl bg-[#f4faec] dark:bg-[#152708] border border-[#ceeaad] dark:border-[#355516] flex items-center gap-2.5">
                    <Info className="w-4 h-4 text-[#67a623] shrink-0" />
                    <p className="text-[11px] font-semibold text-[#406a16] dark:text-[#afdd7a]">
                      Este indicador procesa automáticamente todos los años y periodos históricos incluidos en el reporte Excel.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Adjuntar Archivo de Indicador (Excel / CSV)
                </label>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`p-8 border-2 border-dashed rounded-3xl text-center transition-all ${
                    isDragOver
                      ? 'border-[#67a623] bg-[#f4faec] dark:bg-[#152708]/40 scale-[0.99]'
                      : selectedFile
                      ? 'border-[#67a623] bg-slate-50 dark:bg-slate-800/40'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 hover:border-slate-400'
                  }`}
                >
                  <input
                    type="file"
                    id="indicator-file-input"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="space-y-3">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-[#f4faec] dark:bg-[#152708] text-[#67a623] dark:text-[#afdd7a] flex items-center justify-center">
                        <FileSpreadsheet className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {(selectedFile.size / 1024).toFixed(1)} KB - Listo para enviar al servidor
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
                      >
                        Cambiar archivo
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="indicator-file-input" className="cursor-pointer space-y-3 block">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center">
                        <UploadCloud className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          Arrastre su archivo Excel o <span className="text-[#67a623] dark:text-[#afdd7a] underline">haga clic para examinar</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Soporta reportes oficiales en formato .xlsx, .xls o .csv
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {uploadResult && (
                <div className={`p-4 rounded-2xl border flex flex-col gap-3 text-xs font-semibold ${
                  uploadResult.success
                    ? 'bg-[#f4faec] dark:bg-[#152708] border-[#ceeaad] text-[#406a16] dark:text-[#afdd7a]'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-300'
                }`}>
                  <div className="flex items-start gap-3">
                    {uploadResult.success ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-[#67a623]" />
                    ) : (
                      <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                    )}
                    <div className="space-y-1">
                      <p className="font-bold text-sm">{uploadResult.message}</p>
                      {uploadResult.records && (
                        <p className="text-[11px] opacity-90">
                          Registros procesados: {uploadResult.records} filas guardadas en memoria.
                        </p>
                      )}
                    </div>
                  </div>

                  {uploadResult.success && (
                    <div className="pt-1">
                      <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#67a623] hover:bg-[#548a1a] text-white font-bold rounded-xl shadow-md transition-all text-xs"
                      >
                        Ver Indicadores Cargados en el Panel Principal
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-5 py-2.5 text-center text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 font-bold text-xs rounded-xl shadow-md transition-all ${
                    !selectedFile || isUploading
                      ? 'bg-slate-300 text-slate-500 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                      : 'bg-[#67a623] hover:bg-[#548a1a] text-white active:scale-95 cursor-pointer'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Procesando e Ingestando...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      Procesar e Ingestar Indicador
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>

      </main>
    </div>
  );
}
