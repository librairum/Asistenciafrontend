import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ColumnFilter, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Asistencia, PLanilla_Combo } from '../../../model/Asistencia';
import { AsistenciaService } from '../../../service/asistencia.service';
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbService } from 'src/app/demo/service/breadcrumb.service';
import { Breadcrumb, BreadcrumbModule } from 'primeng/breadcrumb';
import { timer } from 'rxjs';

@Component({
    selector: 'app-consulta-asistencia',
    standalone: true,
    imports: [ButtonModule, TableModule, InputTextModule, DialogModule, ReactiveFormsModule, FormsModule,
        PanelModule, ConfirmDialogModule, CommonModule, ToastModule, DropdownModule, CalendarModule, RouterModule, BreadcrumbModule, CommonModule, ToastModule],
    templateUrl: './consulta-asistencia.component.html',
    styleUrl: './consulta-asistencia.component.scss',
    providers: [MessageService, ColumnFilter, Breadcrumb]
})
export class ConsultaAsistenciaComponent implements OnInit {
    // tabla
    asistencia: Asistencia[] = [];
    asistenciaoriginal: Asistencia[] = [];
    columnas = [
        { field: 'item', header: 'Item' },
        { field: 'nombretrabajador', header: 'Nombre del Trabajador' },
        { field: 'dias', header: 'Días' },
        { field: 'horas25', header: 'Horas 25%' },
        { field: 'horas60', header: 'Horas 60%' },
        { field: 'horas100', header: 'Horas 100%' },
        { field: 'acciones', header: 'Acciones' }
    ];
    columnsGlobalFilterFields = ['nombretrabajador'];
    loading: boolean = true;
    //fechas
    startDate: Date | null = null;
    endDate: Date | null = null;
    //planilla
    planilla: PLanilla_Combo[] = [];
    selectedPlanilla: string = "";

    showDetailsDialog: boolean = false; // Variable para controlar el modal
    selectedAsistencia: Asistencia | null = null; // Almacena el detalle de la fila seleccionada


    //filtros
    globalFilter: string = '';
    // para el menu
    items: any[] = [];

    constructor(private aS: AsistenciaService, private router: Router, private bS: BreadcrumbService, private ms: MessageService) { }
    ngOnInit(): void {
        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home', routerLink: '/Menu' },
            { label: 'Asistencia', routerLink: '/Menu/asistencia' }
        ]);
        this.bS.currentBreadcrumbs$.subscribe(bc => {
            this.items = bc;
        })
        this.loadPlanillas()
        this.endDate=new Date();
        this.startDate = new Date(this.endDate.getFullYear(), this.endDate.getMonth(), 1); // Primer día del mes
        this.selectedPlanilla="1"
    }

    cargarResumen() {
        if (!this.startDate || !this.endDate || !this.selectedPlanilla) {
            this.ms.add({ severity: 'error', summary: 'Error', detail: 'Complete los campos de busqueda' });
            return;
        }

        this.loading = true;

        const fechaInicio = this.aS.formatDateForApi(this.startDate);
        const fechaFin = this.aS.formatDateForApi(this.endDate);

        this.aS.getCalculoResumen(
            fechaInicio,
            fechaFin,
            this.selectedPlanilla
        ).subscribe({
            next: (response) => {
                if (response.isSuccess) {
                    this.asistencia = response.data;

                } else {
                    this.asistencia=[];
                    this.ms.add({ severity: 'error', summary: 'Error', detail: 'No se encontro ningun registro' });
                    console.error(response.message);
                }
                this.loading = false;
            },
            error: (error) => {
                console.error('Error:', error);
                this.ms.add({ severity: 'error', summary: 'Error', detail: 'No se encontro ningun registro' });
                this.loading = false;
            }
        });
    }

    viewDetails(rowData: Asistencia) {
        // Implementar lógica para ver detalles
        const navigationExtras={
            state: {
                codigoEmpleado: rowData.codigoTrabajador,
                fechaInicio: this.startDate,
                fechaFin: this.endDate
            }
        }
        console.log(navigationExtras.state)
        this.router.navigate(['Menu/asistencia/detalle-asistencia'], navigationExtras)
    }

    loadPlanillas() {
        this.aS.getPlanillaCombo().subscribe(
            (data: PLanilla_Combo[]) => {
                this.planilla = data;
            }
        )
    }

    onPlanillaChange(event: any) {
        this.selectedPlanilla = event.value
        if (!this.selectedPlanilla) {
            this.planilla = [];
        }
    }



    /*definirColumnas(): void {
        this.columnas = [
            { field: 'item', header: 'Item' },
            { field: 'nombretrabajador', header: 'Trabajador' },
            { field: 'dias', header: 'Días' },
            { field: 'horas25', header: 'Horas 25%' },
            { field: 'horas60', header: 'Horas 60%' },
            { field: 'horas100', header: 'Horas 100%' },
            { field: 'acciones', header: 'Acciones' }
        ];
    }

    cargarResumen(): void {
        if (!this.startDate || !this.endDate || !this.planillaSeleccionada) {
            this.ms.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Completa todos los campos de filtro' });
            return;
        }


        this.loading = true;
        const startDateString = this.formatDateToString(this.startDate);
        const endDateString = this.formatDateToString(this.endDate);
        this.aS
            .getCalculoResumen(startDateString, endDateString, this.planillaSeleccionada)
            .subscribe(
                (response) => {
                    this.asistenciaoriginal = response.data || [];
                    this.asistencia = [...this.asistenciaoriginal];
                    this.loading = false;
                },
                (error) => {
                    console.error('Error al cargar el resumen de asistencia', error);
                    this.loading = false;
                }
            );
    }

    private formatDateToString(date: Date | null): string | null {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
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


    viewDetails(asistencia: Asistencia): void {
        // Aquí puedes implementar lógica para ver detalles de la asistencia
        //this.selectedAsistencia = asistencia;
        //this.showDetailsDialog =true;
        this.route.navigate(['asistencia/detalle-asistencia'], {
            state: { asistencia },
        })
    }

    getDayOfWeek(date: Date): string {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return days[new Date(date).getDay()];
    }*/







    /*calculateTotal(field: keyof Asistencia): string {
        if (!this.selectedAsistencia) {
            return '0';
        }
        const value = this.selectedAsistencia[field];
        // Asegurarte de que el valor sea una cadena antes de proceder
        if (typeof value !== 'string') {
            return '0'; // O maneja esto como prefieras, por ejemplo, lanzar un error o ignorar
        }
        const totalInSeconds = this.convertToSeconds(value);
        return this.convertSecondsToHHMMSS(totalInSeconds);
    }*/

    /*convertToSeconds(timeString: string): number {
        const parts = timeString.split(':');
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parseInt(parts[2], 10);

        return hours * 3600 + minutes * 60 + seconds;
    }*/

    /*convertSecondsToHHMMSS(totalSeconds: number): string {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return [hours, minutes, seconds].map(part => String(part).padStart(2, '0')).join(':');
    }*/


}
