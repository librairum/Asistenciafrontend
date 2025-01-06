import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { timer } from 'rxjs';
import { Asistencia } from 'src/app/demo/model/Asistencia';
import { AsistenciaService } from 'src/app/demo/service/asistencia.service';
import { BreadcrumbService } from 'src/app/demo/service/breadcrumb.service';

@Component({
  selector: 'app-detalle-consulta-asistencia',
  standalone: true,
  imports: [TableModule,CommonModule,PanelModule,RouterModule,BreadcrumbModule],
  templateUrl: './detalle-consulta-asistencia.component.html',
  styleUrl: './detalle-consulta-asistencia.component.scss'
})
export class DetalleConsultaAsistenciaComponent implements OnInit {
    breadcrumbs: any[] = [];


    asistencia:Asistencia|null = null;
    loading:boolean = false;
    constructor(
        private activa:ActivatedRoute,
        private aS:AsistenciaService,
        private bS:BreadcrumbService
    ){

    }
    ngOnInit(): void{
        this.loading=true;
                timer(2000).subscribe(()=>{
                    this.loading=false;
        })
        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home',routerLink: '/' },
            { label: 'Asistencia', routerLink: '/asistencia' },
            { label: 'Detalle Asistencia', routerLink: '/asistencia/detalle-asistencia' }
        ]);
        this.bS.currentBreadcrumbs$.subscribe(bc=>{
            this.breadcrumbs=bc;
        })
        const state=history.state as {asistencia:Asistencia};
        if(state.asistencia){
            this.asistencia=state.asistencia;

        }
    }

    calculateTotal(field: keyof Asistencia): string {
        if (!this.asistencia) {
          return '0';
        }
        const value = this.asistencia[field];
        if (typeof value !== 'string') {
          return '0';
        }
        const totalInSeconds = this.convertToSeconds(value);
        return this.convertSecondsToHHMMSS(totalInSeconds);
    }

      convertToSeconds(timeString: string): number {
        const parts = timeString.split(':');
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parseInt(parts[2], 10);
        return hours * 3600 + minutes * 60 + seconds;
    }

      convertSecondsToHHMMSS(totalSeconds: number): string {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return [hours, minutes, seconds].map(part => String(part).padStart(2, '0')).join(':');
    }

      getDayOfWeek(date: Date): string {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return days[new Date(date).getDay()];
    }


}
