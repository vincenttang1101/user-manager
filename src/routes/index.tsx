import { MainLayout } from "@/layouts/MainLayout";
import HomePage from "@/pages/home";
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";

const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
];

export default function Routes() {
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}
