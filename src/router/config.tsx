import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound.jsx";
import Home from "../pages/home/page.jsx";
import About from "../pages/about/page.jsx";
import Communities from "../pages/communities/page.jsx";
import Programs from "../pages/programs/page.jsx";
import Events from "../pages/events/page.jsx";
import EventDetail from "../pages/events/detail/page.jsx";
import Gallery from "../pages/gallery/page.jsx";
import GalleryDetail from "../pages/gallery/detail/page.jsx";
import Videos from "../pages/videos/page.jsx";
import Contact from "../pages/contact/page.jsx";
import Login from "../pages/login/page.jsx";
import Register from "../pages/register/page.jsx";
import AdminLayout from "../components/AdminLayout.jsx";
import AdminDashboard from "../pages/admin/dashboard/page.jsx";
import AdminMessages from "../pages/admin/messages/page.jsx";
import AdminEvents from "../pages/admin/events/page.jsx";
import AdminPrograms from "../pages/admin/programs/page.jsx";
import AdminCommunities from "../pages/admin/communities/page.jsx";
import AdminGallery from "../pages/admin/gallery/page.jsx";
import AdminVideos from "../pages/admin/videos/page.jsx";
import AdminTestimonials from "../pages/admin/testimonials/page.jsx";
import AdminSettings from "../pages/admin/settings/page.jsx";
import AdminUsers from "../pages/admin/users/page.jsx";
import SetupAdmin from "../pages/setup-admin/page.jsx";
import ResetPassword from "../pages/reset-password/page.jsx";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/communities",
    element: <Communities />,
  },
  {
    path: "/programs",
    element: <Programs />,
  },
  {
    path: "/events",
    element: <Events />,
  },
  {
    path: "/events/:id",
    element: <EventDetail />,
  },
  {
    path: "/gallery",
    element: <Gallery />,
  },
  {
    path: "/gallery/:id",
    element: <GalleryDetail />,
  },
  {
    path: "/videos",
    element: <Videos />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/setup-admin",
    element: <SetupAdmin />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: "messages", element: <AdminMessages /> },
      { path: "events", element: <AdminEvents /> },
      { path: "programs", element: <AdminPrograms /> },
      { path: "communities", element: <AdminCommunities /> },
      { path: "gallery", element: <AdminGallery /> },
      { path: "videos", element: <AdminVideos /> },
      { path: "testimonials", element: <AdminTestimonials /> },
      { path: "users", element: <AdminUsers /> },
      { path: "settings", element: <AdminSettings /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;