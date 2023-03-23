import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Explore from "./Explore";
import Home from "./Home";

const Member = lazy(() => import("../components/Forms/Member"));
const Team = lazy(() => import("../components/Forms/Team"));
const MemberProfile = lazy(() => import("../components/Profile/MemberProfile"));
const TeamProfile = lazy(() => import("../components/Profile/TeamProfile"));
const Register = lazy(() => import("../Register/Register"));
const SecureLayout = lazy(() => import("../containers/SecureLayout"));

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SecureLayout />}>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/register/team" element={<Team />}></Route>
          <Route path="/register/member" element={<Member />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/explore" element={<Explore />}></Route>
          <Route path="/member-profile" element={<MemberProfile />}></Route>
          <Route path="/team-profile" element={<TeamProfile />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
