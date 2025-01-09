import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { AsistenciaGeneralService } from '../../service/asistenciageneral.service';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { Asistenciageneral } from '../../model/asistenciageneral';
import { timer } from 'rxjs';
import { CalendarModule } from 'primeng/calendar'; // Importa el módulo de PrimeNG

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

    fechainicio: string;
    fechafin: string;

    items: any[] = [];

    startDate: Date | null = null;
    endDate: Date | null = null;
    minStartDate: Date | null = null;
    maxEndDate: Date | null = null;

    constructor(
        private mrS: AsistenciaGeneralService,
        private confirmationsService: ConfirmationService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private bS: BreadcrumbService
    ) {
        this.fechainicio = this.getStartOfMonth();
        this.fechafin = this.getToday();
    }

    ngOnInit(): void {
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
        console.log(
            'Fecha inicio: ' +
                this.fechainicio +
                '- Fecha fin: ' +
                this.fechafin
        );
        this.loading = true;
        this.mrS
            .getAsistenciaByDateRange(this.fechainicio, this.fechafin)
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

    Buscar() {
        this.loading = true;

        //this.validateDates();

        if (this.startDate && this.endDate) {
            console.log(
                'Fecha inicio: ' +
                    this.startDate +
                    '- Fecha fin: ' +
                    this.endDate
            );
            this.fechainicio = this.formatDateAAAAMMDD(this.startDate);
            this.fechafin = this.formatDateAAAAMMDD(this.endDate);

            this.loadAsistenciagenerales();
        }
    }

    formatDateAAAAMMDD(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes en formato MM
        const day = date.getDate().toString().padStart(2, '0'); // Día en formato DD

        return `${year}${month}${day}`; // Devuelve el formato AAAAMMDD
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
