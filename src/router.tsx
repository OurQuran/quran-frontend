import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import { Suspense } from "react";
import ErrorElement from "./pages/ErrorElement";
import Error from "./pages/Error";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Surah from "./pages/Surah";
import Tags from "./pages/Tags";
import Login from "./pages/Login";
import { hasPermission, isLoggedIn } from "./helpers/authGuards";
import { RoleTypeEnum } from "./types/authTypes";
import SignUp from "./pages/SignUp";
import Tag from "./pages/Tag";
import Users from "./pages/admin/Users";
import AllTags from "./pages/admin/tags/AllTags";
import UnapprovedTags from "./pages/admin/tags/UnapprovedTags";
import DashboardLayout from "./layout/DashboardLayout";
import Bookamarks from "./pages/Bookmarks";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" errorElement={<ErrorElement />} element={<MainLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/surah/:id"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Surah />
            </Suspense>
          }
        />

        <Route
          path="/tags"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Tags />
            </Suspense>
          }
        />
        <Route
          path="/tags/:id"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Tag />
            </Suspense>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Bookamarks />
            </Suspense>
          }
        />

        <Route
          path="/dashbaord"
          loader={() =>
            hasPermission([RoleTypeEnum.SUPERADMIN, RoleTypeEnum.ADMIN])
          }
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <DashboardLayout />
            </Suspense>
          }
        >
          <Route
            path="users"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Users />
              </Suspense>
            }
          />

          <Route
            path="tags"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AllTags />
              </Suspense>
            }
          />
          <Route
            path="unapproved"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <UnapprovedTags />
              </Suspense>
            }
          />
        </Route>
      </Route>

      <Route
        path="login"
        errorElement={<ErrorElement />}
        loader={() => isLoggedIn(true)}
        element={<Login />}
      />
      <Route
        path="signup"
        errorElement={<ErrorElement />}
        loader={() => isLoggedIn(true)}
        element={<SignUp />}
      />
      {/* Catch-all error route */}
      <Route path="*" errorElement={<ErrorElement />} element={<Error />} />
    </>
  )
);

export default router;
