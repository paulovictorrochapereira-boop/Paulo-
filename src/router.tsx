import { createRouter } from '@tanstack/react-router';
import { Route as rootRoute } from './routes/__root';
import { Route as indexRoute } from './routes/index';
import { Route as registrationRoute } from './routes/credenciamento';
import { Route as adminRoute } from './routes/admin';
import { Route as privacyRoute } from './routes/privacidade';

const routeTree = rootRoute.addChildren([
  indexRoute,
  registrationRoute,
  adminRoute,
  privacyRoute,
]);

export const router = createRouter({ routeTree, defaultPreload: 'intent', scrollRestoration: true });

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
