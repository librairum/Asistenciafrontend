import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { PermisosxperfilService } from '../demo/service/permisosxperfil.service';
import { GlobalserviceService } from '../demo/service/globalservice.service';

interface MenuItem{
    label: string;
    icon?:string;
    routerLink?: string[];
    items?: MenuItem[];
}

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})

export class AppMenuComponent implements OnInit {

    model: MenuItem[] = [];

    constructor(public layoutService: LayoutService, private pS: PermisosxperfilService, private gS:GlobalserviceService) { }

    ngOnInit() {
<<<<<<< HEAD
        this.model = [
            {
                label: 'Asistencia',
                items: [
                    { label: 'Consulta de Asistencia', icon: 'pi pi-fw pi-book', routerLink: ['asistencia'] }
                ]
            },
            {
                label: 'Marcaciones',
                items: [
                    { label: 'Consulta de Marcaciones', icon: 'pi pi-fw pi-server', routerLink: ['marcaciones'] }
                ]
            },
            {
                label: 'Marcadores',
                items: [
                    { label: 'Mantenimiento de Marcadores', icon: 'pi pi-fw pi-cog', routerLink: ['marcadores'] }
                ]
            },
            {
                label: 'Usuario',
                items: [
                    { label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: ['usuarios'] }
                ]
            },
            {
                label: 'Año',
                items: [
                    { label: 'Mantenimiento de Año', icon: 'pi pi-fw pi-calendar', routerLink: ['anio'] }
                ]
            },
            {
                label: 'Perfil',
                items: [
                    { label: 'Mantenimiento de Perfil', icon: 'pi pi-fw pi-user-edit', routerLink: ['perfil'] }
                ]
            },
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/Menu'] }
                ]
            },
            {
                label: 'UI Components',
                items: [
                    { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/Menu/uikit/formlayout'] },
                    { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/Menu/uikit/input'] },
                    { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/Menu/uikit/floatlabel'] },
                    { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/Menu/uikit/invalidstate'] },
                    { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/Menu/uikit/button'] },
                    { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/Menu/uikit/table'] },
                    { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/Menu/uikit/list'] },
                    { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/Menu/uikit/tree'] },
                    { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/Menu/uikit/panel'] },
                    { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/Menu/uikit/overlay'] },
                    { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/Menu/uikit/media'] },
                    { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/Menu/uikit/menu'], routerLinkActiveOptions: { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
                    { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/Menu/uikit/message'] },
                    { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/Menu/uikit/file'] },
                    { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/Menu/uikit/charts'] },
                    { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/Menu/uikit/misc'] }
                ]
            },
            {
                label: 'Prime Blocks',
                items: [
                    { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/Menu/blocks'], badge: 'NEW' },
                    { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank' },
                ]
            },
            {
                label: 'Utilities',
                items: [
                    { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/Menu/utilities/icons'] },
                    { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
                ]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/Menu/landing']
                    },
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/Menu/pages/crud']
                    },
                    {
                        label: 'Timeline',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/Menu/pages/timeline']
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/Menu/notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/Menu/pages/empty']
                    },
                ]
            },
            {
                label: 'Hierarchy',
                items: [
                    {
                        label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                            {
                                label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                        ]
                    },
                    {
                        label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                            {
                                label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                        ]
                    }
                ]
            },
            {
                label: 'Get Started',
                items: [
                    {
                        label: 'Documentation', icon: 'pi pi-fw pi-question', routerLink: ['/Menu/documentation']
                    },
                    {
                        label: 'View Source', icon: 'pi pi-fw pi-search', url: ['https://github.com/primefaces/sakai-ng'], target: '_blank'
                    }
                ]
            }
        ];
=======
        this.loadMenu()
>>>>>>> origin/haylu
    }

    loadMenu(){
        const codigoPerfil=this.gS.getCodigoPerfil();
        const modulo='01';

        this.pS.getPermisosPorPerfil(codigoPerfil,modulo).subscribe(response=>{
            if(response.isSuccess && response.data){
                this.model= this.buildMenuStructure(response.data);
            }
        })
    }

    private buildMenuStructure(permisos: any[]): MenuItem[] {
        const menuItems: MenuItem[] = [];
        const menuGroups = new Map<string, any>();

        // First, identify all menu groups (items with codigoFormulario ending in '0000')
        permisos.forEach(permiso => {
            if (permiso.codigoFormulario.endsWith('0000')) {
                menuGroups.set(permiso.codigoFormulario.substring(0, 2), {
                    label: permiso.etiqueta,
                    items: []
                });
            }
        });
        permisos.forEach(permiso => {
            if (!permiso.codigoFormulario.endsWith('0000')) {
                const groupPrefix = permiso.codigoFormulario.substring(0, 2);
                const group = menuGroups.get(groupPrefix);

                if (group) {
                    group.items.push({
                        label: permiso.etiqueta,
                        icon: this.getIconForFormulario(permiso.codigoFormulario),
                        routerLink: [this.getRouterLink(permiso.nombreFormulario)]
                    });
                }
            }
        });
        menuGroups.forEach(group => {
            if (group.items.length > 0) {
                menuItems.push(group);
            }
        });

        return menuItems;
    }

    private getIconForFormulario(codigoFormulario: string): string {
        const iconMap: { [key: string]: string } = {
            '010100': 'pi pi-fw pi-clock',
            '010200': 'pi pi-fw pi-desktop',
            '020200': 'pi pi-fw pi-users',
            // Add more mappings as needed
        };

        return iconMap[codigoFormulario] || 'pi pi-fw pi-circle';
    }

    private getRouterLink(nombreFormulario: string): string {
        // Remove 'frm' prefix and convert to kebab case
        return nombreFormulario
            .replace('frm', '')
            .split(/(?=[A-Z])/)
            .join('-')
            .toLowerCase();
    }

}
