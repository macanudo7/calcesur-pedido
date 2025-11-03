import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { CGenerateOrder } from './pages/c-generate-order/c-generate-order';
import { ClientLayout } from './layouts/client-layout/client-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AAgregarProducto } from './pages/a-agregar-producto/a-agregar-producto';
import { CLogin } from './pages/c-login/c-login';
import { ListaProductos } from './pages/lista-productos/lista-productos';
import { AAgregarUsuario } from './pages/a-agregar-usuario/a-agregar-usuario';
import { AListaUsuarios } from './pages/a-lista-usuarios/a-lista-usuarios';
import { APedidosPorEntregar } from './pages/a-pedidos-por-entregar/a-pedidos-por-entregar';
import { APedidosPorConfirmar } from './pages/a-pedidos-por-confirmar/a-pedidos-por-confirmar';
import { APedidosPorEditarEliminar } from './pages/a-pedidos-por-editar-eliminar/a-pedidos-por-editar-eliminar';
import { AProgramacionSemanal } from './pages/a-programacion-semanal/a-programacion-semanal';
import { AEfectividadEntrega } from './pages/a-efectividad-entrega/a-efectividad-entrega';
import { AOtifPorDia } from './pages/a-otif-por-dia/a-otif-por-dia';
import { ADetallePorCliente } from './pages/a-detalle-por-cliente/a-detalle-por-cliente';
import { CHistorialPedidos } from './pages/c-historial-pedidos/c-historial-pedidos';
import { AListaVehiculos } from './pages/a-lista-vehiculos/a-lista-vehiculos';
import { AAgregarVehiculo } from './pages/a-agregar-vehiculo/a-agregar-vehiculo';
import { APedidosConfirmadoEntregado } from './pages/a-pedidos-confirmado-entregado/a-pedidos-confirmado-entregado';
import { AListaClientes } from './pages/a-lista-clientes/a-lista-clientes';
import { AProgramacionMes } from './pages/a-programacion-mes/a-programacion-mes';
import { AVerDetalles } from './pages/a-ver-detalles/a-ver-detalles';
import { CHistorialPedidosDetalle } from './pages/c-historial-pedidos-detalle/c-historial-pedidos-detalle' 
import { AEditarPedidosPorConfirmar } from './pages/a-editar-pedidos-por-confirmar/a-editar-pedidos-por-confirmar';
import { AVerPedidosConfirmados } from './pages/a-ver-pedidos-confirmados/a-ver-pedidos-confirmados';
import { AVerPedidosPorEditarEliminar } from './pages/a-ver-pedidos-por-editar-eliminar/a-ver-pedidos-por-editar-eliminar';
import { CHistorialPedidoEditar } from './pages/c-historial-pedido-editar/c-historial-pedido-editar';
import { AVerPedidosEntregados } from './pages/a-ver-pedidos-entregados/a-ver-pedidos-entregados';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'ingreso',
        pathMatch: 'full'
    },
    {
        path: 'ingreso',
        component: CLogin
    },
    {
        path: 'ingreso-admin',
        component: Login
    },
    {
        path: 'cliente',
        component: ClientLayout,
        canActivate: [authGuard],
        children: [
            { 
                path: 'generar-pedido',
                component: CGenerateOrder
            },
            { 
                path: 'historial-pedidos',
                component: CHistorialPedidos
            },
            {   path: 'detalle-pedido/:id', 
                component: CHistorialPedidosDetalle 
            },
            {
                path: 'editar-pedido/:id',
                component: CHistorialPedidoEditar
            }
        ]
    },
    {
        path: 'admin',
        component: AdminLayout,
        canActivate: [authGuard, adminGuard],
        children: [
            { 
                path: 'lista-productos',
                component: ListaProductos
            },
            { 
                path: 'agregar-producto',
                component: AAgregarProducto
            },
            { 
                path: 'editar-producto/:id', 
                component: AAgregarProducto 
            },
            { 
                path: 'agregar-usuario',
                component: AAgregarUsuario
            },
            { 
                path: 'lista-usuarios',
                component: AListaUsuarios
            },
            { 
                path: 'ver-detalles-usuario/:id', 
                component: AVerDetalles 
            },
            { 
                path: 'editar-usuario/:id', 
                component: AAgregarUsuario 
            },
            { 
                path: 'lista-vehiculos',
                component: AListaVehiculos
            },
            { 
                path: 'agregar-vehiculo',
                component: AAgregarVehiculo
            },
            { 
                path: 'editar-vehiculo/:id', 
                component: AAgregarVehiculo 
            },
            { 
                path: 'pedidos-por-entregar',
                component: APedidosPorEntregar
            },
            { 
                path: 'ver-pedidos-confirmados/:id',
                component: AVerPedidosConfirmados
            },
            { 
                path: 'pedidos-por-confirmar',
                component: APedidosPorConfirmar
            },
            { 
                path: 'editar-pedidos-por-confirmar/:id',
                component: AEditarPedidosPorConfirmar
            },
            { 
                path: 'pedidos-por-editar-o-eliminar',
                component: APedidosPorEditarEliminar
            },
            { 
                path: 'ver-pedidos-por-editar-eliminar/:id',
                component: AVerPedidosPorEditarEliminar
            },
            { 
                path: 'pedidos-confirmados-entregados',
                component: APedidosConfirmadoEntregado
            },
            { 
                path: 'ver-pedidos-entregados/:id',
                component: AVerPedidosEntregados
            },
            { 
                path: 'lista-clientes',
                component: AListaClientes
            },
            { 
                path: 'programacion-semanal',
                component: AProgramacionSemanal
            },
            { 
                path: 'programacion-mes',
                component: AProgramacionMes
            },
            { 
                path: 'efectividad-por-entrega',
                component: AEfectividadEntrega
            },
            { 
                path: 'otif-por-dia',
                component: AOtifPorDia
            },
            { 
                path: 'detalle-por-cliente',
                component: ADetallePorCliente
            },
        ]
    },

];
