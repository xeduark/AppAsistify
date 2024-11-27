import { createBrowserRouter, RouterProvider} from "react-router-dom";
import { EnrutadorApp } from "./components/routes/EnrutadorApp";

let router = createBrowserRouter(EnrutadorApp);
const App = () =>{
  return <RouterProvider router={router} />;
}
export default App;