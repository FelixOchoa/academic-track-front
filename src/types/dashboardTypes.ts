export interface ProgramInfo {
  name: string;
  sniesCode: string;
  accreditation: string;
  director: string;
  modality: string;
  durationSemesters: number;
}

export interface HistoricEnrolment {
  period: string;
  inscritos?: number;
  admitidos?: number;
  matriculados: number;
  nuevos: number;
  graduados?: number;
  retirados?: number;
  tasaDesercion?: number;
}

export interface SemesterBreakdown {
  semestre: string;
  estudiantes: number;
  aprobacion: number;
  reprobacion: number;
  desercion: number;
}

export interface StudentMetrics {
  totalEnrolled: number;
  newStudents: number;
  approvalRate: string;
  reprobationRate: string;
  dropoutRate: string;
  averageGraduationSemesters: number;
  targetGraduationSemesters: number;
  historicEnrolment: HistoricEnrolment[];
  semesterBreakdown: SemesterBreakdown[];
}

export interface EducationLevel {
  nivel: string;
  cantidad: number;
  porcentaje: number;
}

export interface HiringDistribution {
  tipo: string;
  cantidad: number;
}

export interface FeaturedFaculty {
  id: string;
  nombre: string;
  formacion: string;
  areaConocimiento: string;
  articulosPublicados: number;
  vinculacion: string;
}

export interface FacultyMetrics {
  total: number;
  fullTime: number;
  educationLevel: EducationLevel[];
  hiringDistribution: HiringDistribution[];
  featuredFaculty: FeaturedFaculty[];
}

export interface ResearchGroup {
  nombre: string;
  categoria: string;
  lider: string;
  lineasInvestigacion: string[];
  semillerosActivos: number;
}

export interface HistoricPublication {
  año: string;
  scopus: number;
  nacionales: number;
  libros: number;
}

export interface FeaturedPublication {
  titulo: string;
  revista: string;
  año: string;
  doi: string;
}

export interface ResearchMetrics {
  scopusIndexed: number;
  recentPublications: number;
  innovations: number;
  patents: number;
  groups: ResearchGroup[];
  historicPublications: HistoricPublication[];
  featuredPublications: FeaturedPublication[];
}

export interface ExtensionActivity {
  id: string;
  nombre: string;
  tipo: string;
  participantes: number;
  fecha: string;
  impacto: string;
}

export interface Agreement {
  institucion: string;
  pais: string;
  tipo: string;
  estado: string;
}

export interface ExternalRelationsMetrics {
  nationalAgreements: number;
  internationalAgreements: number;
  extensionActivities: ExtensionActivity[];
  agreementsList: Agreement[];
}

export interface PerformanceSector {
  sector: string;
  porcentaje: number;
}

export interface LocationDistribution {
  region: string;
  porcentaje: number;
}

export interface GraduateMetrics {
  employmentRate: string;
  timeToEmploymentMonths: number;
  averageIncomeSMLV: number;
  employerSatisfaction: string;
  performanceSectors: PerformanceSector[];
  locationDistribution: LocationDistribution[];
}

export interface DashboardData {
  programInfo: ProgramInfo;
  students: StudentMetrics;
  faculty: FacultyMetrics;
  research: ResearchMetrics;
  externalRelations: ExternalRelationsMetrics;
  graduates: GraduateMetrics;
}
