import { Outlet } from "react-router";

import Navbar from "../components/Navbar/Navbar";
import SignIn from "../components/SignIn/SignIn";
import Register from "../Register/Register";

const Layout = () => {
  const currentUser = localStorage.getItem("signedIn");
  const user = JSON.parse(localStorage.getItem("registered")!);
  //const { appState, appStatedispatch }: any = useUserContext();

  // useEffect(() => {
  //   appStatedispatch({
  //     user,
  //   });
  // }, []);

  return (
    <>
      {currentUser && user ? (
        <div>
          <Navbar />
          <Outlet />
        </div>
      ) : (
        <>
          {!currentUser ? (
            <>
              <Navbar />
              <SignIn />
            </>
          ) : (
            <>
              {currentUser && !user ? (
                <>
                  <Navbar />
                  <Register />
                </>
              ) : (
                <>
                  <Navbar />
                  <SignIn />
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
export default Layout;
