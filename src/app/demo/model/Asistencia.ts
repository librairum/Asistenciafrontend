export interface Asistencia {
    item: number;
    codigoTrabajador: string;
    nombretrabajador: string;
    fechaInicio: string;
    fechaFin: string;
    codigoPlanilla: string;
    nombrePlanilla: string;
    dias: number;
    horas25: string;
    horas60: string;
    horas100: string;
}

export interface PLanilla_Combo {
    codigoPlanilla: string;
    nombrePlanilla: string;
}

export interface AsistenciaDetalle {
    item: number;
    fechaMarcacion: string;
    codigotrabajador: string;
    nombreTrabajador: string;
    diaNombre: string;
    horaEntrada: string;
    horaSalida: string;
    dias: number;
    horas25: string;
    horas35: string;
    horas60: string;
    horas100: string;
}
