import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { HorariopersonalService } from '../../service/horariopersonal.service';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { horario_personal } from '../../model/horario_personal';
import { DialogModule } from 'primeng/dialog';
import { MotivoHorarioService } from '../../service/motivo-horario.service';
import { motivo_horario } from '../../model/motivo_horario';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { min } from 'rxjs';
import { AsistenciaService } from '../../service/asistencia.service';
import { PLanilla_Combo } from '../../model/Asistencia';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
    selector: 'app-horariopersonal',
    imports: [
        ToastModule,
        TableModule,
        ReactiveFormsModule,
        CommonModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        PanelModule,
        BreadcrumbModule,
        ConfirmDialogModule,
        FormsModule,
        CheckboxModule,
        DialogModule,
        DropdownModule,
        CalendarModule,
        MultiSelectModule,
    ],
    standalone: true,
    templateUrl: './horariopersonal.component.html',
    styleUrl: './horariopersonal.component.scss',
    providers: [MessageService, ConfirmationService],
})
export class HorariopersonalComponent {
    horarioPersonalForm: FormGroup;
    horarioPersonalLista: horario_personal[] = [];
    items: any[] = [];
    displayModal: boolean = false;
    horarioEmpleado: any[] = [];
    motivos: motivo_horario[] = [];
    nombreCargoSeleccionado: string[] = [];
    nombreCargos: { label: string; value: string }[] = [];
    nombreMotivos: { label: string; value: string }[] = [];
    nombreMotivos1 = [
        {label: 'DINAMICO', value: 'DINAMICO'}
    ]

    cargos = [
        { label: 'Contabilidad', value: 'Contabilidad' },
        { label: 'Sistemas', value: 'Sistemas' },
        { label: 'RRHH', value: 'RRHH' },
    ];

    data = [
        { nombreCargo: 'PERMANENTES' },
        { nombreCargo: 'SPORT' },
        { nombreCargo: 'PLAZO FIJO' },
        { nombreCargo: 'OBRERO' },
    ];

    diasSemana = [
        { nombre: 'Lunes', codigo: '01' },
        { nombre: 'Martes', codigo: '02' },
        { nombre: 'Miércoles', codigo: '03' },
        { nombre: 'Jueves', codigo: '04' },
        { nombre: 'Viernes', codigo: '05' },
        { nombre: 'Sábado', codigo: '06' },
        { nombre: 'Domingo', codigo: '07' },
    ];

    tiposDocumentosIdentidad = [
        { label: 'C.E', value: 'C.E' },
        { label: 'DNI', value: 'DNI' },
    ];

    constructor(
        private fb: FormBuilder,
        private horarioPersonalService: HorariopersonalService,
        private mS: MessageService,
        private confirmationService: ConfirmationService,
        private bS: BreadcrumbService,
        private motivoHorarioService: MotivoHorarioService,
        private asistenciaService: AsistenciaService
    ) {}

    ngOnInit(): void {
        this.cargarCargos();
        this.cargarMotivos();
        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home', routerLink: '/Menu' },
            {
                label: 'Asignación de horarios a personal',
                routerLink: '/Menu/motivohorario',
            },
        ]);
        this.bS.currentBreadcrumbs$.subscribe((bc) => {
            this.items = bc;
        });
        // this.initForm();
        this.loadHorarioPersonal();
        console.log('h', this.nombreCargos);
        console.table(this.horarioPersonalLista);
    }

    loadHorarioPersonal(): void {
        this.horarioPersonalService.getAll('01').subscribe({
            next: (data) => {
                console.log('Respuesta del API:', data);
                this.horarioPersonalLista = Array.isArray(data) ? data : [];
            },
            error: (err) => {
                console.error('Error al cargar horarios:', err);
                this.horarioPersonalLista = [];
            },
        });
    }

    esMotivoInactivo(idMotivo: string): boolean {
        return idMotivo === '02' || idMotivo === '04';
    }

    actualizarHorasSiMotivoInactivo(registro: any): void {
        if (this.esMotivoInactivo(registro.idMotivo)) {
            registro.horaingreso = '00:00';
            registro.horasalida = '00:00';
        }
    }

    formatearHora(hora: string): string {
        const [h, m] = hora.split(':');
        const hh = h.padStart(2, '0');
        const mm = m.padStart(2, '0');
        return `${hh}:${mm}`;
    }

    normalizarHoras(): void {
        this.horarioEmpleado.forEach((item) => {
            item.horaingreso = this.formatearHora(item.horaingreso);
            item.horasalida = this.formatearHora(item.horasalida);
        });
    }

    abrirModalConDatos(idEmpleado: number): void {
        this.displayModal = true;

        this.horarioPersonalService
            .getHorarioPorEmpleado(idEmpleado)
            .subscribe({
                next: (data) => {
                    this.horarioEmpleado = data;
                    this.normalizarHoras();
                },
                error: (err) => console.error('Error cargando horarios: ', err),
            });

        this.motivoHorarioService.getAll('01').subscribe({
            next: (data) => {
                this.motivos = data;
                console.log(this.motivos);
            },
            error: (err) => console.error('Error cargando motivos: ', err),
        });
    }

    getDatosDia(codigoDia: string): any {
        return this.horarioEmpleado.find((d) => d.dia === codigoDia) ?? {};
    }

    cerrarDialogo(): void {
        this.displayModal = false;
    }

    formatHora(date: any): string {
        if (typeof date === 'string') return date;
        if (date instanceof Date) {
            const horas = date.getHours().toString().padStart(2, '0');
            const minutos = date.getMinutes().toString().padStart(2, '0');
            return `${horas}:${minutos}`;
        }
        return '00:00';
    }

    convertirHoraAFecha(hora: string | Date): Date | null {
        if (hora instanceof Date) {
            return hora;
        }

        if (typeof hora === 'string' && hora.includes(':')) {
            const [hh, mm] = hora.split(':').map(Number);
            if (!isNaN(hh) && !isNaN(mm)) {
                const fecha = new Date();
                fecha.setHours(hh, mm, 0, 0);
                return fecha;
            }
        }

        return null;
    }

    guardarHorario(): void {
        const motivoPorAsignar = this.motivos.find(
            (m) => m.descripcion.toUpperCase() === 'POR ASIGNAR'
        );
        const motivoPorAsignarId = motivoPorAsignar?.idMotivo;

        const tienePorAsignar = this.horarioEmpleado.some(
            (d) => d.idMotivo === motivoPorAsignarId
        );

        if (tienePorAsignar) {
            this.mS.add({
                severity: 'warn',
                summary: 'Motivo inválido',
                detail: 'No se puede guardar un horario con motivo "POR ASIGNAR".',
            });
            return;
        }

        const tieneErrorHorario = this.horarioEmpleado.some((item) => {
            if (this.esMotivoInactivo(item.idMotivo)) return false;

            const ingreso = this.convertirHoraAFecha(item.horaingreso);
            const salida = this.convertirHoraAFecha(item.horasalida);

            if (!ingreso || !salida) return true;

            return ingreso >= salida;
        });

        if (tieneErrorHorario) {
            this.mS.add({
                severity: 'warn',
                summary: 'Validación',
                detail: 'La hora de ingreso debe ser menor que la hora de salida',
            });
            return;
        }

        const xml = `<DataSet>${this.horarioEmpleado
            .map(
                (d) => `
            <tbl>
              <EmpresaCod>${d.empresaCod}</EmpresaCod>
              <IdEmpleado>${d.idEmpleado}</IdEmpleado>
              <dia>${d.dia}</dia>
              <IdMotivo>${d.idMotivo}</IdMotivo>
              <horaingreso>${this.formatHora(d.horaingreso)}</horaingreso>
              <horasalida>${this.formatHora(d.horasalida)}</horasalida>
            </tbl>`
            )
            .join('')}
          </DataSet>`;

        this.horarioPersonalService.actualizarHorariosMasivo(xml).subscribe({
            next: () => {
                console.log(xml);
                this.mS.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Horarios actualizados correctamente',
                });
                this.displayModal = false;
                this.loadHorarioPersonal();
            },
            error: (err) => {
                this.mS.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo actualizar el horario',
                });
                console.error('Error al actualizar horarios:', err);
            },
        });
    }

    cargarCargos() {
        this.asistenciaService
            .getPlanillaCombo()
            .subscribe((cargos: PLanilla_Combo[]) => {
                this.nombreCargos = cargos.map((cargo) => ({
                    label: cargo.nombrePlanilla,
                    value: cargo.nombrePlanilla,
                }));
                console.log('lista cargos \n', this.nombreCargos);
            });
    }

    cargarMotivos() {
        this.motivoHorarioService.getAll('01').subscribe({
            next: (data) => {
                this.nombreMotivos = data.map((motivo) => ({
                    value: motivo.descripcion,
                    label: motivo.descripcion,
                }));
                console.log('lista motivos \n', this.nombreMotivos);
            },
            error: (err) => console.error('Error cargando motivos: ', err),
        });
    }

    dinamicoFilterFn = (value: any, filters: any[]): boolean => {
        console.log(
            'Entró a dinamicoFilterFn, value:',
            value,
            'filters:',
            filters
        );

        if (!filters || filters.length === 0) {
            return true;
        }

        const esDinamico =
            typeof value === 'string' &&
            /^\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}$/.test(value.trim());

        for (const filtro of filters) {
            if (filtro === 'DINAMICO' && esDinamico) {
                return true;
            } else if (value === filtro) {
                return true;
            }
        }

        return false;
    };

    logYFiltrar(selectedValues: any[], filterCallback: Function) {
        console.log('Valores seleccionados:', selectedValues);
        filterCallback(selectedValues);
    }
}

