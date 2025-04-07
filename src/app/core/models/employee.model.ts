
export interface Employee {
    id: number;
    name: string;
    role: string;
    hireDate: Date | null;
    endDate: Date | null;
}


export const ROLES: string[] = [
    'Product Designer',
    'Angular Developer',
    'QA Tester',
    'Product Owner'
  ];