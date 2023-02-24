import SignIn from "./components/SignIn/SignIn";
import Router from "./routes/Router";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserContextProvider } from "./context/UserContextProvider";
// const queryClient = new QueryClient();
function App() {
  return (
    <>
      <Router />
    </>
  );
}

export default App;
