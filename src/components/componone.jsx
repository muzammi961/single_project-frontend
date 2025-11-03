function MyMap(){



  return(<>
   <div class="max-w-sm bg-gray-800 rounded-2xl overflow-hidden shadow-lg relative text-white">

    <div class="relative">
      <img
        class="w-full h-56 object-cover"
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600"
        alt="Munnar Hills"
      />

      <div class="absolute top-3 right-3 flex items-center bg-yellow-400 text-gray-900 text-sm font-semibold px-2 py-1 rounded-full">
        ⭐ <span class="ml-1">3.2</span>
      </div>
    </div>


    <div class="p-4">
      <h2 class="text-lg font-bold">Trekking through Munnar Hills</h2>
      <p class="text-gray-400 text-sm">Munnar, Kerala</p>

      <div class="flex items-center justify-between mt-4 text-gray-300 text-sm">
        <div class="flex items-center gap-2">
          <span class="text-gray-400">⚙️</span> Adventure
        </div>
        <p>10/28/2025</p>
      </div>
    </div>


    <div class="absolute bottom-20 right-4 flex gap-2">
      <button class="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full hover:bg-gray-700 transition">
        ❤️ <span class="text-sm">0</span>
      </button>
      <button class="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full hover:bg-gray-700 transition">
        💬 <span class="text-sm">0</span>
      </button>
    </div>
  </div>
  
  
  </>)
}

export default MyMap