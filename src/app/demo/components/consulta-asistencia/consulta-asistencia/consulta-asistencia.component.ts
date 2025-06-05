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
import * as XLSX from 'xlsx';
import {jsPDF} from 'jspdf';
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
        {field:'codigoTrabajador' , header:'Codigo Trabajador'},
        { field: 'nombretrabajador', header: 'Nombre del Trabajador' },
        { field: 'dias', header: 'Dias' },
        { field: 'diasFalta', header: 'Dias\nFalta' },
        {field:'diasDescanso', header:'Dias\nDescanso'},
        {field:'horasTrabajadas', header:'Horas\nTrabajadas'},
        {field:'horasHorario', header:'Horas\nHorario'},
        {field:'horasExtrasTotales', header:'Horas\nExtTotal'},

        // { field: 'nHraDomPag', header: 'H.Dom.\nPag' },
        // { field: 'nHraFerTra', header: 'H.Fer:\nTra' },
        // { field: 'hturnoManu', header: 'H.Tur.\nMan' },
        // {field:'minTardanza' , header:'Min.\nTarde'},
        {field:'nHorExtr25' , header:'H.Ext.\n25%'},
        {field:'nHorExtr35' , header:'H.Ext.\n35%'},
        {field:'nHorExtr50' , header:'H.Ext.\n50%'},
        {field:'nHorExtr60', header:'H.Ext.\n60%'},
        {field:'nHorExtr100', header:'H.Ext.\n100%'},
        {field:'nHorExtr100Obrero', header:'H.Ext.\n100% Obrero'},
        // {field:'nHorExtrDo', header:'H.Ext.\nDoble'},
        { field: 'acciones', header: 'Acciones' }
    ];
    columnsGlobalFilterFields = ['nombretrabajador'];
    loading: boolean = true;
    //fechas
    startDate: Date | null = null;
    endDate: Date | null = null;
    //planilla
    planilla: PLanilla_Combo[] = [];
    selectedPlanilla: string = "";
    fechahoy: string | null = null;
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
        });
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        this.fechahoy = `${year}${month}${day}`;
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
                    console.log(response.data);
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
        //console.log("ver detalle fechas:");
        //console.log(this.startDate);
        //console.log(this.endDate);
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
                codTrabajador:item.codigoTrabajador,
                Trabajador:item.nombretrabajador,
                Dias:item.dias,
                DiasFalta:item.diasFalta,
                DiasDescanso:item.diasDescanso,
                HorasTrabajadas:item.horasTrabajadas,
                HorasHorario:item.horasHorario,
                HorasExtrasTotales:item.horasExtrasTotales,
                // HoraDomPag:item.nHraDomPag,
                // HoraFerTra:item.nHraFerTra,
                // HoraTurnoManu:item.hturnoManu,
                // MinTardanza:item.minTardanza,
                HExtr25:item.nHorExtr25,
                HExtr35:item.nHorExtr35,
                HExtr50:item.nHorExtr50,
                HExtr60: item.nHorExtr60,
                HExtr100:item.nHorExtr100,
                HExtr100Obrero:item.nHorExtr100Obrero
                // ,hExtrDo:item.nHorExtrDo
            }));

            const wb=XLSX.utils.book_new();

            const ws=XLSX.utils.json_to_sheet(filteredColumnsData);

            XLSX.utils.book_append_sheet(wb,ws,'Exportar');

            XLSX.writeFile(wb, 'Asistencia.xlsx');
        } else if(this.asistencia && this.asistencia.length > 0){
            const filteredColumnsData = this.asistencia.map(
                (item:any)=>({
                    item:item.item,
                codTrabajador:item.codigoTrabajador,
                Trabajador:item.nombretrabajador,
                Dias:item.dias,
                DiasFalta:item.diasFalta,
                DiasDescanso:item.diasDescanso,
                HorasTrabajadas:item.horasTrabajadas,
                HorasHorario:item.horasHorario,
                HorasExtrasTotales:item.horasExtrasTotales,
                // HoraDomPag:item.nHraDomPag,
                // HoraFerTra:item.nHraFerTra,
                // HoraTurnoManu:item.hturnoManu,
                // MinTardanza:item.minTardanza,
                HExtr25:item.nHorExtr25,
                HExtr35:item.nHorExtr35,
                HExtr50:item.nHorExtr50,
                HExtr60: item.nHorExtr60,
                HExtr100:item.nHorExtr100,
                HExtr100Obrero:item.nHorExtr100Obrero
                // ,hExtrDo:item.nHorExtrDo
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


    async generateTXT() {
        if (this.asistencia && this.asistencia.length > 0) {
            let content = '';

            // Generamos el contenido del archivo
            this.asistencia.forEach(item => {
                content += `${item.codigoTrabajador}|` +
                    `${item.dias}|` +
                    `${item.diasFalta}|` +

                    `${item.diasDescanso}|` +
                    `${item.horasTrabajadas}|` +
                    `${item.horasHorario}|` +
                    `${item.horasExtrasTotales}|` +
                    // `${item.nHraDomPag}|` +
                    // `${item.nHraFerTra}|` +
                    // `${item.hturnoManu}|` +
                    // `${item.minTardanza}|` +
                    `${item.nHorExtr25}|` +
                    `${item.nHorExtr35}|` +
                    `${item.nHorExtr50}|` +
                    `${item.nHorExtr60}|` +
                    `${item.nHorExtr100}|`+
                    `${item.nHorExtr100Obrero}|\n`;
                    // `${item.nHorExtrDo}\n`;
            });

            const suggestedName = `Asist_${this.fechahoy}_.txt`;

            try {
                // Intentamos usar el método moderno primero
                if ('showSaveFilePicker' in window) {
                    const options = {
                        suggestedName: suggestedName,
                        types: [{
                            description: 'Archivo de texto',
                            accept: { 'text/plain': ['.txt'] }
                        }]
                    };

                    const handle = await (window as any).showSaveFilePicker(options);
                    const writable = await handle.createWritable();
                    await writable.write(content);
                    await writable.close();
                } else {
                    // Fallback para navegadores que no soportan showSaveFilePicker
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = suggestedName;
                    link.click();
                    window.URL.revokeObjectURL(url);
                }

                this.ms.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Archivo guardado correctamente'
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    this.ms.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo guardar el archivo'
                    });
                }
            }
        } else {
            this.ms.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se encontró ningún registro para exportar'
            });
        }
    }

    generatePDF(rowData: any) {
        const doc = new jsPDF();

        // --- Medidas de columnas ---
        const x1 = 10;   // borde izquierdo
        const x2 = 55;   // división 1
        const x3 = 150;  // división 2
        const x4 = 200;  // borde derecho

        let y = 15;

        // --- Caja principal ---
        doc.rect(x1, 10, x4 - x1, 250);

        // --- Cabecera: 2 filas, 3 columnas ---
        // Líneas verticales
        doc.line(x2, 10, x2, 45);
        doc.line(x3, 10, x3, 45);

        // Líneas horizontales
        doc.line(x1, 45, x4, 45);

        // --- [IMAGEN LOGO] ---
        fetch('assets/demo/logo.png')
            .then(res => res.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    // Imagen más alta (ajustar y=12, height=28)
                    doc.addImage(e.target.result, 'PNG', x1 + 3.5, 12, 35, 28);

                    // --- Alineado vertical para columna 2 y 3 ---
                    // Calcula el centro vertical del header (de y=10 a y=45)
                    const headerTop = 10;
                    const headerBottom = 45;
                    const headerCenter = (headerTop + headerBottom) / 2; // 27.5

                    // Ajusta el espacio entre las dos líneas de texto
                    const lineSpacing = 6;

                    // Columna 2 (centrado vertical)
                    doc.setFontSize(14);
                    doc.setFont('helvetica', 'bold');
                    doc.text('RECORDATORIO', (x2 + x3) / 2, headerCenter - lineSpacing / 2, { align: 'center' });
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    doc.text('DPTO. DE RECURSOS HUMANOS', (x2 + x3) / 2, headerCenter + lineSpacing / 2, { align: 'center' });

                    // Columna 3 (centrado vertical)
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    doc.text('Con copia a:', x3 + 3, headerCenter - lineSpacing / 2);
                    doc.text('Archivo de RRHH', x3 + 3, headerCenter + lineSpacing / 2);

                    // --- Datos principales (A, De, Asunto, Fecha) ---
                    let yDatos = 45 + 8;
                    doc.setFontSize(11);

                    // A:
                    doc.setFont('helvetica', 'normal');
                    doc.text('A:', x1 + 3, yDatos);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`${rowData?.nombretrabajador || 'GARAY DIEGO KILLA WAYRA'}`, x2 + 3, yDatos);
                    doc.setFont('helvetica', 'italic');
                    doc.text('PROFESOR', x2 + 3, yDatos + 7);

                    // De:
                    yDatos += 17;
                    doc.setFont('helvetica', 'normal');
                    doc.text('DE:', x1 + 3, yDatos);
                    doc.setFont('helvetica', 'bold');
                    doc.text('ISRAEL VARGAS PARDO', x2 + 3, yDatos);
                    doc.setFont('helvetica', 'italic');
                    doc.text('JEFE DE RECURSOS HUMANOS', x2 + 3, yDatos + 7);

                    // Asunto:
                    yDatos += 17;
                    doc.setFont('helvetica', 'normal');
                    doc.text('Asunto:', x1 + 3, yDatos);
                    doc.setFont('helvetica', 'bold');
                    doc.text('LLAMADO DE ATENCIÓN POR TARDANZA', x2 + 3, yDatos);

                    // Fecha:
                    yDatos += 14;
                    doc.setFont('helvetica', 'normal');
                    doc.text('Fecha:', x1 + 3, yDatos);
                    doc.setFont('helvetica', 'bold');
                    doc.text('4 de junio del 2025', x2 + 3, yDatos);

                    // --- Línea horizontal debajo de los datos principales ---
                    yDatos += 7;
                    doc.line(x1, yDatos, x4, yDatos);

                    // --- Cuerpo del mensaje y firma ---
                    yDatos += 8;
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(10);

                    // Texto justificado: bordes izquierdo y derecho alineados
                    const parrafos = [
                        'Por medio de la presente, se le informa que el día 4 de junio del presente año usted incurrió en una falta al presentarse tarde a su lugar de trabajo.',
                        'Le recomendamos, que el horario de ingreso establecido para su área es a las 07:00, contando con una tolerancia máxima de 15 minutos. A partir de las 7:15:00 AM, se considera tardanza, y si el ingreso ocurre después de las 7:16:00 AM, se considera inasistencia, independientemente de si se presenta posteriormente a la empresa.',
                        'Al tratarse de la primera ocasión en la que incurre en esta situación, este memorándum constituye únicamente un llamado de atención. No obstante, de repetirse esta conducta, la empresa tomará las medidas correspondientes conforme a lo establecido en el reglamento interno.',
                        'Sin otro particular, quedamos atentos a su comprensión y cumplimiento.',
                        'Atentamente,'
                    ];
                    let cuerpoY = yDatos + 7;
                    const margenIzq = x1 + 3;
                    const anchoTexto = 180;

                    parrafos.forEach(parrafo => {
                        const lineas = doc.splitTextToSize(parrafo, anchoTexto);
                        for (let i = 0; i < lineas.length; i++) {
                            const texto = lineas[i];
                            // Justifica todas las líneas excepto la última del párrafo y las de un solo palabra
                            if (i < lineas.length - 1 && texto.trim().indexOf(' ') > 0) {
                                const palabras = texto.trim().split(/\s+/);
                                const anchoLinea = palabras.reduce((acc, palabra) => acc + doc.getTextWidth(palabra), 0);
                                const espacioExtra = (anchoTexto - anchoLinea) / (palabras.length - 1);
                                let x = margenIzq;
                                palabras.forEach((palabra, idx) => {
                                    doc.text(palabra, x, cuerpoY);
                                    if (idx < palabras.length - 1) {
                                        x += doc.getTextWidth(palabra) + espacioExtra;
                                    }
                                });
                            } else {
                                doc.text(texto, margenIzq, cuerpoY);
                            }
                            cuerpoY += 6;
                        }
                        cuerpoY += 4; // Espacio entre párrafos
                    });

                    // Firma
                    cuerpoY += 4;
                    fetch('assets/demo/logo-firma.png')
                        .then(res2 => res2.blob())
                        .then(blob2 => {
                            const reader2 = new FileReader();
                            reader2.onload = (e2: any) => {
                                doc.addImage(e2.target.result, 'PNG', x1 + 3, cuerpoY, 50, 20);
                                doc.save(`LlamadoAtencion_${rowData?.codigoTrabajador || 'trabajador'}.pdf`);
                            };
                            reader2.readAsDataURL(blob2);
                        });
                };
                reader.readAsDataURL(blob);
            });
    }

}
