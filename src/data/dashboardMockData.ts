export interface DashboardData {
  programaInfo: {
    nombre: string;
    facultad: string;
    codigoSnies: string;
    acreditacion: string;
    modalidad: string;
    duracionSemestres: number;
    director: string;
  };
  estudiantes: {
    matriculadosActual: number;
    nuevos: number;
    tasaAprobacion: string;
    tasaReprobacion: string;
    tasaDesercionActual: string;
    promedioGraduacionSemestres: number;
    metaGraduacionSemestres: number;
    historicoMatricula: Array<{
      periodo: string;
      matriculados: number;
      nuevos: number;
      desercion: number;
      aprobacion: number;
    }>;
    desgloseSemestre: Array<{
      semestre: string;
      estudiantes: number;
      aprobacion: number;
      reprobacion: number;
      desercion: number;
    }>;
  };
  docentes: {
    total: number;
    tiempoCompleto: number;
    medioTiempo: number;
    catedra: number;
    nivelFormacion: Array<{
      nivel: "Doctorado" | "Maestría" | "Especialización" | "Pregrado";
      cantidad: number;
      porcentaje: number;
    }>;
    distribucionContratacion: Array<{
      tipo: string;
      cantidad: number;
    }>;
    docentesLista: Array<{
      id: string;
      nombre: string;
      formacion: string;
      areaConocimiento: string;
      articulosPublicados: number;
      vinculacion: string;
    }>;
  };
  investigacion: {
    grupos: Array<{
      nombre: string;
      categoria: "A1" | "A" | "B" | "C" | "Reconocido";
      lider: string;
      semillerosActivos: number;
      lineasInvestigacion: string[];
    }>;
    publicacionesRecientes: number;
    scopusIndexed: number;
    innovaciones: number;
    patentes: number;
    historicoPublicaciones: Array<{
      año: number;
      scopus: number;
      nacionales: number;
      libros: number;
    }>;
    listaPublicaciones: Array<{
      titulo: string;
      revista: string;
      año: number;
      doi: string;
      indexada: boolean;
    }>;
  };
  relacionesExternas: {
    conveniosNacionales: number;
    conveniosInternacionales: number;
    conveniosLista: Array<{
      institucion: string;
      pais: string;
      tipo: "Académico" | "Investigación" | "Movilidad" | "Prácticas";
      estado: "Vigente" | "En Renovación";
    }>;
    actividadesExtension: Array<{
      id: string;
      nombre: string;
      tipo: string;
      participantes: number;
      impacto: string;
      fecha: string;
    }>;
  };
  egresados: {
    tasaVinculacionLaboral: string;
    tiempoPromedioEmpleoMeses: number;
    salarioPromedioSMLV: number;
    satisfaccionEmpleadores: string;
    sectoresDesempeno: Array<{
      sector: string;
      porcentaje: number;
    }>;
    ubicacionLaboral: Array<{
      region: string;
      porcentaje: number;
    }>;
  };
}

export const mockDatabase: Record<string, Record<string, DashboardData>> = {
  "Ingeniería de Sistemas": {
    "2025-1": {
      programaInfo: {
        nombre: "Ingeniería de Sistemas",
        facultad: "Facultad de Ingeniería y Tecnologías",
        codigoSnies: "12345",
        acreditacion: "Alta Calidad (Res. MinEducación 01425)",
        modalidad: "Presencial",
        duracionSemestres: 10,
        director: "Ing. Alvaro Oñate"
      },
      estudiantes: {
        matriculadosActual: 450,
        nuevos: 65,
        tasaAprobacion: "84.5%",
        tasaReprobacion: "15.5%",
        tasaDesercionActual: "12.0%",
        promedioGraduacionSemestres: 11.2,
        metaGraduacionSemestres: 10,
        historicoMatricula: [
          { periodo: "2023-1", matriculados: 410, nuevos: 55, desercion: 14.2, aprobacion: 81.0 },
          { periodo: "2023-2", matriculados: 425, nuevos: 60, desercion: 13.5, aprobacion: 82.5 },
          { periodo: "2024-1", matriculados: 438, nuevos: 62, desercion: 12.8, aprobacion: 83.2 },
          { periodo: "2024-2", matriculados: 442, nuevos: 58, desercion: 12.3, aprobacion: 84.0 },
          { periodo: "2025-1", matriculados: 450, nuevos: 65, desercion: 12.0, aprobacion: 84.5 }
        ],
        desgloseSemestre: [
          { semestre: "Sem 1-2", estudiantes: 125, aprobacion: 78.0, reprobacion: 22.0, desercion: 18.5 },
          { semestre: "Sem 3-4", estudiantes: 105, aprobacion: 82.5, reprobacion: 17.5, desercion: 12.0 },
          { semestre: "Sem 5-6", estudiantes: 90, aprobacion: 87.0, reprobacion: 13.0, desercion: 8.5 },
          { semestre: "Sem 7-8", estudiantes: 75, aprobacion: 91.5, reprobacion: 8.5, desercion: 4.2 },
          { semestre: "Sem 9-10", estudiantes: 55, aprobacion: 95.0, reprobacion: 5.0, desercion: 1.5 }
        ]
      },
      docentes: {
        total: 35,
        tiempoCompleto: 22,
        medioTiempo: 5,
        catedra: 8,
        nivelFormacion: [
          { nivel: "Doctorado", cantidad: 8, porcentaje: 22.8 },
          { nivel: "Maestría", cantidad: 20, porcentaje: 57.2 },
          { nivel: "Especialización", cantidad: 5, porcentaje: 14.3 },
          { nivel: "Pregrado", cantidad: 2, porcentaje: 5.7 }
        ],
        distribucionContratacion: [
          { tipo: "Planta / Tiempo Completo", cantidad: 22 },
          { tipo: "Ocasional", cantidad: 5 },
          { tipo: "Cátedra", cantidad: 8 }
        ],
        docentesLista: [
          { id: "DOC-01", nombre: "Dr. Roberto Gómez Silva", formacion: "Ph.D. en Ciencias de la Computación", areaConocimiento: "Inteligencia Artificial & Big Data", articulosPublicados: 18, vinculacion: "Planta" },
          { id: "DOC-02", nombre: "Dra. María Fernanda López", formacion: "Ph.D. en Ingeniería de Software", areaConocimiento: "Arquitectura Cloud & DevOps", articulosPublicados: 14, vinculacion: "Planta" },
          { id: "DOC-03", nombre: "MSc. Andrés Felipe Castro", formacion: "Magíster en Ciberseguridad", areaConocimiento: "Seguridad Informática & Redes", articulosPublicados: 9, vinculacion: "Planta" },
          { id: "DOC-04", nombre: "MSc. Diana Marcela Torres", formacion: "Magíster en Analítica de Datos", areaConocimiento: "Bases de Datos & BI", articulosPublicados: 6, vinculacion: "Ocasional" },
          { id: "DOC-05", nombre: "Ing. Jorge Luis Ramírez", formacion: "Especialista en Gerencia de Proyectos", areaConocimiento: "Metodologías Ágiles", articulosPublicados: 2, vinculacion: "Cátedra" }
        ]
      },
      investigacion: {
        grupos: [
          { nombre: "GISICO", categoria: "A", lider: "Dr. Roberto Gómez", semillerosActivos: 4, lineasInvestigacion: ["Inteligencia Artificial", "Visión por Computador", "IoT"] },
          { nombre: "AITICE", categoria: "B", lider: "Dra. María Fernanda López", semillerosActivos: 3, lineasInvestigacion: ["Ingeniería de Software", "Sistemas Distribuidos"] },
          { nombre: "CYBERSEC", categoria: "C", lider: "MSc. Andrés Castro", semillerosActivos: 2, lineasInvestigacion: ["Ciberseguridad", "Criptografía Aplicada"] }
        ],
        publicacionesRecientes: 14,
        scopusIndexed: 9,
        innovaciones: 3,
        patentes: 1,
        historicoPublicaciones: [
          { año: 2021, scopus: 4, nacionales: 6, libros: 1 },
          { año: 2022, scopus: 6, nacionales: 7, libros: 2 },
          { año: 2023, scopus: 8, nacionales: 5, libros: 1 },
          { año: 2024, scopus: 9, nacionales: 5, libros: 3 }
        ],
        listaPublicaciones: [
          { titulo: "Deep Learning Models for Agricultural Yield Prediction in Cesar Region", revista: "IEEE Access (Q1)", año: 2024, doi: "10.1109/ACCESS.2024.331234", indexada: true },
          { titulo: "Microservices Architecture Evaluation in Cloud-Native Academic Platforms", revista: "Journal of Systems and Software (Q2)", año: 2024, doi: "10.1016/j.jss.2024.111890", indexada: true },
          { titulo: "Análisis de Riesgos de Ciberseguridad en PyMES del Sector Agroindustrial", revista: "Revista Colombiana de Computación", año: 2023, doi: "10.2238/rcc.2023.882", indexada: false }
        ]
      },
      relacionesExternas: {
        conveniosNacionales: 12,
        conveniosInternacionales: 4,
        conveniosLista: [
          { institucion: "Universidad Nacional de Colombia", pais: "Colombia", tipo: "Investigación", estado: "Vigente" },
          { institucion: "Tecnológico de Monterrey", pais: "México", tipo: "Movilidad", estado: "Vigente" },
          { institucion: "Universidad Politécnica de Valencia", pais: "España", tipo: "Académico", estado: "Vigente" },
          { institucion: "Grupo Nutresa / SISA", pais: "Colombia", tipo: "Prácticas", estado: "Vigente" }
        ],
        actividadesExtension: [
          { id: "EXT-01", nombre: "Bootcamp Talento Tech 2025", tipo: "Formación Continuada", participantes: 45, impacto: "Certificación de 45 jóvenes en desarrollo web full-stack", fecha: "Febrero 2025" },
          { id: "EXT-02", nombre: "Seminario Internacional de Ciberseguridad", tipo: "Simposio", participantes: 120, impacto: "Capacitación a profesionales de la región del Cesar", fecha: "Noviembre 2024" },
          { id: "EXT-03", nombre: "Hackathon AgroTech Innova", tipo: "Competencia de Innovación", participantes: 85, impacto: "Desarrollo de 12 prototipos tecnológicos para el campo", fecha: "Septiembre 2024" }
        ]
      },
      egresados: {
        tasaVinculacionLaboral: "88.4%",
        tiempoPromedioEmpleoMeses: 3.2,
        salarioPromedioSMLV: 3.8,
        satisfaccionEmpleadores: "94.2%",
        sectoresDesempeno: [
          { sector: "Desarrollo de Software & Cloud", porcentaje: 45.0 },
          { sector: "Consultoría & TI Corporativa", porcentaje: 22.0 },
          { sector: "Ciberseguridad & Infraestructura", porcentaje: 15.0 },
          { sector: "Sector Público / Educación", porcentaje: 10.0 },
          { sector: "Emprendimiento Propio", porcentaje: 8.0 }
        ],
        ubicacionLaboral: [
          { region: "Regional (Cesar / Caribe)", porcentaje: 40.0 },
          { region: "Nacional (Bogotá, Medellín, Cali)", porcentaje: 35.0 },
          { region: "Internacional (Remoto / Presencial)", porcentaje: 25.0 }
        ]
      }
    },
    "2024-2": {
      programaInfo: {
        nombre: "Ingeniería de Sistemas",
        facultad: "Facultad de Ingeniería y Tecnologías",
        codigoSnies: "12345",
        acreditacion: "Alta Calidad (Res. MinEducación 01425)",
        modalidad: "Presencial",
        duracionSemestres: 10,
        director: "Ing. Carlos Eduardo Martínez, Ph.D."
      },
      estudiantes: {
        matriculadosActual: 442,
        nuevos: 58,
        tasaAprobacion: "84.0%",
        tasaReprobacion: "16.0%",
        tasaDesercionActual: "12.3%",
        promedioGraduacionSemestres: 11.4,
        metaGraduacionSemestres: 10,
        historicoMatricula: [
          { periodo: "2023-1", matriculados: 410, nuevos: 55, desercion: 14.2, aprobacion: 81.0 },
          { periodo: "2023-2", matriculados: 425, nuevos: 60, desercion: 13.5, aprobacion: 82.5 },
          { periodo: "2024-1", matriculados: 438, nuevos: 62, desercion: 12.8, aprobacion: 83.2 },
          { periodo: "2024-2", matriculados: 442, nuevos: 58, desercion: 12.3, aprobacion: 84.0 }
        ],
        desgloseSemestre: [
          { semestre: "Sem 1-2", estudiantes: 120, aprobacion: 77.0, reprobacion: 23.0, desercion: 19.0 },
          { semestre: "Sem 3-4", estudiantes: 102, aprobacion: 81.5, reprobacion: 18.5, desercion: 12.5 },
          { semestre: "Sem 5-6", estudiantes: 88, aprobacion: 86.0, reprobacion: 14.0, desercion: 9.0 },
          { semestre: "Sem 7-8", estudiantes: 74, aprobacion: 91.0, reprobacion: 9.0, desercion: 4.5 },
          { semestre: "Sem 9-10", estudiantes: 58, aprobacion: 94.5, reprobacion: 5.5, desercion: 1.8 }
        ]
      },
      docentes: {
        total: 34,
        tiempoCompleto: 21,
        medioTiempo: 5,
        catedra: 8,
        nivelFormacion: [
          { nivel: "Doctorado", cantidad: 7, porcentaje: 20.6 },
          { nivel: "Maestría", cantidad: 20, porcentaje: 58.8 },
          { nivel: "Especialización", cantidad: 5, porcentaje: 14.7 },
          { nivel: "Pregrado", cantidad: 2, porcentaje: 5.9 }
        ],
        distribucionContratacion: [
          { tipo: "Planta / Tiempo Completo", cantidad: 21 },
          { tipo: "Ocasional", cantidad: 5 },
          { tipo: "Cátedra", cantidad: 8 }
        ],
        docentesLista: [
          { id: "DOC-01", nombre: "Dr. Roberto Gómez Silva", formacion: "Ph.D. en Ciencias de la Computación", areaConocimiento: "Inteligencia Artificial", articulosPublicados: 16, vinculacion: "Planta" },
          { id: "DOC-02", nombre: "Dra. María Fernanda López", formacion: "Ph.D. en Ingeniería de Software", areaConocimiento: "Cloud Computing", articulosPublicados: 12, vinculacion: "Planta" }
        ]
      },
      investigacion: {
        grupos: [
          { nombre: "GISICO", categoria: "A", lider: "Dr. Roberto Gómez", semillerosActivos: 4, lineasInvestigacion: ["IA", "IoT"] },
          { nombre: "AITICE", categoria: "B", lider: "Dra. María Fernanda López", semillerosActivos: 3, lineasInvestigacion: ["Ing. Software"] }
        ],
        publicacionesRecientes: 12,
        scopusIndexed: 8,
        innovaciones: 2,
        patentes: 1,
        historicoPublicaciones: [
          { año: 2021, scopus: 4, nacionales: 6, libros: 1 },
          { año: 2022, scopus: 6, nacionales: 7, libros: 2 },
          { año: 2023, scopus: 8, nacionales: 5, libros: 1 },
          { año: 2024, scopus: 8, nacionales: 4, libros: 2 }
        ],
        listaPublicaciones: []
      },
      relacionesExternas: {
        conveniosNacionales: 11,
        conveniosInternacionales: 3,
        conveniosLista: [
          { institucion: "Universidad Nacional de Colombia", pais: "Colombia", tipo: "Investigación", estado: "Vigente" }
        ],
        actividadesExtension: [
          { id: "EXT-02", nombre: "Seminario Internacional de Ciberseguridad", tipo: "Simposio", participantes: 120, impacto: "Capacitación a profesionales de la región", fecha: "Noviembre 2024" }
        ]
      },
      egresados: {
        tasaVinculacionLaboral: "86.5%",
        tiempoPromedioEmpleoMeses: 3.5,
        salarioPromedioSMLV: 3.6,
        satisfaccionEmpleadores: "92.0%",
        sectoresDesempeno: [
          { sector: "Desarrollo de Software", porcentaje: 46.0 },
          { sector: "Consultoría TI", porcentaje: 20.0 },
          { sector: "Infraestructura", porcentaje: 16.0 },
          { sector: "Otros", porcentaje: 18.0 }
        ],
        ubicacionLaboral: [
          { region: "Regional", porcentaje: 42.0 },
          { region: "Nacional", porcentaje: 36.0 },
          { region: "Internacional", porcentaje: 22.0 }
        ]
      }
    }
  },
  "Ingeniería Industrial": {
    "2025-1": {
      programaInfo: {
        nombre: "Ingeniería Industrial",
        facultad: "Facultad de Ingeniería y Tecnologías",
        codigoSnies: "67890",
        acreditacion: "Acreditación de Alta Calidad",
        modalidad: "Presencial",
        duracionSemestres: 10,
        director: "Ing. Martha Patricia Suárez, M.Sc."
      },
      estudiantes: {
        matriculadosActual: 380,
        nuevos: 52,
        tasaAprobacion: "86.0%",
        tasaReprobacion: "14.0%",
        tasaDesercionActual: "9.8%",
        promedioGraduacionSemestres: 10.8,
        metaGraduacionSemestres: 10,
        historicoMatricula: [
          { periodo: "2023-1", matriculados: 350, nuevos: 48, desercion: 11.2, aprobacion: 83.5 },
          { periodo: "2023-2", matriculados: 362, nuevos: 50, desercion: 10.5, aprobacion: 84.8 },
          { periodo: "2024-1", matriculados: 370, nuevos: 51, desercion: 10.1, aprobacion: 85.2 },
          { periodo: "2024-2", matriculados: 375, nuevos: 49, desercion: 10.0, aprobacion: 85.8 },
          { periodo: "2025-1", matriculados: 380, nuevos: 52, desercion: 9.8, aprobacion: 86.0 }
        ],
        desgloseSemestre: [
          { semestre: "Sem 1-2", estudiantes: 100, aprobacion: 81.0, reprobacion: 19.0, desercion: 14.0 },
          { semestre: "Sem 3-4", estudiantes: 90, aprobacion: 84.0, reprobacion: 16.0, desercion: 10.0 },
          { semestre: "Sem 5-6", estudiantes: 80, aprobacion: 88.0, reprobacion: 12.0, desercion: 7.0 },
          { semestre: "Sem 7-8", estudiantes: 65, aprobacion: 92.0, reprobacion: 8.0, desercion: 3.5 },
          { semestre: "Sem 9-10", estudiantes: 45, aprobacion: 96.0, reprobacion: 4.0, desercion: 1.0 }
        ]
      },
      docentes: {
        total: 28,
        tiempoCompleto: 18,
        medioTiempo: 4,
        catedra: 6,
        nivelFormacion: [
          { nivel: "Doctorado", cantidad: 6, porcentaje: 21.4 },
          { nivel: "Maestría", cantidad: 18, porcentaje: 64.3 },
          { nivel: "Especialización", cantidad: 4, porcentaje: 14.3 },
          { nivel: "Pregrado", cantidad: 0, porcentaje: 0 }
        ],
        distribucionContratacion: [
          { tipo: "Planta / Tiempo Completo", cantidad: 18 },
          { tipo: "Ocasional", cantidad: 4 },
          { tipo: "Cátedra", cantidad: 6 }
        ],
        docentesLista: [
          { id: "DOC-IND-01", nombre: "Dr. Fernando Morales", formacion: "Ph.D. en Investigación de Operaciones", areaConocimiento: "Optimización & Logística", articulosPublicados: 15, vinculacion: "Planta" }
        ]
      },
      investigacion: {
        grupos: [
          { nombre: "LOGISTICS-HUB", categoria: "A", lider: "Dr. Fernando Morales", semillerosActivos: 3, lineasInvestigacion: ["Cadena de Suministro", "Lean Manufacturing"] },
          { nombre: "GIPROD", categoria: "B", lider: "Ing. Martha Suárez", semillerosActivos: 2, lineasInvestigacion: ["Gestión de Calidad", "Ergonomía"] }
        ],
        publicacionesRecientes: 10,
        scopusIndexed: 6,
        innovaciones: 2,
        patentes: 0,
        historicoPublicaciones: [
          { año: 2022, scopus: 4, nacionales: 5, libros: 1 },
          { año: 2023, scopus: 5, nacionales: 4, libros: 2 },
          { año: 2024, scopus: 6, nacionales: 4, libros: 1 }
        ],
        listaPublicaciones: []
      },
      relacionesExternas: {
        conveniosNacionales: 15,
        conveniosInternacionales: 3,
        conveniosLista: [
          { institucion: "Universidad de Antioquia", pais: "Colombia", tipo: "Investigación", estado: "Vigente" }
        ],
        actividadesExtension: [
          { id: "EXT-IND-01", nombre: "Diplomado en Lean Six Sigma Green Belt", tipo: "Educación Continua", participantes: 38, impacto: "Certificación industrial a profesionales", fecha: "Enero 2025" }
        ]
      },
      egresados: {
        tasaVinculacionLaboral: "91.2%",
        tiempoPromedioEmpleoMeses: 2.8,
        salarioPromedioSMLV: 3.5,
        satisfaccionEmpleadores: "96.0%",
        sectoresDesempeno: [
          { sector: "Manufactura & Producción", porcentaje: 35.0 },
          { sector: "Logística & Cadena de Suministro", porcentaje: 30.0 },
          { sector: "Banca & Consultoría Financiera", porcentaje: 20.0 },
          { sector: "Gestión de Calidad & Servicios", porcentaje: 15.0 }
        ],
        ubicacionLaboral: [
          { region: "Regional", porcentaje: 50.0 },
          { region: "Nacional", porcentaje: 40.0 },
          { region: "Internacional", porcentaje: 10.0 }
        ]
      }
    }
  },
  "Ingeniería Electrónica": {
    "2025-1": {
      programaInfo: {
        nombre: "Ingeniería Electrónica",
        facultad: "Facultad de Ingeniería y Tecnologías",
        codigoSnies: "54321",
        acreditacion: "Registro Calificado Renovado",
        modalidad: "Presencial",
        duracionSemestres: 10,
        director: "Ing. Gustavo Adolfo Ramírez, Ph.D."
      },
      estudiantes: {
        matriculadosActual: 290,
        nuevos: 40,
        tasaAprobacion: "81.2%",
        tasaReprobacion: "18.8%",
        tasaDesercionActual: "13.5%",
        promedioGraduacionSemestres: 11.5,
        metaGraduacionSemestres: 10,
        historicoMatricula: [
          { periodo: "2023-1", matriculados: 270, nuevos: 35, desercion: 15.0, aprobacion: 78.5 },
          { periodo: "2023-2", matriculados: 278, nuevos: 38, desercion: 14.2, aprobacion: 79.8 },
          { periodo: "2024-1", matriculados: 282, nuevos: 39, desercion: 13.9, aprobacion: 80.5 },
          { periodo: "2024-2", matriculados: 285, nuevos: 38, desercion: 13.7, aprobacion: 81.0 },
          { periodo: "2025-1", matriculados: 290, nuevos: 40, desercion: 13.5, aprobacion: 81.2 }
        ],
        desgloseSemestre: [
          { semestre: "Sem 1-2", estudiantes: 78, aprobacion: 74.0, reprobacion: 26.0, desercion: 20.0 },
          { semestre: "Sem 3-4", estudiantes: 65, aprobacion: 78.0, reprobacion: 22.0, desercion: 14.5 },
          { semestre: "Sem 5-6", estudiantes: 58, aprobacion: 83.0, reprobacion: 17.0, desercion: 9.5 },
          { semestre: "Sem 7-8", estudiantes: 50, aprobacion: 89.0, reprobacion: 11.0, desercion: 4.8 },
          { semestre: "Sem 9-10", estudiantes: 39, aprobacion: 94.0, reprobacion: 6.0, desercion: 2.0 }
        ]
      },
      docentes: {
        total: 24,
        tiempoCompleto: 15,
        medioTiempo: 3,
        catedra: 6,
        nivelFormacion: [
          { nivel: "Doctorado", cantidad: 7, porcentaje: 29.2 },
          { nivel: "Maestría", cantidad: 14, porcentaje: 58.3 },
          { nivel: "Especialización", cantidad: 3, porcentaje: 12.5 },
          { nivel: "Pregrado", cantidad: 0, porcentaje: 0 }
        ],
        distribucionContratacion: [
          { tipo: "Planta / Tiempo Completo", cantidad: 15 },
          { tipo: "Ocasional", cantidad: 3 },
          { tipo: "Cátedra", cantidad: 6 }
        ],
        docentesLista: [
          { id: "DOC-ELE-01", nombre: "Dr. Gustavo Adolfo Ramírez", formacion: "Ph.D. en Bioingeniería & Telecomunicaciones", areaConocimiento: "Procesamiento Digital de Señales", articulosPublicados: 22, vinculacion: "Planta" }
        ]
      },
      investigacion: {
        grupos: [
          { nombre: "GISELT", categoria: "A", lider: "Dr. Gustavo Ramírez", semillerosActivos: 3, lineasInvestigacion: ["Automatización Industrial", "Telecomunicaciones 5G", "Sistemas Embebidos"] }
        ],
        publicacionesRecientes: 11,
        scopusIndexed: 8,
        innovaciones: 4,
        patentes: 2,
        historicoPublicaciones: [
          { año: 2022, scopus: 5, nacionales: 4, libros: 1 },
          { año: 2023, scopus: 7, nacionales: 3, libros: 1 },
          { año: 2024, scopus: 8, nacionales: 3, libros: 2 }
        ],
        listaPublicaciones: []
      },
      relacionesExternas: {
        conveniosNacionales: 8,
        conveniosInternacionales: 5,
        conveniosLista: [
          { institucion: "Universidad Estatal de Campinas (UNICAMP)", pais: "Brasil", tipo: "Movilidad", estado: "Vigente" }
        ],
        actividadesExtension: [
          { id: "EXT-ELE-01", nombre: "Workshop de Domótica y Redes de Sensores", tipo: "Taller Técnico", participantes: 55, impacto: "Desarrollo de prototipos para smart homes", fecha: "Diciembre 2024" }
        ]
      },
      egresados: {
        tasaVinculacionLaboral: "87.0%",
        tiempoPromedioEmpleoMeses: 3.4,
        salarioPromedioSMLV: 3.9,
        satisfaccionEmpleadores: "93.5%",
        sectoresDesempeno: [
          { sector: "Telecomunicaciones & Redes", porcentaje: 40.0 },
          { sector: "Automatización & Robótica", porcentaje: 30.0 },
          { sector: "Energías Renovables", porcentaje: 18.0 },
          { sector: "Mantenimiento Biomédico", porcentaje: 12.0 }
        ],
        ubicacionLaboral: [
          { region: "Regional", porcentaje: 35.0 },
          { region: "Nacional", porcentaje: 45.0 },
          { region: "Internacional", porcentaje: 20.0 }
        ]
      }
    }
  }
};

// Generador de datos agregados para "Todos los Programas"
export function getDashboardData(programa: string, periodo: string): DashboardData {
  if (programa !== "Todos los Programas" && mockDatabase[programa]?.[periodo]) {
    return mockDatabase[programa][periodo];
  }

  // Fallback si el periodo exacto no está mockead: retornar 2025-1
  if (programa !== "Todos los Programas" && mockDatabase[programa]) {
    const periodos = Object.keys(mockDatabase[programa]);
    return mockDatabase[programa][periodos[0]];
  }

  // Si se selecciona "Todos los Programas", agregamos datos
  const programas = Object.keys(mockDatabase);
  let totalMatriculados = 0;
  let totalNuevos = 0;
  let totalDocentes = 0;
  let totalDoctorado = 0;
  let totalMaestria = 0;
  let totalEspecializacion = 0;
  let totalPregrado = 0;
  let totalPublicaciones = 0;
  let totalScopus = 0;
  let totalInnovaciones = 0;
  let totalPatentes = 0;
  let totalConveniosNac = 0;
  let totalConveniosInt = 0;

  programas.forEach((p) => {
    const d = mockDatabase[p][periodo] || mockDatabase[p]["2025-1"];
    if (!d) return;
    totalMatriculados += d.estudiantes.matriculadosActual;
    totalNuevos += d.estudiantes.nuevos;
    totalDocentes += d.docentes.total;
    
    d.docentes.nivelFormacion.forEach(nf => {
      if (nf.nivel === "Doctorado") totalDoctorado += nf.cantidad;
      if (nf.nivel === "Maestría") totalMaestria += nf.cantidad;
      if (nf.nivel === "Especialización") totalEspecializacion += nf.cantidad;
      if (nf.nivel === "Pregrado") totalPregrado += nf.cantidad;
    });

    totalPublicaciones += d.investigacion.publicacionesRecientes;
    totalScopus += d.investigacion.scopusIndexed;
    totalInnovaciones += d.investigacion.innovaciones;
    totalPatentes += d.investigacion.patentes;
    totalConveniosNac += d.relacionesExternas.conveniosNacionales;
    totalConveniosInt += d.relacionesExternas.conveniosInternacionales;
  });

  return {
    programaInfo: {
      nombre: "Consolidado Facultad de Ingeniería y Tecnologías",
      facultad: "Facultad de Ingeniería y Tecnologías",
      codigoSnies: "Varios",
      acreditacion: "3 Programas Acreditados / En Acreditación",
      modalidad: "Presencial",
      duracionSemestres: 10,
      director: "Decanatura de Ingeniería y Tecnologías"
    },
    estudiantes: {
      matriculadosActual: totalMatriculados,
      nuevos: totalNuevos,
      tasaAprobacion: "84.2%",
      tasaReprobacion: "15.8%",
      tasaDesercionActual: "11.7%",
      promedioGraduacionSemestres: 11.1,
      metaGraduacionSemestres: 10,
      historicoMatricula: [
        { periodo: "2023-1", matriculados: 1030, nuevos: 138, desercion: 13.4, aprobacion: 81.0 },
        { periodo: "2023-2", matriculados: 1065, nuevos: 148, desercion: 12.7, aprobacion: 82.4 },
        { periodo: "2024-1", matriculados: 1090, nuevos: 152, desercion: 12.2, aprobacion: 83.0 },
        { periodo: "2024-2", matriculados: 1102, nuevos: 145, desercion: 12.0, aprobacion: 83.6 },
        { periodo: "2025-1", matriculados: totalMatriculados, nuevos: totalNuevos, desercion: 11.7, aprobacion: 84.2 }
      ],
      desgloseSemestre: [
        { semestre: "Sem 1-2", estudiantes: 303, aprobacion: 77.5, reprobacion: 22.5, desercion: 17.5 },
        { semestre: "Sem 3-4", estudiantes: 260, aprobacion: 81.5, reprobacion: 18.5, desercion: 12.2 },
        { semestre: "Sem 5-6", estudiantes: 228, aprobacion: 86.0, reprobacion: 14.0, desercion: 8.3 },
        { semestre: "Sem 7-8", estudiantes: 190, aprobacion: 90.8, reprobacion: 9.2, desercion: 4.2 },
        { semestre: "Sem 9-10", estudiantes: 139, aprobacion: 95.0, reprobacion: 5.0, desercion: 1.5 }
      ]
    },
    docentes: {
      total: totalDocentes,
      tiempoCompleto: 55,
      medioTiempo: 12,
      catedra: 20,
      nivelFormacion: [
        { nivel: "Doctorado", cantidad: totalDoctorado, porcentaje: Math.round((totalDoctorado / totalDocentes) * 1000) / 10 },
        { nivel: "Maestría", cantidad: totalMaestria, porcentaje: Math.round((totalMaestria / totalDocentes) * 1000) / 10 },
        { nivel: "Especialización", cantidad: totalEspecializacion, porcentaje: Math.round((totalEspecializacion / totalDocentes) * 1000) / 10 },
        { nivel: "Pregrado", cantidad: totalPregrado, porcentaje: Math.round((totalPregrado / totalDocentes) * 1000) / 10 }
      ],
      distribucionContratacion: [
        { tipo: "Planta / Tiempo Completo", cantidad: 55 },
        { tipo: "Ocasional", cantidad: 12 },
        { tipo: "Cátedra", cantidad: 20 }
      ],
      docentesLista: [
        { id: "DOC-01", nombre: "Dr. Roberto Gómez Silva", formacion: "Ph.D. en Ciencias de la Computación", areaConocimiento: "Inteligencia Artificial", articulosPublicados: 18, vinculacion: "Planta" },
        { id: "DOC-ELE-01", nombre: "Dr. Gustavo Adolfo Ramírez", formacion: "Ph.D. en Bioingeniería", areaConocimiento: "Telecomunicaciones", articulosPublicados: 22, vinculacion: "Planta" },
        { id: "DOC-IND-01", nombre: "Dr. Fernando Morales", formacion: "Ph.D. en Investigación de Operaciones", areaConocimiento: "Logística", articulosPublicados: 15, vinculacion: "Planta" }
      ]
    },
    investigacion: {
      grupos: [
        { nombre: "GISICO", categoria: "A", lider: "Dr. Roberto Gómez", semillerosActivos: 4, lineasInvestigacion: ["Inteligencia Artificial", "IoT"] },
        { nombre: "LOGISTICS-HUB", categoria: "A", lider: "Dr. Fernando Morales", semillerosActivos: 3, lineasInvestigacion: ["Cadena de Suministro"] },
        { nombre: "GISELT", categoria: "A", lider: "Dr. Gustavo Ramírez", semillerosActivos: 3, lineasInvestigacion: ["Telecomunicaciones"] },
        { nombre: "AITICE", categoria: "B", lider: "Dra. María Fernanda López", semillerosActivos: 3, lineasInvestigacion: ["Ingeniería de Software"] }
      ],
      publicacionesRecientes: totalPublicaciones,
      scopusIndexed: totalScopus,
      innovaciones: totalInnovaciones,
      patentes: totalPatentes,
      historicoPublicaciones: [
        { año: 2021, scopus: 12, nacionales: 16, libros: 3 },
        { año: 2022, scopus: 15, nacionales: 18, libros: 5 },
        { año: 2023, scopus: 20, nacionales: 12, libros: 4 },
        { año: 2024, scopus: 23, nacionales: 12, libros: 6 }
      ],
      listaPublicaciones: [
        { titulo: "Deep Learning Models for Agricultural Yield Prediction in Cesar Region", revista: "IEEE Access (Q1)", año: 2024, doi: "10.1109/ACCESS.2024.331234", indexada: true },
        { titulo: "Supply Chain Optimization Framework for Agricultural Commodities", revista: "Computers & Industrial Engineering (Q1)", año: 2024, doi: "10.1016/j.cie.2024.10982", indexada: true }
      ]
    },
    relacionesExternas: {
      conveniosNacionales: totalConveniosNac,
      conveniosInternacionales: totalConveniosInt,
      conveniosLista: [
        { institucion: "Universidad Nacional de Colombia", pais: "Colombia", tipo: "Investigación", estado: "Vigente" },
        { institucion: "Tecnológico de Monterrey", pais: "México", tipo: "Movilidad", estado: "Vigente" },
        { institucion: "UNICAMP", pais: "Brasil", tipo: "Movilidad", estado: "Vigente" }
      ],
      actividadesExtension: [
        { id: "EXT-01", nombre: "Bootcamp Talento Tech 2025", tipo: "Formación Continuada", participantes: 45, impacto: "Certificación de 45 jóvenes en desarrollo web", fecha: "Febrero 2025" },
        { id: "EXT-02", nombre: "Seminario Internacional de Ciberseguridad", tipo: "Simposio", participantes: 120, impacto: "Capacitación a profesionales regionales", fecha: "Noviembre 2024" },
        { id: "EXT-IND-01", nombre: "Diplomado Lean Six Sigma", tipo: "Educación Continua", participantes: 38, impacto: "Certificación industrial", fecha: "Enero 2025" }
      ]
    },
    egresados: {
      tasaVinculacionLaboral: "88.8%",
      tiempoPromedioEmpleoMeses: 3.1,
      salarioPromedioSMLV: 3.7,
      satisfaccionEmpleadores: "94.5%",
      sectoresDesempeno: [
        { sector: "Tecnología, Software & Redes", porcentaje: 40.0 },
        { sector: "Manufactura, Logística & Calidad", porcentaje: 30.0 },
        { sector: "Consultoría & Servicios Financieros", porcentaje: 18.0 },
        { sector: "Sector Público / Educación", porcentaje: 12.0 }
      ],
      ubicacionLaboral: [
        { region: "Regional", porcentaje: 41.0 },
        { region: "Nacional", porcentaje: 40.0 },
        { region: "Internacional", porcentaje: 19.0 }
      ]
    }
  };
}
