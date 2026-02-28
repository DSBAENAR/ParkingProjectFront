import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { Vehicles } from "./components/Vehicles";
import { Registers } from "./components/Registers";
import { Payments } from "./components/Payments";
import { Users } from "./components/Users";
import { Reports } from "./components/Reports";
import { NotFound } from "./components/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "vehicles", element: <Vehicles /> },
      { path: "registers", element: <Registers /> },
      { path: "payments", element: <Payments /> },
      { path: "users", element: <Users /> },
      { path: "reports", element: <Reports /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
