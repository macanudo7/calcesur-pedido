import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rutas dinámicas: SSR (no prerender)
  { path: 'cliente/detalle-pedido/:id', renderMode: RenderMode.Server },
  { path: 'cliente/editar-pedido/:id', renderMode: RenderMode.Server },
  { path: 'admin/editar-producto/:id', renderMode: RenderMode.Server },
  { path: 'admin/ver-detalles-usuario/:id', renderMode: RenderMode.Server },
  { path: 'admin/editar-usuario/:id', renderMode: RenderMode.Server },
  { path: 'admin/editar-vehiculo/:id', renderMode: RenderMode.Server },
  { path: 'admin/ver-pedidos-confirmados/:id', renderMode: RenderMode.Server },
  { path: 'admin/editar-pedidos-por-confirmar/:id', renderMode: RenderMode.Server },
  { path: 'admin/ver-pedidos-por-editar-eliminar/:id', renderMode: RenderMode.Server },

  // (Opcional) páginas estáticas que sí quieras prerender:
  // { path: '', renderMode: RenderMode.Prerender },
  // { path: 'ingreso', renderMode: RenderMode.Prerender },
  // { path: 'ingreso-admin', renderMode: RenderMode.Prerender },

  // fallback
  { path: '**', renderMode: RenderMode.Server },
];
