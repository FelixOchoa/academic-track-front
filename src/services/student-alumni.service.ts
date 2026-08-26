import { SeguimientoCohorte, SeguimientoEgresado, AnalisisEgresado } from '@/types/student-alumni';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    return `http://${host}:5000/api`;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl().replace(/\/+$/, '');

export interface Programa {
  id: number;
  nombre: string;
  facultad: string;
  activo: boolean;
}

export interface Periodo {
  id: number;
  anio: number;
  semestre: string;
}

export interface ComparacionCohorte {
  periodoCohorteId: number;
  anio: number;
  semestre: string;
  ingresaron: number;
  continuaron: number;
  desertores: number;
  graduados: number;
  tasaDesercion: number;
  tasaGraduacion: number;
}

class StudentAlumniService {
  async obtenerProgramas(): Promise<Programa[]> {
    const response = await fetch(`${API_BASE_URL}/programas`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data: Programa[] = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Formato inválido para programas.');
    }

    return data;
  }

  async obtenerPeriodos(): Promise<Periodo[]> {
    const response = await fetch(`${API_BASE_URL}/periodos`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data: Periodo[] = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Formato inválido para periodos.');
    }

    return data;
  }

  async obtenerSeguimientoCohorte(
    programaId: number,
    periodoCohorteId: number
  ): Promise<SeguimientoCohorte[]> {
    if (!Number.isInteger(programaId) || programaId <= 0) {
      throw new Error('El programaId debe ser un número entero positivo.');
    }

    if (!Number.isInteger(periodoCohorteId) || periodoCohorteId <= 0) {
      throw new Error(
        'El periodoCohorteId debe ser un número entero positivo.'
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/seguimiento-cohorte/${programaId}/${periodoCohorteId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      let message = `Error HTTP ${response.status}`;

      try {
        const error = await response.json();

        if (error?.mensaje) {
          message = error.mensaje;
        }
      } catch {
        // La API no devolvió JSON.
      }

      throw new Error(message);
    }

    const data: SeguimientoCohorte[] = await response.json();

    if (!Array.isArray(data)) {
      throw new Error(
        'La API devolvió un formato inesperado para el seguimiento de cohorte.'
      );
    }

    return data;
  }

  async obtenerComparacionCohortes(
    programaId: number
  ): Promise<ComparacionCohorte[]> {
    if (!Number.isInteger(programaId) || programaId <= 0) {
      throw new Error('El programaId debe ser un número entero positivo.');
    }

    const response = await fetch(
      `${API_BASE_URL}/seguimiento-cohorte/comparacion/${programaId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      let message = `Error HTTP ${response.status}`;

      try {
        const error = await response.json();

        if (error?.mensaje) {
          message = error.mensaje;
        }
      } catch {
        // La API no devolvió JSON.
      }

      throw new Error(message);
    }

    const data: ComparacionCohorte[] = await response.json();

    if (!Array.isArray(data)) {
      throw new Error(
        'La API devolvió un formato inesperado para la comparación de cohortes.'
      );
    }

    return data;
  }

  async obtenerSeguimientoEgresados(
    programaId: number
  ): Promise<SeguimientoEgresado[]> {
    if (!Number.isInteger(programaId) || programaId <= 0) {
      throw new Error('El programaId debe ser un número entero positivo.');
    }

    const response = await fetch(
      `${API_BASE_URL}/seguimiento-egresado/${programaId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      let message = `Error HTTP ${response.status}`;

      try {
        const error = await response.json();

        if (error?.mensaje) {
          message = error.mensaje;
        }
      } catch {
        // La API no devolvió JSON.
      }

      throw new Error(message);
    }

    const data: SeguimientoEgresado[] = await response.json();

    if (!Array.isArray(data)) {
      throw new Error(
        'La API devolvió un formato inesperado para el seguimiento de egresados.'
      );
    }

    return data;
  }

  async obtenerAnalisisEgresado(
    programaId: number,
    anioGraduacion: number
  ): Promise<AnalisisEgresado> {
    if (!Number.isInteger(programaId) || programaId <= 0) {
      throw new Error('El programaId debe ser un número entero positivo.');
    }

    if (!Number.isInteger(anioGraduacion) || anioGraduacion <= 0) {
      throw new Error('El año de graduación debe ser válido.');
    }

    const response = await fetch(
      `${API_BASE_URL}/seguimiento-egresado/analisis/${programaId}/${anioGraduacion}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      let message = `Error HTTP ${response.status}`;

      try {
        const error = await response.json();

        if (error?.mensaje) {
          message = error.mensaje;
        }
      } catch {
        // La API no devolvió JSON.
      }

      throw new Error(message);
    }

    const data: AnalisisEgresado = await response.json();

    if (!data || typeof data !== 'object') {
      throw new Error(
        'La API devolvió un formato inesperado para el análisis de egresados.'
      );
    }

    return data;
  }
}

export const studentAlumniService = new StudentAlumniService();
