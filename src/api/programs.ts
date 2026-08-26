export interface Program {
  id: number;
  name: string;
}

const MOCK_PROGRAMS: Program[] = [
  { id: 1, name: 'Ingeniería de Sistemas' },
  { id: 2, name: 'Ingeniería Agroindustrial' },
  { id: 3, name: 'Ingeniería Electrónica' },
  { id: 4, name: 'Ingeniería Ambiental' },
];

export function getPrograms(): Promise<Program[]> {
  return Promise.resolve(MOCK_PROGRAMS);
}
