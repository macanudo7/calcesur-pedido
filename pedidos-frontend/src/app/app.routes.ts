import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { CGenerateOrder } from './pages/c-generate-order/c-generate-order';
import { ClientLayout } from './layouts/client-layout/client-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AAgregarProducto } from './pages/a-agregar-producto/a-agregar-producto';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'ingreso',
        pathMatch: 'full'
    },
    {
        path: 'ingreso',
        component: Login
    },
    {
        path: 'cliente',
        component: ClientLayout,
        children: [
            { 
                path: 'generar-pedido',
                component: CGenerateOrder
            }
        ]
    },
    {
        path: 'admin',
        component: AdminLayout,
        children: [
            { 
                path: 'agregar-producto',
                component: AAgregarProducto
            }
        ]
    },

];
