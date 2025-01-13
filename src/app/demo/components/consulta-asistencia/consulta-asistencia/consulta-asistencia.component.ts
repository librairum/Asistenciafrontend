import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ColumnFilter, Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Asistencia, PLanilla_Combo } from '../../../model/Asistencia';
import { AsistenciaService } from '../../../service/asistencia.service';
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbService } from 'src/app/demo/service/breadcrumb.service';
import { Breadcrumb, BreadcrumbModule } from 'primeng/breadcrumb';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { timer } from 'rxjs';
import * as XLSX from 'xlsx';
registerLocaleData(localeEs);
@Component({
    selector: 'app-consulta-asistencia',
    standalone: true,
    imports: [ButtonModule, TableModule, InputTextModule, DialogModule, ReactiveFormsModule, FormsModule,
        PanelModule, ConfirmDialogModule, CommonModule, ToastModule, DropdownModule, CalendarModule, RouterModule, BreadcrumbModule, CommonModule, ToastModule],
    templateUrl: './consulta-asistencia.component.html',
    styleUrl: './consulta-asistencia.component.scss',
    providers: [MessageService, ColumnFilter, Breadcrumb, { provide: LOCALE_ID, useValue: 'es-ES' }]
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
    filters: any
    // para el menu
    items: any[] = [];

    // calendario
    espaniol:any[]

    //excel
    @ViewChild('dt1') dt1:Table|undefined;
    fechaexcelinicio: string;
    fechaexcelfin: string;
    planillaexcelselect:string;


    constructor(private aS: AsistenciaService, private router: Router, private bS: BreadcrumbService, private ms: MessageService, private primeng: PrimeNGConfig) {
        const navigation = router.getCurrentNavigation();
        if (navigation?.extras?.state) {
            const state = navigation.extras.state as any;
            this.startDate = new Date(state.startDate);
            this.endDate = new Date(state.endDate);
            this.selectedPlanilla = state.selectedPlanilla;
            this.cargarResumen();
        } else {
            this.endDate = new Date();
            this.startDate = new Date(this.endDate.getFullYear(), this.endDate.getMonth(), 1); // Primer día del mes
            this.selectedPlanilla = "1"
        }
    }
    ngOnInit(): void {
        this.primeng.setTranslation({
            firstDayOfWeek: 1,
            dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
            dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            today: 'Hoy',
            clear: 'Limpiar'
        })
        this.filters={
            nombretrabajador: {value:'',matchMode:'contains'}
        }
        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home', routerLink: '/Menu' },
            { label: 'Asistencia', routerLink: '/Menu/asistencia' }
        ]);
        this.bS.currentBreadcrumbs$.subscribe(bc => {
            this.items = bc;
        })
        this.loadPlanillas()
        this.cargarResumen()
    }

    cargarResumen() {
        if (!this.startDate || !this.endDate || !this.selectedPlanilla) {
            this.ms.add({ severity: 'error', summary: 'Error', detail: 'Complete los campos de busqueda' });
            return;
        }

        this.loading = true;

        const fechaInicio = this.aS.formatDateForApi(this.startDate);
        const fechaFin = this.aS.formatDateForApi(this.endDate);
        this.fechaexcelinicio=fechaInicio
        this.fechaexcelfin=fechaFin

        this.aS.getCalculoResumen(
            fechaInicio,
            fechaFin,
            this.selectedPlanilla
        ).subscribe({
            next: (response) => {
                if (response.isSuccess) {
                    this.asistencia = response.data;

                } else {
                    this.asistencia = [];
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
        const navigationExtras = {
            state: {
                codigoEmpleado: rowData.codigoTrabajador,
                fechaInicio: this.startDate,
                fechaFin: this.endDate,
                planillaSeleccionada: this.selectedPlanilla
            }
        }
        this.router.navigate(['Menu/asistencia/detalle-asistencia'], navigationExtras)
    }

    loadPlanillas() {
        this.aS.getPlanillaCombo().subscribe(
            (data: PLanilla_Combo[]) => {
                this.planilla = data;
                if (this.selectedPlanilla) {
                    const planillaEncontrada = this.planilla.find(p => p.codigoPlanilla === this.selectedPlanilla);
                    if (planillaEncontrada) {
                        this.planillaexcelselect = planillaEncontrada.nombrePlanilla;
                    }
                }
            }
        )
    }

    onPlanillaChange(event: any) {

        this.selectedPlanilla = event.value
        const planillaSeleccionada = this.planilla.find(p => p.codigoPlanilla === event.value);
        if (!this.selectedPlanilla) {
            this.planilla = [];
        }
        if (planillaSeleccionada) {
            this.planillaexcelselect = planillaSeleccionada.nombrePlanilla;
        }
    }

    generateEXCEL(){
        this.planillaexcelselect=this.planillaexcelselect.slice(0,12)
        const filteredData=this.dt1?.filteredValue;
        if(filteredData && filteredData.length>0){
            const filteredColumnsData=filteredData.map((item:any)=>({
                item:item.item,
                Trabajador:item.nombretrabajador,
                Dias:item.dias,
                horas25:item.horas25,
                horas60:item.horas60,
                horas100:item.horas100,
            }));

            const wb=XLSX.utils.book_new();

            const ws=XLSX.utils.json_to_sheet(filteredColumnsData);

            XLSX.utils.book_append_sheet(wb,ws,'Exportar');

            XLSX.writeFile(wb, 'Asistencia.xlsx');
        } else if(this.asistencia && this.asistencia.length > 0){
            const filteredColumnsData = this.asistencia.map(
                (item:any)=>({
                    item:item.item,
                Trabajador:item.nombretrabajador,
                Dias:item.dias,
                horas25:item.horas25,
                horas60:item.horas60,
                horas100:item.horas100,
                })
            );

            const wb = XLSX.utils.book_new();

                        // Convierte los datos filtrados (con las columnas seleccionadas) a una hoja de trabajo
                    const ws = XLSX.utils.json_to_sheet(filteredColumnsData);

                        // Añade la hoja de trabajo al libro de trabajo
                    XLSX.utils.book_append_sheet(wb, ws, this.fechaexcelinicio+'_'+this.fechaexcelfin+'_'+this.planillaexcelselect);

                        // Descarga el archivo Excel
                    XLSX.writeFile(wb, 'Asist_'+this.fechaexcelinicio+'_'+this.fechaexcelfin+'_'+this.planillaexcelselect+'.xlsx');
        } else {
            this.ms.add({ severity: 'error', summary: 'Error', detail: 'No se encontro ningun registro para el excel' });
        }

    }




}
