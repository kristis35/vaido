
export interface University {
    id: number;
    pavadinimas: string;
}

export interface Faculty {
    id: number;
    pavadinimas: string;
}

export interface User {
    name: string;
    surname: string;
    email: string;
    telephone: string;
    university: string;
    faculty: string;
    entryYear: string;
    graduationYear: string;
    numberOfPeople: string;
    role: 'seniunas' | 'studentas' | 'fotolaboratorija' | 'maketuotojas' | 'fotografas' | 'administratoriust' | 'super administratorius';
}
