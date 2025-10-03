import React, { useState, useRef } from "react";

const initialState = {
  profile_picture: null,
  bio: "",
  date_of_birth: "",
  gender: "",
  contact_number: "",
  location: "",
  address: "",
  social_category: "",
  social_value: "",
};

const SOCIAL_OPTIONS = [
  { value: "", label: "Select platform" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter / X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "other", label: "Other" },
];

function ProfileCreate({ onSubmit }) {
  const [form, setForm] = useState(initialState);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    setForm((s) => ({ ...s, profile_picture: file || null }));
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  };

  const validatePhone = (value) => /^\+?\d{9,15}$/.test(value);

  const buildSocialUrl = (category, value) => {
    if (!value) return "";
    const isUrl = /^https?:\/\//i.test(value);
    if (isUrl) return value;
    switch (category) {
      case "instagram":
        return `https://instagram.com/${value}`;
      case "facebook":
        return `https://facebook.com/${value}`;
      case "twitter":
        return `https://x.com/${value}`;
      case "linkedin":
        return `https://www.linkedin.com/in/${value}`;
      default:
        return value;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.contact_number && !validatePhone(form.contact_number)) {
      alert("Enter a valid phone number, digits with optional leading +, 9–15 characters.");
      return;
    }
    const data = new FormData();
    const socialUrl = buildSocialUrl(form.social_category, form.social_value);

    const payload = {
      ...form,
      facebook: form.social_category === "facebook" ? socialUrl : "",
      twitter: form.social_category === "twitter" ? socialUrl : "",
      instagram: form.social_category === "instagram" ? socialUrl : "",
      linkedin: form.social_category === "linkedin" ? socialUrl : "",
    };
    delete payload.social_category;
    delete payload.social_value;

    Object.entries(payload).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== "") data.append(k, v);
    });

    if (onSubmit) onSubmit(data);
    else {
      fetch("/api/profile/", { method: "POST", body: data })
        .then((r) => {
          if (!r.ok) throw new Error("Failed to create profile");
          return r.json();
        })
        .then(() => alert("Profile created"))
        .catch((err) => alert(err.message));
    }
  };

  const bgGradient =
    "min-h-screen w-full bg-gradient-to-b from-[#0a0f1f] via-[#0f1a33] to-[#0a0f1f]";
  const card =
    "mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl";
  const label = "block text-sm font-medium text-slate-200";
  const inputBase =
    "mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-slate-400 outline-none ring-0 focus:border-blue-400 focus:bg-white/15";
  // Solid dark select so the chosen item is visible
  const selectBase =
    "mt-1 w-full rounded-lg border border-white/10 bg-[#0b1429] text-white px-3 py-2 outline-none focus:border-blue-400 appearance-none";
  const helper = "text-xs text-slate-400 mt-1";

  return (
    <div className={bgGradient + " flex items-center justify-center p-6"}>
      <form onSubmit={handleSubmit} className={card + " p-6 sm:p-10"}>
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Create Your Profile</h1>
          <p className="mt-1 text-slate-300">Add details to personalize the account.</p>
        </header>

        {/* Profile picture */}
        <div className="mb-6">
          <label className={label}>Profile Picture</label>
          <div className="mt-2 flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full ring-1 ring-white/10 bg-white/10 flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-slate-400 text-xs">No image</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500 focus:outline-none"
              >
                Upload
              </button>
              {preview && (
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setForm((s) => ({ ...s, profile_picture: null }));
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="rounded-lg bg-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-600"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <p className={helper}>PNG, JPG up to a few MB.</p>
        </div>

        {/* Grid fields */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className={label}>Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={handleChange}
              className={inputBase}
            />
          </div>

          <div>
            <label className={label}>Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={selectBase}
            >
              <option className="bg-[#0b1429] text-white" value="">
                Select
              </option>
              <option className="bg-[#0b1429] text-white" value="M">
                Male
              </option>
              <option className="bg-[#0b1429] text-white" value="F">
                Female
              </option>
              <option className="bg-[#0b1429] text-white" value="O">
                Other
              </option>
            </select>
          </div>

          <div>
            <label className={label}>Contact Number</label>
            <input
              type="tel"
              name="contact_number"
              inputMode="tel"
              placeholder="+919876543210"
              value={form.contact_number}
              onChange={handleChange}
              className={inputBase}
              maxLength={15}
            />
            <p className={helper}>Optional; digits with optional leading +, 9–15 total.</p>
          </div>

          <div>
            <label className={label}>Location</label>
            <input
              type="text"
              name="location"
              placeholder="City, Country"
              value={form.location}
              onChange={handleChange}
              className={inputBase}
              maxLength={255}
            />
          </div>
        </div>

        {/* Social selection */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className={label}>Social Platform</label>
            <select
              name="social_category"
              value={form.social_category}
              onChange={handleChange}
              className={selectBase}
            >
              {SOCIAL_OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-[#0b1429] text-white"
                >
                  {opt.label}
                </option>
              ))}
            </select>
            <p className={helper}>Choose which link to share.</p>
          </div>

          <div>
            <label className={label}>Handle or URL</label>
            <input
              type="text"
              name="social_value"
              placeholder={
                form.social_category === "linkedin"
                  ? "username or full URL"
                  : "username (no @) or full URL"
              }
              value={form.social_value}
              onChange={handleChange}
              className={inputBase}
              maxLength={255}
            />
            <p className={helper}>Enter a handle to auto-build the URL, or paste a full link.</p>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <label className={label}>Bio</label>
          <textarea
            name="bio"
            placeholder="Tell something about yourself..."
            value={form.bio}
            onChange={handleChange}
            className={inputBase + " h-28 resize-y"}
            maxLength={500}
          />
          <div className="mt-1 text-right text-xs text-slate-400">{form.bio.length}/500</div>
        </div>

        {/* Address */}
        <div className="mt-6">
          <label className={label}>Address</label>
          <textarea
            name="address"
            placeholder="Street, City, State, Zip"
            value={form.address}
            onChange={handleChange}
            className={inputBase + " h-24 resize-y"}
          />
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setForm(initialState);
              setPreview(null);
              if (fileRef.current) fileRef.current.value = "";
            }}
            className="rounded-lg bg-slate-700 px-5 py-2.5 text-slate-200 hover:bg-slate-600"
          >
            Reset
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-white hover:bg-blue-500"
          >
            Create Profile
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileCreate;
