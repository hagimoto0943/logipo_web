import React from "react";
import { SessionProvider } from "@lib/providers/SessionProvider.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import Training from "./routes/training";
import Dashboard from "./routes/dashboard";
import Test from "./routes/test";
import Reviews from "./routes/activity/reviews";
import ReviewDetail from "./routes/activity/reviews/[id]";
import ReviewNew from "./routes/activity/reviews/new";

const router = createBrowserRouter([
  {
    path: "/app",
    element: <Root />,
    children: [
      { index: true, element: <Training /> },
      { path: "reviews", element: <Reviews /> },
      { path: "reviews/:id", element: <ReviewDetail /> },
      { path: "reviews/new", element: <ReviewNew /> },
      { path: "training", element: <Training /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "test", element: <Test /> },
    ],
  },
]);

export default function App() {
  return (
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  );
}
