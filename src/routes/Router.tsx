import React from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import App from "../App";
import Member from "../components/Forms/Member";
import Team from "../components/Forms/Team";
import MemberProfile from "../components/Profile/MemberProfile";
import TeamProfile from "../components/Profile/TeamProfilel";

import SignIn from "../components/SignIn/SignIn";
import Layout from "../containers/Layout";
import Register from "../Register/Register";
import Explore from "./Explore";
import Home from "./Home";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/register/team" element={<Team />}></Route>
        <Route path="/register/member" element={<Member />}></Route>"
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/sign-in" element={<SignIn />}></Route>
          <Route path="/explore" element={<Explore />}></Route>
          <Route path="/member-profile" element={<MemberProfile />}></Route>
          <Route path="/team-profile" element={<TeamProfile />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
