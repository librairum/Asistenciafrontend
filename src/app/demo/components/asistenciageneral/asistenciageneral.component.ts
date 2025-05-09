import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { AsistenciaGeneralService } from '../../service/asistenciageneral.service';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { Asistenciageneral } from '../../model/asistenciageneral';
import { timer } from 'rxjs';
import { CalendarModule } from 'primeng/calendar'; // Importa el módulo de PrimeNG

import * as XLSX from 'xlsx';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-asistenciageneral',
    standalone: true,
    imports: [
        PanelModule,
        TableModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        CommonModule,
        ButtonModule,
        ToastModule,
        BreadcrumbModule,
        ConfirmDialogModule,
        CalendarModule,
    ],
    templateUrl: './asistenciageneral.component.html',
    styleUrl: './asistenciageneral.component.scss',
    providers: [MessageService, ConfirmationService],
})
export class AsistenciageneralComponent implements OnInit {
    Asistenciagenerales: Asistenciageneral[] = [];
    origAsistenciagenerales: Asistenciageneral[] = [];
    originalAsistenciagenerales: { [s: string]: Asistenciageneral } = {};
    loading: boolean = false;
    searchForm: FormGroup;
    editing: boolean = false;
    mostrarBoton = false;  // Cuando es false, el botón no será visible
    stardate: string;
    enddate: string;

    items: any[] = [];

    startDate: Date | null = null;
    endDate: Date | null = null;
    minStartDate: Date | null = null;
    maxEndDate: Date | null = null;
    filters: any;

    @ViewChild('dt1') dt1: Table | undefined; // Referencia a p-table

    constructor(
        private mrS: AsistenciaGeneralService,
        private confirmationsService: ConfirmationService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private bS: BreadcrumbService,
        private config: PrimeNGConfig
    ) {
        this.stardate = this.getStartOfMonth();
        this.enddate = this.getToday();
        this.startDate = new Date();
        this.startDate.setDate(1);
        this.endDate = new Date();
    }

    ngOnInit(): void {
        this.config.setTranslation({
            firstDayOfWeek: 1,
            dayNames: [
                'Domingo',
                'Lunes',
                'Martes',
                'Miércoles',
                'Jueves',
                'Viernes',
                'Sábado',
            ],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            monthNames: [
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre',
            ],
            monthNamesShort: [
                'Ene',
                'Feb',
                'Mar',
                'Abr',
                'May',
                'Jun',
                'Jul',
                'Ago',
                'Sep',
                'Oct',
                'Nov',
                'Dic',
            ],
            today: 'Hoy',
            clear: 'Limpiar',
        });
        this.filters = {
            codigoEmpleado: { value: '', matchMode: 'contains' },
            nombreEmpleado: { value: '', matchMode: 'contains' },
            nombreMarcador: { value: '', matchMode: 'contains' },
            // Otros filtros
        };

        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home', routerLink: '/Menu' },
            {
                label: 'Asistencia general',
                routerLink: '/Menu/asistenciageneral',
            },
        ]);
        this.bS.currentBreadcrumbs$.subscribe((bc) => {
            this.items = bc;
        });

        this.loadAsistenciagenerales();
    }

    loadAsistenciagenerales(): void {
        this.loading = true;
        this.mrS
            .getAsistenciaByDateRange(this.stardate, this.enddate)
            .subscribe({
                next: (data) => {
                    //console.log('Datos obtenidos:', data); // Console log para verificar la data
                    this.Asistenciagenerales = data;
                    this.Asistenciagenerales.forEach(
                        (Asistenciageneral, index) => {
                            Asistenciageneral['id'] = index + 1; // Agregar la propiedad 'id' incrementalmente
                        }
                    );
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudieron cargar los datos',
                    });
                },
                complete: () => {
                    this.loading = false;
                },
            });
    }

    generateEXCEL() {
        const filteredData = this.dt1?.filteredValue;

        if (filteredData && filteredData.length > 0) {
            // Selecciona solo las columnas necesarias
            const filteredColumnsData = filteredData.map((item: any) => ({
                fecha: item.fechaFormateada,
                hora: item.tiempoFormateado,
                codigoEmpleado: item.codigoEmpleado,
                nombreEmpleado: item.nombreEmpleado,
                nombreMarcador: item.nombreMarcador,
            }));

            const wb = XLSX.utils.book_new();

            // Convierte los datos filtrados (con las columnas seleccionadas) a una hoja de trabajo
            const ws = XLSX.utils.json_to_sheet(filteredColumnsData);

            // Añade la hoja de trabajo al libro de trabajo
            XLSX.utils.book_append_sheet(wb, ws, 'Exportar');

            // Descarga el archivo Excel
            XLSX.writeFile(wb, 'Exportar.xlsx');
        } else if (
            this.Asistenciagenerales &&
            this.Asistenciagenerales.length > 0
        ) {
            // Filtra las columnas deseadas
            const filteredColumnsData = this.Asistenciagenerales.map(
                (item: any) => ({
                    fecha: item.fechaFormateada,
                    hora: item.tiempoFormateado,
                    codigoEmpleado: item.codigoEmpleado,
                    nombreEmpleado: item.nombreEmpleado,
                    nombreMarcador: item.nombreMarcador,
                })
            );

            const wb = XLSX.utils.book_new();

            // Convierte los datos filtrados (con las columnas seleccionadas) a una hoja de trabajo
            const ws = XLSX.utils.json_to_sheet(filteredColumnsData);

            // Añade la hoja de trabajo al libro de trabajo
            XLSX.utils.book_append_sheet(wb, ws, 'Exportar');

            // Descarga el archivo Excel
            XLSX.writeFile(wb, 'Exportar.xlsx');
        } else {
            console.error('No hay datos para generar el archivo Excel');
        }
    }


    Buscar() {
        this.loading = true;

        //this.validateDates();

        if (this.startDate && this.endDate) {
            this.stardate = this.formatDateAAAAMMDD(this.startDate);
            this.enddate = this.formatDateAAAAMMDD(this.endDate);

            this.loadAsistenciagenerales();
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Completar los campos de la fecha',
            });

            this.loading = false;
        }
    }

    formatDateAAAAMMDD(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes en formato MM
        const day = date.getDate().toString().padStart(2, '0'); // Día en formato DD

        return `${year}${month}${day}`; //formato AAAAMMDD
    }

    validateDates() {
        if (this.startDate && this.endDate) {
            if (this.startDate > this.endDate) {
                // La fecha de inicio no puede ser posterior a la fecha de fin
                this.endDate = null; // Limpiamos la fecha de fin si ocurre este caso
            }
            if (this.endDate > this.maxEndDate) {
                // La fecha de fin no puede ser posterior a la fecha máxima permitida
                this.endDate = this.maxEndDate;
            }
        }
    }

    getStartOfMonth(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Mes en formato MM
        return `${year}${month}01`; // Primer día del mes
    }

    getToday(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Mes en formato MM
        const day = now.getDate().toString().padStart(2, '0'); // Día en formato DD
        return `${year}${month}${day}`;
    }
}
/*pendiente

componente asistenciageneral--
desde dia 1 hasta la fecha actual del mes--

boton con texto "buscar"---

filtro por rango de fechas----


filtro columna: nrodoc, nombre y apellidos, nombre equipo

exportar
*/
