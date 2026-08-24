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
