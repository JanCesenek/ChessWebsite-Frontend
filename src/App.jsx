import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Root from "./pages/root";
import Table from "./pages/table";
import Redirect from "./pages/redirect";
import Articles from "./pages/articles";
import Donation from "./pages/donation";
import History from "./pages/history";
import Contact from "./pages/contact";
import Auth from "./pages/auth";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        { index: true, element: <Redirect /> },
        { path: "clanky", element: <Articles /> },
        { path: "clanky/:id", element: <Articles /> },
        { path: "soutez", element: <Table /> },
        { path: "dotace", element: <Donation /> },
        { path: "historie", element: <History /> },
        { path: "kontakt", element: <Contact /> },
        { path: "auth", element: <Auth /> },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
