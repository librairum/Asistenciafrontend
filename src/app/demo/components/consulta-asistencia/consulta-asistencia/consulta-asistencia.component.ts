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
import { Asistencia } from '../../../model/Asistencia';
import { AsistenciaService } from '../../../service/asistencia.service';
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbService } from 'src/app/demo/service/breadcrumb.service';
import { Breadcrumb, BreadcrumbModule } from 'primeng/breadcrumb';
import { timer } from 'rxjs';

@Component({
  selector: 'app-consulta-asistencia',
  standalone: true,
  imports: [ButtonModule, TableModule, InputTextModule, DialogModule,ReactiveFormsModule, FormsModule,
    PanelModule, ConfirmDialogModule,CommonModule,ToastModule,DropdownModule,CalendarModule,RouterModule,BreadcrumbModule],
  templateUrl: './consulta-asistencia.component.html',
  styleUrl: './consulta-asistencia.component.scss',
  providers: [MessageService,ColumnFilter,Breadcrumb]
})
export class ConsultaAsistenciaComponent implements OnInit {
    asistencia:Asistencia[]=[];
    asistenciaoriginal:Asistencia[]=[];
    columnas:any[]=[];
    loading:boolean = true;
    itemCounter:number = 1;
    startDate:Date | null = null;
    endDate:Date | null = null;
    minStartDate:Date | null = null;
    maxEndDate:Date | null = null;

    showDetailsDialog : boolean = false; // Variable para controlar el modal
    selectedAsistencia: Asistencia | null = null; // Almacena el detalle de la fila seleccionada


    //filtros
    globalFilter:string='';
    columnsGlobalFilterFields = ['Apellidos_y_Nombres', 'Fecha']; // Campos para el filtro global
    // para el menu
    items: any[] = [];

    constructor(private aS:AsistenciaService,private route:Router, private bS:BreadcrumbService){}
    ngOnInit(): void{
        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home',routerLink: '/' },
            { label: 'Asistencia', routerLink: '/asistencia' }
        ]);
        this.bS.currentBreadcrumbs$.subscribe(bc=>{
            this.items=bc;
        })
        this.asistenciaoriginal=[...this.asistencia];
        this.minStartDate=new Date();
        this.maxEndDate=new Date();
        this.cargarAsistencia();
        // incializa registros


    }

    validateDates(){
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

    cargarAsistencia():void{
        this.loading=true;
        timer(1000).subscribe(()=>{
            this.loading=false;
        })
        this.aS.getAsistencias().subscribe(
            (data)=>{
                this.asistenciaoriginal=[...data]
                this.asistencia=data.map((asistencia,index)=>({
                    ...asistencia,
                }));
                this.loading=true;
            },
            error=>console.error('No se pudo cargar las asistencias',error)
        );
    }
    viewDetails(asistencia: Asistencia): void {
        // Aquí puedes implementar lógica para ver detalles de la asistencia
        //this.selectedAsistencia = asistencia;
        //this.showDetailsDialog =true;
        this.route.navigate(['asistencia/detalle-asistencia'],{
            state:{asistencia},
        })
    }

    getDayOfWeek(date: Date): string {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return days[new Date(date).getDay()];
    }

    Columnas():void{
        this.columnas=[
            { field: 'codigo', header: 'Item' },
            { field: 'Apellidos_y_Nombres', header: 'Trabajador' },
            { field: 'Fecha', header: 'Días' },
            { field: 'Hrs_25', header: 'Horas 25' },
            { field: 'Hrs_35', header: 'Horas 35' },
            { field: 'Hrs_60', header: 'Horas 60' },
            { field: 'Hrs_100', header: 'Horas 100' },
            { field: 'acciones', header: 'Acciones' }
        ];
    }

    clear(dt1): void {
        dt1.clear();
    }

    buscar(){
        this.loading=true;
        timer(2000).subscribe(()=>{
            this.loading=false;
        })
        this.validateDates();

        if (!this.startDate && !this.endDate) {
            this.asistencia=[...this.asistenciaoriginal]
            return; // No hacemos nada, los datos originales se muestran
        }

        this.asistencia = this.asistencia.filter(item => {
            const itemDate = new Date(item.Fecha);
            return itemDate >= this.startDate && itemDate <= this.endDate;
        });

    }

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
