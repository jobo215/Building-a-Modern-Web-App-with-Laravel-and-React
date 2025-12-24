import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./page/Home";
import { NavBar } from "./components/NavBar";
import { MoviePage } from "./page/Movie";
import Register from "./page/Register";
import { Login } from "./page/Login";
import Profile from "./page/Profile";
import EditProfile from "./page/EditProfile";
import { ToastContainer } from "react-toastify";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Favorites } from "./page/Favorites";

export const App = () => {
  return (
    <>
      <NavBar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/:id" element={<MoviePage />} />
            <Route path="/me" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/favorites" element={<Favorites />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};
