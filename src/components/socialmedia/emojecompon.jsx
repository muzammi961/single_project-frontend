// // EmojiPicker.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const EmojiPicker = () => {
//   const [emojis, setEmojis] = useState([]);
//   const [categories, setCategories] = useState([]);

//   const fetchEmojis = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8003/get_emojis");
//       setEmojis(res.data);
//       const uniqueCategories = [...new Set(res.data.map((e) => e.group))];
//       setCategories(uniqueCategories);
//     } catch (err) {
//       console.error("Error fetching emojis:", err);
//     }
//   };

//   useEffect(() => {
//     fetchEmojis();
//   }, []);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Pick an Emoji by Category</h2>
//       {categories.map((cat) => (
//         <div key={cat} className="mb-6">
          
//           <h3 className="text-lg font-semibold mb-2">{cat}</h3>
//           <div className="grid grid-cols-6 gap-4 text-3xl">
//             {emojis.filter((emoji) => emoji.group === cat)

//               .map((emoji) => (
//                 <span key={emoji.slug} className="cursor-pointer hover:scale-110 transition-transform"
//                   title={emoji.unicodeName}
//                 >
//                   {emoji.character}
//                 </span>
//               ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default EmojiPicker;





// Parent component controls when to show EmojiPanel
import React, { useState } from "react";
import EmojiPanel from "./emoje";

export default function EmojiPicker() {
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState("Smileys");

  return (
    <div className="max-w-lg mx-auto p-4 space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          😊 Emoji
        </button>

        <input
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Type a message"
        />
      </div>

      {open && (
        <div className="relative">
          <div className="absolute z-50">
            <EmojiPanel
            //   activeCategory={cat}
            //   onCategoryChange={setCat}
              onEmojiClick={(e) => {
                // Handle selection in parent if desired
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
