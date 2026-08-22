import i18n from '@/i18n/es.json';

export interface ProgramInfo {
  name: string;
  sniesCode: string;
  accreditation: string;
  director: string;
  modality: string;
  durationSemesters: number;
}

export interface StudentMetrics {
  totalEnrolled: number;
  newStudents: number;
  approvalRate: string;
  reprobationRate: string;
  dropoutRate: string;
  averageGraduationSemesters: number;
  targetGraduationSemesters: number;
  historicEnrolment: { period: string; matriculados: number; nuevos: number }[];
  semesterBreakdown: { semestre: string; estudiantes: number; aprobacion: number; reprobacion: number; desercion: number }[];
}

export interface FacultyMetrics {
  total: number;
  fullTime: number;
  educationLevel: { nivel: string; cantidad: number; porcentaje: number }[];
  hiringDistribution: { tipo: string; cantidad: number }[];
  featuredFaculty: {
    id: string;
    nombre: string;
    formacion: string;
    areaConocimiento: string;
    articulosPublicados: number;
    vinculacion: string;
  }[];
}

export interface ResearchMetrics {
  scopusIndexed: number;
  recentPublications: number;
  innovations: number;
  patents: number;
  groups: {
    nombre: string;
    categoria: string;
    lider: string;
    lineasInvestigacion: string[];
    semillerosActivos: number;
  }[];
  historicPublications: { año: string; scopus: number; nacionales: number; libros: number }[];
  featuredPublications: { titulo: string; revista: string; año: string; doi: string }[];
}

export interface ExternalRelationsMetrics {
  nationalAgreements: number;
  internationalAgreements: number;
  extensionActivities: {
    id: string;
    nombre: string;
    tipo: string;
    participantes: number;
    fecha: string;
    impacto: string;
  }[];
  agreementsList: { institucion: string; pais: string; tipo: string; estado: string }[];
}

export interface GraduateMetrics {
  employmentRate: string;
  timeToEmploymentMonths: number;
  averageIncomeSMLV: number;
  employerSatisfaction: string;
  performanceSectors: { sector: string; porcentaje: number }[];
  locationDistribution: { region: string; porcentaje: number }[];
}

export interface DashboardData {
  programInfo: ProgramInfo;
  students: StudentMetrics;
  faculty: FacultyMetrics;
  research: ResearchMetrics;
  externalRelations: ExternalRelationsMetrics;
  graduates: GraduateMetrics;
}

export function getDashboardData(programName: string, period: string): DashboardData {
  const isSystems = programName === 'Ingeniería de Sistemas';

  return {
    programInfo: {
      name: programName,
      sniesCode: isSystems ? '12345' : '67890',
      accreditation: 'Alta Calidad (Res. MinEducación 01425)',
      director: isSystems ? 'Ing. Alvaro Oñate' : 'Ing. María Fernanda Gómez',
      modality: 'Presencial',
      durationSemesters: 10,
    },
    students: {
      totalEnrolled: isSystems ? 650 : 1240,
      newStudents: isSystems ? 85 : 190,
      approvalRate: '86.4%',
      reprobationRate: '9.2%',
      dropoutRate: '4.4%',
      averageGraduationSemesters: 10.8,
      targetGraduationSemesters: 10,
      historicEnrolment: [
        { period: '2023-1', matriculados: 580, nuevos: 75 },
        { period: '2023-2', matriculados: 610, nuevos: 80 },
        { period: '2024-1', matriculados: 630, nuevos: 82 },
        { period: '2024-2', matriculados: 645, nuevos: 84 },
        { period: '2025-1', matriculados: 650, nuevos: 85 },
      ],
      semesterBreakdown: [
        { semestre: 'Sem 1-2', estudiantes: 170, aprobacion: 78, reprobacion: 16, desercion: 6 },
        { semestre: 'Sem 3-4', estudiantes: 150, aprobacion: 84, reprobacion: 11, desercion: 5 },
        { semestre: 'Sem 5-6', estudiantes: 140, aprobacion: 89, reprobacion: 8, desercion: 3 },
        { semestre: 'Sem 7-8', estudiantes: 105, aprobacion: 93, reprobacion: 5, desercion: 2 },
        { semestre: 'Sem 9-10', estudiantes: 85, aprobacion: 97, reprobacion: 2, desercion: 1 },
      ],
    },
    faculty: {
      total: isSystems ? 32 : 78,
      fullTime: isSystems ? 20 : 48,
      educationLevel: [
        { nivel: 'Doctorado', cantidad: 8, porcentaje: 25 },
        { nivel: 'Maestría', cantidad: 18, porcentaje: 56 },
        { nivel: 'Especialización', cantidad: 4, porcentaje: 13 },
        { nivel: 'Pregrado', cantidad: 2, porcentaje: 6 },
      ],
      hiringDistribution: [
        { tipo: 'Tiempo Completo', cantidad: 20 },
        { tipo: 'Medio Tiempo', cantidad: 5 },
        { tipo: 'Cátedra', cantidad: 7 },
      ],
      featuredFaculty: [
        { id: '1', nombre: 'Dr. Carlos Alberto Mendoza', formacion: 'Ph.D. en Ciencias de la Computación', areaConocimiento: 'Inteligencia Artificial y ML', articulosPublicados: 14, vinculacion: 'Planta' },
        { id: '2', nombre: 'Dra. Elena Patricia Restrepo', formacion: 'Ph.D. en Ingeniería de Software', areaConocimiento: 'Arquitectura de Software y Cloud', articulosPublicados: 11, vinculacion: 'Planta' },
        { id: '3', nombre: 'MSc. Roberto José Silva', formacion: 'Magíster en Ciberseguridad', areaConocimiento: 'Seguridad Informática y Redes', articulosPublicados: 6, vinculacion: 'Ocasional' },
      ],
    },
    research: {
      scopusIndexed: isSystems ? 28 : 54,
      recentPublications: isSystems ? 12 : 26,
      innovations: 7,
      patents: 2,
      groups: [
        { nombre: 'GISICO', categoria: 'A', lider: 'Dr. Carlos Mendoza', lineasInvestigacion: ['IA Aplicada', 'Visión por Computador', 'Big Data'], semillerosActivos: 4 },
        { nombre: 'AITICE', categoria: 'B', lider: 'Dra. Elena Restrepo', lineasInvestigacion: ['Ingeniería de Software', 'IoT', 'Ciberseguridad'], semillerosActivos: 3 },
      ],
      historicPublications: [
        { año: '2021', scopus: 4, nacionales: 8, libros: 2 },
        { año: '2022', scopus: 6, nacionales: 9, libros: 1 },
        { año: '2023', scopus: 9, nacionales: 11, libros: 3 },
        { año: '2024', scopus: 12, nacionales: 14, libros: 2 },
      ],
      featuredPublications: [
        { titulo: 'Deep Learning Models for Agricultural Crop Classification in Caribbean Region', revista: 'Computers and Electronics in Agriculture (Elsevier Q1)', año: '2024', doi: '10.1016/j.compag.2024.108920' },
        { titulo: 'Microservices Architecture Performance in Distributed Educational Platforms', revista: 'IEEE Access (Q1)', año: '2023', doi: '10.1109/ACCESS.2023.3289100' },
      ],
    },
    externalRelations: {
      nationalAgreements: 14,
      internationalAgreements: 6,
      extensionActivities: [
        { id: '1', nombre: 'Capacitación en Alfabetización Digital a Comunidades Rurales del Cesar', tipo: 'Proyección Social', participantes: 240, fecha: '2024-2', impacto: 'Alto Impacto Regional' },
        { id: '2', nombre: 'Desarrollo de Software de Gestión para Mypimes de Valledupar', tipo: 'Extensión Tecnológica', participantes: 35, fecha: '2024-1', impacto: 'Fortalecimiento Empresarial' },
      ],
      agreementsList: [
        { institucion: 'Universidad Politécnica de Valencia', pais: 'España', tipo: 'Movilidad e Investigación', estado: 'Vigente' },
        { institucion: 'Ecopetrol S.A.', pais: 'Colombia', tipo: 'Prácticas Empresariales', estado: 'Vigente' },
        { institucion: 'Tecnológico de Monterrey', pais: 'México', tipo: 'Intercambio Académico', estado: 'Vigente' },
      ],
    },
    graduates: {
      employmentRate: '88.5%',
      timeToEmploymentMonths: 4.2,
      averageIncomeSMLV: 3.4,
      employerSatisfaction: '94.2%',
      performanceSectors: [
        { sector: 'Tecnología & Software', porcentaje: 45 },
        { sector: 'Sector Financiero & Banca', porcentaje: 22 },
        { sector: 'Telecomunicaciones', porcentaje: 15 },
        { sector: 'Gobierno & Sector Público', porcentaje: 10 },
        { sector: 'Consultoría Independiente', porcentaje: 8 },
      ],
      locationDistribution: [
        { region: 'Local (Valledupar / Cesar)', porcentaje: 40 },
        { region: 'Nacional (Bogotá, Mde, Bq)', porcentaje: 42 },
        { region: 'Internacional / Remoto USA-EUR', porcentaje: 18 },
      ],
    },
  };
}
