import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { timer } from 'rxjs';
import { Asistencia, AsistenciaDetalle } from 'src/app/demo/model/Asistencia';
import { AsistenciaService } from 'src/app/demo/service/asistencia.service';
import { BreadcrumbService } from 'src/app/demo/service/breadcrumb.service';

@Component({
    selector: 'app-detalle-consulta-asistencia',
    standalone: true,
    imports: [TableModule, CommonModule, PanelModule, RouterModule, BreadcrumbModule],
    templateUrl: './detalle-consulta-asistencia.component.html',
    styleUrl: './detalle-consulta-asistencia.component.scss'
})
export class DetalleConsultaAsistenciaComponent implements OnInit {
    breadcrumbs: any[] = [];
    asistencias: AsistenciaDetalle[] = [];
    navigationData: any;
    loading: boolean = false;

    constructor(
        private aS: AsistenciaService,
        private bS: BreadcrumbService,
        private rout: Router
    ) {
        const navigation = rout.getCurrentNavigation();
        if (navigation?.extras?.state) {
            this.navigationData = navigation.extras.state;
        } else {
            this.rout.navigate(['/Menu/asistencia']);
        }
    }
    ngOnInit(): void {
        this.loading = true;
        timer(2000).subscribe(() => {
            this.loading = false;
        })
        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home', routerLink: '/Menu' },
            { label: 'Asistencia', routerLink: '/Menu/asistencia', command:() => this.volverAListado()},
            { label: 'Detalle Asistencia', routerLink: '/Menu/asistencia/detalle-asistencia' }
        ]);
        this.bS.currentBreadcrumbs$.subscribe(bc => {
            this.breadcrumbs = bc;
        })

        this.cargarDetalleAsistencia()
    }

    cargarDetalleAsistencia() {
        const fechaInicio = this.aS.formatDateForApi(this.navigationData.fechaInicio);
        const fechaFin = this.aS.formatDateForApi(this.navigationData.fechaFin);

        this.aS.getCalculoDetalle(
            fechaInicio,
            fechaFin,
            this.navigationData.codigoEmpleado
        ).subscribe({
            next: (response) => {
                if (response.isSuccess) {
                    this.asistencias = response.data;
                }
            },
            error: (error) => console.error('Error:', error)
        });
    }

    getDayOfWeek(date: string): string {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const fecha = new Date(date);
        return dias[fecha.getDay()];
    }

    calculateTotal(field: string): string {
        // Función para sumar tiempos en formato HH:mm
        const sumTimes = (times: string[]): string => {
            let totalMinutes = times.reduce((acc, time) => {
                const [hours, minutes] = time.split(':').map(Number);
                return acc + (hours * 60 + minutes);
            }, 0);

            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        };

        const times = this.asistencias.map(a => a[field as keyof AsistenciaDetalle] as string);
        return sumTimes(times);
    }

    volverAListado() {
        const navigationExtras2={
            state:{
                startDate: this.navigationData.fechaInicio,
                endDate: this.navigationData.fechaFin,
                selectedPlanilla: this.navigationData.planillaSeleccionada
            }
        }
        console.log(navigationExtras2.state)
        this.rout.navigate(['/Menu/asistencia'], navigationExtras2)
    }
}
