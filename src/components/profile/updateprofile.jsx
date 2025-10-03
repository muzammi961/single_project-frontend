// import React, { useEffect, useMemo, useRef, useState } from "react";

// const SOCIAL_OPTIONS = [
//   { value: "", label: "Select platform" },
//   { value: "instagram", label: "Instagram" },
//   { value: "facebook", label: "Facebook" },
//   { value: "twitter", label: "Twitter / X" },
//   { value: "linkedin", label: "LinkedIn" },
//   { value: "other", label: "Other" },
// ];

// function ProfileUpdate({ initial = {}, onSubmit, endpoint = "/api/profile/", method = "PATCH" }) {
//   const initialSocial = useMemo(() => {
//     if (initial.instagram) return { social_category: "instagram", social_value: initial.instagram };
//     if (initial.facebook) return { social_category: "facebook", social_value: initial.facebook };
//     if (initial.twitter) return { social_category: "twitter", social_value: initial.twitter };
//     if (initial.linkedin) return { social_category: "linkedin", social_value: initial.linkedin };
//     return { social_category: "", social_value: "" };
//   }, [initial]);

//   const [form, setForm] = useState({
//     profile_picture: null,
//     bio: initial.bio || "",
//     date_of_birth: initial.date_of_birth || "",
//     gender: initial.gender || "",
//     contact_number: initial.contact_number || "",
//     location: initial.location || "",
//     address: initial.address || "",
//     social_category: initialSocial.social_category,
//     social_value: initialSocial.social_value,
//   });
//   const [preview, setPreview] = useState(initial.profile_picture_url || null);
//   const [removePhoto, setRemovePhoto] = useState(false);
//   const fileRef = useRef(null);

//   useEffect(() => {
//     return () => {
//       if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
//     };
//   }, [preview]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((s) => ({ ...s, [name]: value }));
//   };

//   const handleFile = (e) => {
//     const file = e.target.files?.[0];
//     setForm((s) => ({ ...s, profile_picture: file || null }));
//     setRemovePhoto(false);
//     if (file) setPreview(URL.createObjectURL(file));
//   };

//   const validatePhone = (value) => /^\+?\d{9,15}$/.test(value);

//   const buildSocialUrl = (category, value) => {
//     if (!value) return "";
//     const isUrl = /^https?:\/\//i.test(value);
//     if (isUrl) return value;
//     switch (category) {
//       case "instagram":
//         return `https://instagram.com/${value}`;
//       case "facebook":
//         return `https://facebook.com/${value}`;
//       case "twitter":
//         return `https://x.com/${value}`;
//       case "linkedin":
//         return `https://www.linkedin.com/in/${value}`;
//       default:
//         return value;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (form.contact_number && !validatePhone(form.contact_number)) {
//       alert("Enter a valid phone number, digits with optional leading +, 9–15 characters.");
//       return;
//     }

//     const socialUrl = buildSocialUrl(form.social_category, form.social_value);
//     const data = new FormData();

//     const appendIf = (key, val, original) => {
//       const hasChanged = val !== undefined && val !== original;
//       if (hasChanged && val !== "") data.append(key, val);
//       if (hasChanged && val === "" && original) data.append(key, "");
//     };

//     appendIf("bio", form.bio, initial.bio || "");
//     appendIf("date_of_birth", form.date_of_birth, initial.date_of_birth || "");
//     appendIf("gender", form.gender, initial.gender || "");
//     appendIf("contact_number", form.contact_number, initial.contact_number || "");
//     appendIf("location", form.location, initial.location || "");
//     appendIf("address", form.address, initial.address || "");

//     const socialMap = {
//       facebook: "",
//       twitter: "",
//       instagram: "",
//       linkedin: "",
//     };
//     if (form.social_category && socialUrl) {
//       socialMap[form.social_category] = socialUrl;
//     }

//     appendIf("facebook", socialMap.facebook, initial.facebook || "");
//     appendIf("twitter", socialMap.twitter, initial.twitter || "");
//     appendIf("instagram", socialMap.instagram, initial.instagram || "");
//     appendIf("linkedin", socialMap.linkedin, initial.linkedin || "");

//     if (form.profile_picture) {
//       data.append("profile_picture", form.profile_picture);
//     } else if (removePhoto) {
//       data.append("profile_picture", "");
//     }

//     try {
//       if (onSubmit) {
//         await onSubmit(data);
//       } else {
//         const res = await fetch(endpoint, { method, body: data });
//         if (!res.ok) throw new Error("Failed to update profile");
//         await res.json();
//       }
//       alert("Profile updated");
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const label = "block text-sm font-medium text-slate-200";
//   const inputBase = "mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2.5 text-base text-white placeholder-slate-400 outline-none ring-0 focus:border-blue-400 focus:bg-white/15 transition-colors duration-200";
//   const selectBase = "mt-1 w-full rounded-lg border border-white/10 bg-[#0b1429] text-white px-3 py-2.5 text-base outline-none focus:border-blue-400 appearance-none transition-colors duration-200";
//   const helper = "text-xs text-slate-400 mt-1";

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-b from-[#0a0f1f] via-[#0f1a33] to-[#0a0f1f]">
//       <form onSubmit={handleSubmit} className="w-full">
        
//         {/* Header */}
//         <header className="w-full bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-6 sm:py-8 text-center">
//           <h1 className="text-2xl sm:text-3xl font-semibold text-white">Update Profile</h1>
//           <p className="mt-1 text-sm sm:text-base text-slate-300">Edit details and save changes.</p>
//         </header>

//         {/* Profile Picture Section */}
//         <div className="w-full bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-6 sm:py-8">
//           <div className="max-w-4xl mx-auto">
//             <label className={label + " mb-3"}>Profile Picture</label>
//             <div className="flex flex-col sm:flex-row items-center gap-4">
//               <div className="h-24 w-24 sm:h-20 sm:w-20 overflow-hidden rounded-full ring-2 ring-white/10 bg-white/10 flex items-center justify-center flex-shrink-0">
//                 {preview ? (
//                   <img src={preview} alt="Preview" className="h-full w-full object-cover" />
//                 ) : (
//                   <span className="text-slate-400 text-xs">No image</span>
//                 )}
//               </div>
//               <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
//                 <button
//                   type="button"
//                   onClick={() => fileRef.current?.click()}
//                   className="w-full sm:w-auto rounded-lg bg-blue-600 px-6 py-2.5 text-sm text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
//                 >
//                   Replace
//                 </button>
//                 {preview && (
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setPreview(null);
//                       setRemovePhoto(true);
//                       setForm((s) => ({ ...s, profile_picture: null }));
//                       if (fileRef.current) fileRef.current.value = "";
//                     }}
//                     className="w-full sm:w-auto rounded-lg bg-slate-700 px-6 py-2.5 text-sm text-slate-200 hover:bg-slate-600 focus:outline-none transition-all duration-200"
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>
//             </div>
//             <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
//             <p className={helper}>PNG, JPG up to a few MB.</p>
//           </div>
//         </div>

//         {/* Personal Information Section */}
//         <div className="w-full bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-6 sm:py-8">
//           <div className="max-w-4xl mx-auto">
//             <h2 className="text-lg font-semibold text-white mb-5">Personal Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
//               <div>
//                 <label className={label}>Date of Birth</label>
//                 <input
//                   type="date"
//                   name="date_of_birth"
//                   value={form.date_of_birth}
//                   onChange={handleChange}
//                   className={inputBase}
//                 />
//               </div>

//               <div>
//                 <label className={label}>Gender</label>
//                 <select name="gender" value={form.gender} onChange={handleChange} className={selectBase}>
//                   <option className="bg-[#0b1429] text-white" value="">Select</option>
//                   <option className="bg-[#0b1429] text-white" value="M">Male</option>
//                   <option className="bg-[#0b1429] text-white" value="F">Female</option>
//                   <option className="bg-[#0b1429] text-white" value="O">Other</option>
//                 </select>
//               </div>

//               <div>
//                 <label className={label}>Contact Number</label>
//                 <input
//                   type="tel"
//                   name="contact_number"
//                   inputMode="tel"
//                   placeholder="+919876543210"
//                   value={form.contact_number}
//                   onChange={handleChange}
//                   className={inputBase}
//                   maxLength={15}
//                 />
//                 <p className={helper}>Digits with optional leading +, 9–15 total.</p>
//               </div>

//               <div>
//                 <label className={label}>Location</label>
//                 <input
//                   type="text"
//                   name="location"
//                   placeholder="City, Country"
//                   value={form.location}
//                   onChange={handleChange}
//                   className={inputBase}
//                   maxLength={255}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Social Links Section */}
//         <div className="w-full bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-6 sm:py-8">
//           <div className="max-w-4xl mx-auto">
//             <h2 className="text-lg font-semibold text-white mb-5">Social Links</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
//               <div>
//                 <label className={label}>Social Platform</label>
//                 <select
//                   name="social_category"
//                   value={form.social_category}
//                   onChange={handleChange}
//                   className={selectBase}
//                 >
//                   {SOCIAL_OPTIONS.map((opt) => (
//                     <option key={opt.value} value={opt.value} className="bg-[#0b1429] text-white">
//                       {opt.label}
//                     </option>
//                   ))}
//                 </select>
//                 <p className={helper}>Choose which link to display.</p>
//               </div>

//               <div>
//                 <label className={label}>Handle or URL</label>
//                 <input
//                   type="text"
//                   name="social_value"
//                   placeholder={
//                     form.social_category === "linkedin"
//                       ? "username or full URL"
//                       : "username (no @) or full URL"
//                   }
//                   value={form.social_value}
//                   onChange={handleChange}
//                   className={inputBase}
//                   maxLength={255}
//                 />
//                 <p className={helper}>Enter a handle to auto-build the URL, or paste a full link.</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bio & Address Section */}
//         <div className="w-full bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-6 sm:py-8">
//           <div className="max-w-4xl mx-auto">
//             <h2 className="text-lg font-semibold text-white mb-5">About & Address</h2>
            
//             <div className="mb-6">
//               <label className={label}>Bio</label>
//               <textarea
//                 name="bio"
//                 placeholder="Tell something about yourself..."
//                 value={form.bio}
//                 onChange={handleChange}
//                 className={inputBase + " h-28 resize-y"}
//                 maxLength={500}
//               />
//               <div className="mt-1 text-right text-xs text-slate-400">{form.bio.length}/500</div>
//             </div>

//             <div>
//               <label className={label}>Address</label>
//               <textarea
//                 name="address"
//                 placeholder="Street, City, State, Zip"
//                 value={form.address}
//                 onChange={handleChange}
//                 className={inputBase + " h-24 resize-y"}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Actions Section */}
//         <div className="w-full bg-white/5 backdrop-blur-md px-6 py-6 sm:py-8">
//           <div className="max-w-4xl mx-auto flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
//             <button
//               type="button"
//               onClick={() => {
//                 setForm({
//                   profile_picture: null,
//                   bio: initial.bio || "",
//                   date_of_birth: initial.date_of_birth || "",
//                   gender: initial.gender || "",
//                   contact_number: initial.contact_number || "",
//                   location: initial.location || "",
//                   address: initial.address || "",
//                   social_category: initialSocial.social_category,
//                   social_value: initialSocial.social_value,
//                 });
//                 setPreview(initial.profile_picture_url || null);
//                 setRemovePhoto(false);
//                 if (fileRef.current) fileRef.current.value = "";
//               }}
//               className="w-full sm:w-auto rounded-lg bg-slate-700 px-6 py-3 text-slate-200 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400/50 transition-all duration-200"
//             >
//               Revert Changes
//             </button>
//             <button
//               type="submit"
//               className="w-full sm:w-auto rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>

//       </form>
//     </div>
//   );
// }

// export default ProfileUpdate;







import React, { useEffect, useMemo, useRef, useState } from "react";

const SOCIAL_OPTIONS = [
  { value: "", label: "Select platform" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter / X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "other", label: "Other" },
];

function ProfileUpdate({ initial = {}, onSubmit, endpoint = "/api/profile/", method = "PATCH" }) {
  const initialSocial = useMemo(() => {
    if (initial.instagram) return { social_category: "instagram", social_value: initial.instagram };
    if (initial.facebook) return { social_category: "facebook", social_value: initial.facebook };
    if (initial.twitter) return { social_category: "twitter", social_value: initial.twitter };
    if (initial.linkedin) return { social_category: "linkedin", social_value: initial.linkedin };
    return { social_category: "", social_value: "" };
  }, [initial]);

  const [form, setForm] = useState({
    profile_picture: null,
    bio: initial.bio || "",
    date_of_birth: initial.date_of_birth || "",
    gender: initial.gender || "",
    contact_number: initial.contact_number || "",
    location: initial.location || "",
    address: initial.address || "",
    social_category: initialSocial.social_category,
    social_value: initialSocial.social_value,
  });
  const [preview, setPreview] = useState(initial.profile_picture_url || null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    setForm((s) => ({ ...s, profile_picture: file || null }));
    setRemovePhoto(false);
    if (file) setPreview(URL.createObjectURL(file));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.contact_number && !validatePhone(form.contact_number)) {
      alert("Enter a valid phone number, digits with optional leading +, 9–15 characters.");
      return;
    }

    setIsSubmitting(true);
    const socialUrl = buildSocialUrl(form.social_category, form.social_value);
    const data = new FormData();

    const appendIf = (key, val, original) => {
      const hasChanged = val !== undefined && val !== original;
      if (hasChanged && val !== "") data.append(key, val);
      if (hasChanged && val === "" && original) data.append(key, "");
    };

    appendIf("bio", form.bio, initial.bio || "");
    appendIf("date_of_birth", form.date_of_birth, initial.date_of_birth || "");
    appendIf("gender", form.gender, initial.gender || "");
    appendIf("contact_number", form.contact_number, initial.contact_number || "");
    appendIf("location", form.location, initial.location || "");
    appendIf("address", form.address, initial.address || "");

    const socialMap = {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    };
    if (form.social_category && socialUrl) {
      socialMap[form.social_category] = socialUrl;
    }

    appendIf("facebook", socialMap.facebook, initial.facebook || "");
    appendIf("twitter", socialMap.twitter, initial.twitter || "");
    appendIf("instagram", socialMap.instagram, initial.instagram || "");
    appendIf("linkedin", socialMap.linkedin, initial.linkedin || "");

    if (form.profile_picture) {
      data.append("profile_picture", form.profile_picture);
    } else if (removePhoto) {
      data.append("profile_picture", "");
    }

    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        const res = await fetch(endpoint, { method, body: data });
        if (!res.ok) throw new Error("Failed to update profile");
        await res.json();
      }
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced styling
  const label = "block text-sm font-medium text-slate-300 mb-2";
  const inputBase = "mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-white placeholder-slate-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20";
  const selectBase = "mt-1 w-full rounded-xl border border-white/15 bg-[#0f172a] text-white px-4 py-3.5 text-base outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none";
  const helper = "text-xs text-slate-400 mt-2";
  const sectionTitle = "text-xl font-bold text-white mb-6 pb-3 border-b border-white/10";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <form onSubmit={handleSubmit} className="w-full">
        
        {/* Enhanced Header */}
        <header className="w-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border-b border-white/10 px-6 py-8 sm:py-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Update Profile</h1>
            <p className="text-slate-300 text-lg">Edit your personal information and preferences</p>
          </div>
        </header>

        {/* Profile Picture Section */}
        <div className="w-full bg-white/5 backdrop-blur-lg border-b border-white/10 px-6 py-8 sm:py-10">
          <div className="max-w-4xl mx-auto">
            <h2 className={sectionTitle}>Profile Picture</h2>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <div className="h-28 w-28 overflow-hidden rounded-2xl ring-4 ring-white/20 ring-offset-2 ring-offset-slate-900 bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-lg">
                  {preview ? (
                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-slate-400 text-sm">No image</span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Preview</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3.5 text-white font-medium hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Replace Photo
                  </span>
                </button>
                {preview && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setRemovePhoto(true);
                      setForm((s) => ({ ...s, profile_picture: null }));
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    className="w-full sm:w-auto rounded-xl bg-slate-700/80 px-6 py-3.5 text-slate-200 font-medium hover:bg-slate-600/80 focus:outline-none focus:ring-2 focus:ring-slate-500/50 border border-slate-600/50 transition-all duration-300"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <p className={helper}>PNG, JPG, GIF up to 10MB. Recommended: 1:1 aspect ratio.</p>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="w-full bg-white/5 backdrop-blur-lg border-b border-white/10 px-6 py-8 sm:py-10">
          <div className="max-w-4xl mx-auto">
            <h2 className={sectionTitle}>Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
              <div className="space-y-2">
                <label className={label}>
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Date of Birth
                  </span>
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth}
                  onChange={handleChange}
                  className={inputBase}
                />
              </div>

              <div className="space-y-2">
                <label className={label}>
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Gender
                  </span>
                </label>
                <select name="gender" value={form.gender} onChange={handleChange} className={selectBase}>
                  <option className="bg-slate-800 text-white" value="">Select Gender</option>
                  <option className="bg-slate-800 text-white" value="M">Male</option>
                  <option className="bg-slate-800 text-white" value="F">Female</option>
                  <option className="bg-slate-800 text-white" value="O">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className={label}>
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Contact Number
                  </span>
                </label>
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
                <p className={helper}>Digits with optional leading +, 9–15 total characters</p>
              </div>

              <div className="space-y-2">
                <label className={label}>
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location
                  </span>
                </label>
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
          </div>
        </div>

        {/* Social Links Section */}
        <div className="w-full bg-white/5 backdrop-blur-lg border-b border-white/10 px-6 py-8 sm:py-10">
          <div className="max-w-4xl mx-auto">
            <h2 className={sectionTitle}>Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
              <div className="space-y-2">
                <label className={label}>Social Platform</label>
                <select
                  name="social_category"
                  value={form.social_category}
                  onChange={handleChange}
                  className={selectBase}
                >
                  {SOCIAL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-slate-800 text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className={helper}>Choose which social platform to display</p>
              </div>

              <div className="space-y-2">
                <label className={label}>Handle or URL</label>
                <input
                  type="text"
                  name="social_value"
                  placeholder={
                    form.social_category === "linkedin"
                      ? "username or full URL"
                      : form.social_category === "other"
                      ? "Enter full URL"
                      : "username (no @) or full URL"
                  }
                  value={form.social_value}
                  onChange={handleChange}
                  className={inputBase}
                  maxLength={255}
                />
                <p className={helper}>
                  {form.social_category === "other" 
                    ? "Enter the complete URL" 
                    : "Enter username to auto-build URL, or paste full link"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bio & Address Section */}
        <div className="w-full bg-white/5 backdrop-blur-lg border-b border-white/10 px-6 py-8 sm:py-10">
          <div className="max-w-4xl mx-auto">
            <h2 className={sectionTitle}>About & Address</h2>
            
            <div className="mb-8 space-y-2">
              <label className={label}>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Bio
                </span>
              </label>
              <textarea
                name="bio"
                placeholder="Tell us something about yourself, your interests, or professional background..."
                value={form.bio}
                onChange={handleChange}
                className={inputBase + " h-32 resize-y"}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <p className={helper}>Brief description about yourself</p>
                <div className={`text-xs ${form.bio.length > 480 ? 'text-red-400' : 'text-slate-400'}`}>
                  {form.bio.length}/500
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className={label}>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Address
                </span>
              </label>
              <textarea
                name="address"
                placeholder="Street address, City, State, ZIP/Postal Code, Country"
                value={form.address}
                onChange={handleChange}
                className={inputBase + " h-28 resize-y"}
                maxLength={500}
              />
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="w-full bg-white/5 backdrop-blur-lg px-6 py-8 sm:py-10">
          <div className="max-w-4xl mx-auto flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                setForm({
                  profile_picture: null,
                  bio: initial.bio || "",
                  date_of_birth: initial.date_of_birth || "",
                  gender: initial.gender || "",
                  contact_number: initial.contact_number || "",
                  location: initial.location || "",
                  address: initial.address || "",
                  social_category: initialSocial.social_category,
                  social_value: initialSocial.social_value,
                });
                setPreview(initial.profile_picture_url || null);
                setRemovePhoto(false);
                if (fileRef.current) fileRef.current.value = "";
              }}
              className="w-full sm:w-auto rounded-xl bg-slate-700/80 px-8 py-4 text-slate-200 font-medium hover:bg-slate-600/80 focus:outline-none focus:ring-2 focus:ring-slate-500/50 border border-slate-600/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Revert Changes
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-4 text-white font-semibold hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}

export default ProfileUpdate;