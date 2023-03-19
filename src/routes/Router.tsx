import { BrowserRouter, Route, Routes } from "react-router-dom";
import Member from "../components/Forms/Member";
import Team from "../components/Forms/Team";
import MemberProfile from "../components/Profile/MemberProfile";
import TeamProfile from "../components/Profile/TeamProfile";

import SignIn from "../components/SignIn/SignIn";

import SecureLayout from "../containers/SecureLayout";
import Register from "../register/Register";
import Explore from "./Explore";
import Home from "./Home";

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
