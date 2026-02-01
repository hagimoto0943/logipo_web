import React from "react";
import { SessionProvider } from "@lib/providers/SessionProvider.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";

import Dashboard from "./routes/dashboard";
import Test from "./routes/test";
import Reviews from "./routes/activity/reviews";
import ReviewDetail from "./routes/activity/reviews/[id]";
import ReviewNew from "./routes/activity/reviews/new";
import AccountLayout from "./routes/account/layout";
import AccountOverview from "./routes/account/index";
import AccountActivation from "./routes/account/activation";
import ActivationRedirect from "./routes/activation";

const router = createBrowserRouter([
  {
    path: "/app",
    element: <Root />,
    children: [
      { index: true, element: <ReviewNew /> },
      { path: "reviews", element: <Reviews /> },
      { path: "reviews/:id", element: <ReviewDetail /> },
      { path: "reviews/new", element: <ReviewNew /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "test", element: <Test /> },
      { path: "activation", element: <ActivationRedirect /> },
      {
        path: "account",
        element: <AccountLayout />,
        children: [
          { index: true, element: <AccountOverview /> },
          { path: "activation", element: <AccountActivation /> },
        ],
      },
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
