export interface Asistencia{
    codigo: string;
    Apellidos_y_Nombres: string;
    Fecha: Date;
    Hrs_25: string; // Formato 'HH:mm:ss'
    Hrs_35: string; // Formato 'HH:mm:ss'
    Hrs_60: string; // Formato 'HH:mm:ss'
    Hrs_100: string; // Formato 'HH:mm:ss'
    Marcacion_Entrada: string; // Formato 'HH:mm:ss'
    Marcacion_Salida: string;  // Formato 'HH:mm:ss'
}
