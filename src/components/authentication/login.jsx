import React, { useReducer, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleLoginButton from "./googlelogin";
import axios from "axios";
const initialState = {
  email: "",
  password: "",
  remember: false,
  errors: {},
  submitting: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "set":
      return { ...state, [action.name]: action.value, errors: { ...state.errors, [action.name]: "" } };
    case "toggle":
      return { ...state, remember: !state.remember };
    case "errors":
      return { ...state, errors: action.payload || {} };
    case "submitting":
      return { ...state, submitting: action.value };
    default:
      return state;
  }
}

export default function LoginPage({ dark = true }) {
  const [profileData, setProfileData] = useState({
    name: "",
    contact_number: "",
    bio: "",
    location: "",
    gender: "",
    date_of_birth: "",
    social_links: "",
    profile_picture: "", // string URL or File
    cover_photo: "", // string URL or File
  });
  const [addressBool, setAddressBool] = useState(false);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { email, password, remember, errors, submitting } = state;

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email or username is required";
    if (!password) e.password = "Password is required";
    return e;
  };

  // declare local token holder
  let accessToken = "";

  const fetchProfile = useCallback(async (token) => {
    try {
      const res = await axios.get("http://127.0.0.1:8002/GetProfileAPIView/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('datasssss',res.data)
      if (res.data.name==="") {
        setAddressBool(true);
      } else {
        setAddressBool(false);
        navigate("/");
      }
    } catch (err) {
      console.log("Profile fetch error:", err?.response?.data || err?.message);
      setAddressBool(true);
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const eObj = validate();
    if (Object.keys(eObj).length) {
      dispatch({ type: "errors", payload: eObj });
      return;
    }

    try {
      dispatch({ type: "submitting", value: true });
      const payload = { email, password };
      const res = await axios.post(
        `${baseURL}/authentication/LoginPageApiView/`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      accessToken = localStorage.getItem("access_token") || "";
      if (accessToken) await fetchProfile(accessToken)

      
    } catch (err) {
      if (err.response) {
        const body = err.response.data || {};
        const msg =
          body.detail ||
          (Array.isArray(body.non_field_errors) && body.non_field_errors[0]) ||
          body.message ||
          "Bad request";
        const firstField = Object.keys(body).find(
          (k) => k !== "detail" && k !== "non_field_errors" && k !== "message"
        );
        if (firstField) {
          dispatch({
            type: "errors",
            payload: {
              [firstField]: Array.isArray(body[firstField]) ? body[firstField][0] : String(body[firstField]),
            },
          });
        } else {
          dispatch({ type: "errors", payload: { submit: msg } });
        }
        console.log("Login 400:", err.response.status, body);
      } else if (err.request) {
        dispatch({ type: "errors", payload: { submit: "No response from server" } });
      } else {
        dispatch({ type: "errors", payload: { submit: err.message || "Request error" } });
      }
    } finally {
      dispatch({ type: "submitting", value: false });
    }
  };

  const handleCreateProfile = async () => {
    try {
      const token = accessToken || localStorage.getItem("access_token");
      if (!token) throw new Error("Missing access token");

      const form = new FormData();
      const maybeAppend = (k, v) => {
        if (v !== undefined && v !== null && v !== "") form.append(k, v);
      };

      maybeAppend("name", profileData.name);
      maybeAppend("contact_number", profileData.contact_number);
      maybeAppend("bio", profileData.bio);
      maybeAppend("location", profileData.location);
      maybeAppend("gender", profileData.gender);
      maybeAppend("date_of_birth", profileData.date_of_birth);

      if (profileData.social_links) {
        if (typeof profileData.social_links === "object") {
          form.append("social_links", JSON.stringify(profileData.social_links));
        } else {
          form.append("social_links", profileData.social_links);
        }
      }
      if (profileData.cover_photo instanceof File) {
        form.append("cover_photo", profileData.cover_photo);
      }
      if (profileData.profile_picture instanceof File) {
        form.append("profile_picture", profileData.profile_picture);
      }

      const res = await axios.post("http://127.0.0.1:8002/ProfileAPIView/", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Profile updated", res.data);
      setAddressBool(false);
      fetchProfile(token);
      navigate('/')
    } catch (err) {
      console.error("Update error:", err?.response?.status, err?.response?.data || err?.message);
    }
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="relative min-h-screen flex flex-col justify-between bg-gray-100 dark:bg-slate-950 transition-colors duration-500">
        <div className="pointer-events-none absolute inset-0 -z-10 animate-gradient-bg bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-pink-500/20 dark:from-blue-700/15 dark:via-purple-700/10 dark:to-pink-700/15" />
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(900px 420px at 50% 140px, rgba(37,99,235,0.25), rgba(2,6,23,0) 60%)" }}
        />

        <main className="relative z-10 flex-1 w-full px-4 py-10 sm:py-14 flex items-start sm:items-center justify-center">
          <div className="w-full max-w-md">
            <div className="overflow-hidden rounded-3xl border border-white/20 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl shadow-[0_30px_80px_-30px_rgba(37,99,235,0.45)] ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300">
              <div className="p-6 sm:p-7">
                {errors.submit && (
                  <div className="mb-4 rounded-lg border border-rose-400/30 bg-rose-500/10 text-rose-300 px-3 py-2 text-sm">
                    {errors.submit}
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-5 sm:space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                      Username or Email
                    </label>
                    <input
                      id="email"
                      type="text"
                      placeholder="Enter your email or username"
                      value={email}
                      onChange={(e) => dispatch({ type: "set", name: "email", value: e.target.value })}
                      required
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/70 border ${
                        errors.email ? "border-rose-500 focus:ring-rose-500" : "border-slate-200 dark:border-slate-700 focus:ring-blue-500"
                      } text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => dispatch({ type: "set", name: "password", value: e.target.value })}
                      required
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/70 border ${
                        errors.password ? "border-rose-500 focus:ring-rose-500" : "border-slate-200 dark:border-slate-700 focus:ring-blue-500"
                      } text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500`}
                    />
                    {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={() => dispatch({ type: "toggle" })}
                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-slate-600 dark:text-slate-300 font-medium">Remember me</span>
                    </label>
                    <Link to="/ForgotPassword" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                      Forgot Password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-100 shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70"
                  >
                    {submitting ? "Signing in..." : "Login"}
                  </button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300 dark:border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white/80 dark:bg-slate-900/70 text-slate-500 dark:text-slate-400 font-medium">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <GoogleLoginButton />
                  </div>
                </div>

                <div className="text-center mt-6">
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                    Don’t have an account?
                    <Link to="/RegistrationForm" className="ml-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="relative z-10 p-4 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-900/60 backdrop-blur">
          Smart Travel Planner © 2025
        </footer>

          {(addressBool) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg rounded-xl p-6 sm:p-8 w-full max-w-md max-h-[80vh] overflow-y-auto scrollbar-hidden">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Create Profile</h3>
            <div className="space-y-4 sm:space-y-6">
              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                placeholder="Name"
                value={profileData.name || ""}
                onChange={(e) => setProfileData((p) => ({ ...p, name: e.target.value }))}
                aria-label="Name"
              />

              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                placeholder="Contact number"
                value={profileData.contact_number || ""}
                onChange={(e) =>
                  setProfileData((p) => ({ ...p, contact_number: e.target.value }))
                }
                aria-label="Contact number"
              />

              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                placeholder="Bio"
                value={profileData.bio || ""}
                onChange={(e) => setProfileData((p) => ({ ...p, bio: e.target.value }))}
                aria-label="Bio"
              />

              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                placeholder="Location"
                value={profileData.location || ""}
                onChange={(e) => setProfileData((p) => ({ ...p, location: e.target.value }))}
                aria-label="Location"
              />

              <label className="block">
                <select
                  className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white transition-all duration-300"
                  value={profileData.gender || ""}
                  onChange={(e) => setProfileData((p) => ({ ...p, gender: e.target.value }))}
                  aria-label="Gender"
                >
                  <option className="bg-slate-900" value="">
                    Select gender
                  </option>
                  <option className="bg-slate-900" value="M">
                    Male
                  </option>
                  <option className="bg-slate-900" value="F">
                    Female
                  </option>
                  <option className="bg-slate-900" value="O">
                    Other
                  </option>
                </select>
              </label>

              <label className="block">
                <span className="block text-sm text-white/80 mb-1">Cover image</span>
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Cover image file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setProfileData((p) => ({ ...p, cover_photo: file }));
                  }}
                  className="block w-full text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-teal-600 file:px-3 file:py-2 file:text-white file:cursor-pointer file:hover:bg-teal-700 bg-white/10 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </label>

              <label className="block">
                <span className="block text-sm text-white/80 mb-1">Profile image</span>
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Profile image file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setProfileData((p) => ({ ...p, profile_picture: file }));
                  }}
                  className="block w-full text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-teal-600 file:px-3 file:py-2 file:text-white file:cursor-pointer file:hover:bg-teal-700 bg-white/10 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </label>

              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                placeholder="Date of birth"
                type="date"
                value={profileData.date_of_birth || ""}
                onChange={(e) => setProfileData((p) => ({ ...p, date_of_birth: e.target.value }))}
                aria-label="Date of birth"
              />

              <input
                className="w-full rounded-lg border-none bg-white/10 pl-4 pr-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder:text-gray-200 transition-all duration-300"
                type="url"
                inputMode="url"
                placeholder="LinkedIn, YouTube, etc."
                value={typeof profileData.social_links === "string" ? profileData.social_links : ""}
                onChange={(e) =>
                  setProfileData((p) => ({ ...p, social_links: e.target.value }))
                }
                aria-label="Social links URL"
              />

              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                <button
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg transition-all duration-300"
                  onClick={() => {
                    // setShowEditModal(false);
                    setAddressBool(false);
                  }}
                  aria-label="Cancel editing profile"
                >
                  Cancel
                </button>
                <button
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105"
                  onClick={handleCreateProfile}
                  aria-label="Save profile changes"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        <style>{`
          @keyframes gradient-bg {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-bg {
            background-size: 200% 200%;
            animation: gradient-bg 18s ease infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
