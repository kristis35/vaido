
export interface Faculty {
    id: number;
    pavadinimas: string;
    universitetasId: number;
}

export interface User {
    name: string;
    surname: string;
    email: string;
    telephone: string;
    fakultetasid: number;
    universitetasid: number;
    role: 'seniunas' | 'studentas' | 'fotolaboratorija' | 'maketuotojas' | 'fotografas' | 'administratoriust' | 'super administratorius';
}

export interface Useris {
    id: number;
    prisijungimoVardas: string;
    vardas: string;
    pavarde: string;
    telefonas: string;
    fakultetasId: number;
    universitetasId: number;
    vartotojoRole: string;
}
export interface University {
    id: number;
    pavadinimas: string;
    trumpasPavadinimas: string;
}

export interface Group {
    id: number;
    pavadinimas: string;
    ilgasPavadinimas: string;
    universitetasId: number;
    fakultetasId: number;
    įstojimoMetai: number;
    baigimoMetai: number;
    studentuSkaicius: number;
    sumoketasAvansas: number;
    apmokejimoStadija: string;
    gamybosStadija: string;
    pasleptiGrupe: boolean;
    pastabos: string;
    patvirtintasSarasas: boolean;
    balsavimasMaketai: boolean;
    grupesSeniunas: number;
    fotografavimoDataVieta: string;
}

