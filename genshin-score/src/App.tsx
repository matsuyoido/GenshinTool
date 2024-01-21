import { Routes, Route, Outlet } from "react-router-dom";
import Example from "@page/example";

const Layout = (): JSX.Element => (
  <>
    <h1>HogeHoge</h1>
    <Outlet />
  </>
);

const Home = (): JSX.Element => <>Home!!</>;

function App(): JSX.Element {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Home />} />
          <Route path="example" element={<Example />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
