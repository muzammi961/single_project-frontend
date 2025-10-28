const TravelPlannerRestaurants = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-light-primary dark:text-dark-primary min-h-screen">
      <div className="relative flex min-h-screen w-full">
        {/* SideNavBar */}
        <aside className="sticky top-0 h-screen w-64 flex-col border-r border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4 hidden md:flex">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDOY1P9dI5A6xxmcZVobzrPTO0PpCLuGcLOPTCx1xmuFiNxe47AciroICpHYh1tSg-A0OIL0fqtAzhVFekkNbERqu59lWmSlcB_zf8rs7sx3zA2HMW1x775lPydzupIUBZM6SMnai33Qv-EMCRtKvpL-P9vV2OVLcKuRpOQApVu5xLsv0HkRqGzUvz1mvKY4NRWzLUn6updYP1Any8Ej0QMnunsIx-Ff1tcA54jzQkWTqF2Qd8ZGAjH4qlFHb0oOfWVw1PtZurVs5o")'
                }}
              />
              <div className="flex flex-col">
                <h1 className="text-base font-medium leading-normal text-text-light-primary dark:text-dark-primary">Alex Miller</h1>
                <p className="text-sm font-normal leading-normal text-text-light-secondary dark:text-dark-secondary">alex.miller@email.com</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2 mt-4">
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10" href="#">
                <span className="material-symbols-outlined text-text-light-secondary dark:text-dark-secondary">dashboard</span>
                <p className="text-sm font-medium leading-normal text-text-light-primary dark:text-dark-primary">Dashboard</p>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10" href="#">
                <span className="material-symbols-outlined text-text-light-secondary dark:text-dark-secondary">flight</span>
                <p className="text-sm font-medium leading-normal text-text-light-primary dark:text-dark-primary">Flights</p>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10" href="#">
                <span className="material-symbols-outlined text-text-light-secondary dark:text-dark-secondary">hotel</span>
                <p className="text-sm font-medium leading-normal text-text-light-primary dark:text-dark-primary">Hotels</p>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20" href="#">
                <span className="material-symbols-outlined text-primary font-bold">restaurant</span>
                <p className="text-sm font-medium leading-normal text-primary">Restaurants</p>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10" href="#">
                <span className="material-symbols-outlined text-text-light-secondary dark:text-dark-secondary">map</span>
                <p className="text-sm font-medium leading-normal text-text-light-primary dark:text-dark-primary">Map</p>
              </a>
            </nav>
          </div>
          <div className="mt-auto flex flex-col gap-1">
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10" href="#">
              <span className="material-symbols-outlined text-text-light-secondary dark:text-dark-secondary">settings</span>
              <p className="text-sm font-medium leading-normal text-text-light-primary dark:text-dark-primary">Settings</p>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10" href="#">
              <span className="material-symbols-outlined text-text-light-secondary dark:text-dark-secondary">logout</span>
              <p className="text-sm font-medium leading-normal text-text-light-primary dark:text-dark-primary">Logout</p>
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* PageHeading */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-text-light-primary dark:text-dark-primary">Restaurants in Paris</h1>
                <p className="text-base font-normal leading-normal text-text-light-secondary dark:text-dark-secondary">Find the best places to eat in the city.</p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* SearchBar */}
              <div className="flex-grow">
                <label className="flex flex-col min-w-40 h-12 w-full">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark">
                    <div className="text-text-light-secondary dark:text-dark-secondary flex items-center justify-center pl-4">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <input 
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-text-light-primary dark:text-dark-primary focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-text-light-secondary dark:placeholder:text-dark-secondary pl-2 text-base font-normal leading-normal" 
                      placeholder="Search restaurants by name..." 
                      value=""
                    />
                  </div>
                </label>
              </div>
              
              {/* Chips */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-4 hover:bg-primary/10 transition-colors">
                  <p className="text-sm font-medium leading-normal text-text-light-primary dark:text-dark-primary">Cuisine</p>
                  <span className="material-symbols-outlined text-text-light-secondary dark:text-dark-secondary text-base">expand_more</span>
                </button>
                <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-4 hover:bg-primary/10 transition-colors">
                  <p className="text-sm font-medium leading-normal text-text-light-primary dark:text-dark-primary">Price Range</p>
                  <span className="material-symbols-outlined text-text-light-secondary dark:text-dark-secondary text-base">expand_more</span>
                </button>
                <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-4 hover:bg-primary/10 transition-colors">
                  <p className="text-sm font-medium leading-normal text-text-light-primary dark:text-dark-primary">Rating</p>
                  <span className="material-symbols-outlined text-text-light-secondary dark:text-dark-secondary text-base">expand_more</span>
                </button>
              </div>
            </div>

            {/* Restaurant Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Highlighted Card */}
              <div className="group relative flex flex-col items-stretch justify-start rounded-xl bg-card-light dark:bg-card-dark shadow-lg ring-2 ring-secondary transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute top-0 right-0 z-10 -mt-3 -mr-3">
                  <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-bold text-white shadow-md">
                    <span className="material-symbols-outlined text-base">star</span>
                    <span>Top Rated</span>
                  </div>
                </div>
                <div 
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-t-xl"
                  style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCVAV8ngHGI0p2nCxgPKYDDS7newnWLahi8C0IK8FMRYP3pxGvuyt31abQ1PeIl4vdN5r9zAWKNkAPPm6TCcnXfUIQnjmp3xbDoFmVCz04tXDE8RhwEDyzLUaf_qiIsXIbsbm9oiOWsa2xd5llvsl6awxbbiB76uw5Gr8bc5BQg9KNeJfyrD3qZ7HGvW1Y-R7_2rUYVvV4vtVp_Ar0vyZosfUkh2Qty0jNOvDXDigt8qAxIl08iOE8jrzqTuOyHiUUhQkrJoVNTC4E")'
                  }}
                />
                <div className="flex w-full flex-grow flex-col items-stretch justify-between gap-4 p-4">
                  <div>
                    <h3 className="text-lg font-bold leading-tight tracking-tight text-text-light-primary dark:text-dark-primary">Le Cinq</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="ml-1 text-sm text-text-light-secondary dark:text-dark-secondary">5.0 (1,500 reviews)</span>
                    </div>
                    <p className="text-sm font-normal leading-normal text-text-light-secondary dark:text-dark-secondary mt-2">Open until 10 PM • 1.2 km away</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">French</span>
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Fine Dining</span>
                    </div>
                  </div>
                  <button className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal transition-colors hover:bg-primary/90">
                    <span className="truncate">View Menu</span>
                  </button>
                </div>
              </div>

              {/* Regular Card 1 */}
              <div className="group flex flex-col items-stretch justify-start rounded-xl bg-card-light dark:bg-card-dark shadow-md ring-1 ring-border-light dark:ring-border-dark transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div 
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-t-xl"
                  style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAwqpPes17B6mwNBXchr1KJZYyoCcVpukz3DQhwCgu9QQZVE1IBFrYKsKeBQnX2TdDq1xjg-fs1iU2HhzYSSSXoKg_WGbzs-rWC2Wek6rU939QJ0cHi4lkHkH-wZXsS7NKjoesaiNOWOF4dVFzDItgTvIovgGZUmpK4LFI8sMCaQOsGFtOZZhp-IQ7pg7JWKeo4R-rI7fJPIPINzkcw2TAdDXS4-tRXHQ31mhd5vKCQ3GvgrR26-14Z-l7SyVteAZFqoghK4lmYTA8")'
                  }}
                />
                <div className="flex w-full flex-grow flex-col items-stretch justify-between gap-4 p-4">
                  <div>
                    <h3 className="text-lg font-bold leading-tight tracking-tight text-text-light-primary dark:text-dark-primary">Bistro Burger</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-lg">star</span>
                      <span className="ml-1 text-sm text-text-light-secondary dark:text-dark-secondary">4.2 (850 reviews)</span>
                    </div>
                    <p className="text-sm font-normal leading-normal text-text-light-secondary dark:text-dark-secondary mt-2">Open until 11 PM • 0.5 km away</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Fast Food</span>
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Cafe</span>
                    </div>
                  </div>
                  <button className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal transition-colors hover:bg-primary/90">
                    <span className="truncate">View Menu</span>
                  </button>
                </div>
              </div>

              {/* Regular Card 2 */}
              <div className="group flex flex-col items-stretch justify-start rounded-xl bg-card-light dark:bg-card-dark shadow-md ring-1 ring-border-light dark:ring-border-dark transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div 
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-t-xl"
                  style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAbEYpSYX1WvJjBYYU0FSp4maEUW49n_HRmC_D6Qs3gcF4OeOG65XKcE0qMNE-VANatbqqXUcHiQwcVF5DMT5-hS_eUr8U8MoivfeIw3KWXPdVIeMsfvOoXGBMMEUB8dgFXEJloQIaCw2z26Nd8UAqx5MTHzxD9AvCuwMbv1fsD4fo4fa381GAZIQjMutn1vUpVGFSxY2IKTyVYFvQ6pV0pDMr0oDRoAl7CkWYUnRZbTh0Q2sQrekEEbgLt8sX__B6xS5eFs6nNPz8")'
                  }}
                />
                <div className="flex w-full flex-grow flex-col items-stretch justify-between gap-4 p-4">
                  <div>
                    <h3 className="text-lg font-bold leading-tight tracking-tight text-text-light-primary dark:text-dark-primary">Pasta Bella</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                      <span className="ml-1 text-sm text-text-light-secondary dark:text-dark-secondary">4.6 (1,230 reviews)</span>
                    </div>
                    <p className="text-sm font-normal leading-normal text-text-light-secondary dark:text-dark-secondary mt-2">Closed • Opens 6 PM</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Italian</span>
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Cozy</span>
                    </div>
                  </div>
                  <button className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal transition-colors hover:bg-primary/90">
                    <span className="truncate">View Menu</span>
                  </button>
                </div>
              </div>

              {/* Regular Card 3 */}
              <div className="group flex flex-col items-stretch justify-start rounded-xl bg-card-light dark:bg-card-dark shadow-md ring-1 ring-border-light dark:ring-border-dark transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div 
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-t-xl"
                  style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAQpD7PSPeNA_CkermlT4nlS28xu-Dg2vKd9gbrct8nfewqDY5rUFMET_ErrEJsUDCjEKmxEySqHEVquPF_wf_cLuWAPx2Gd3a4sPAyqtN1cBLK4lveAAp_khXkCmKhs6CCzp9M0n89m1R_NOXiSjYdsukAdSlGwRAFw36yYTfeXg46h_bLuCocnfao-r-o3_8_6Xa010uNRJ8TZDpqnVdLGK6vB-GSxoUiMphLLWdwx4gsnJPPXdI9ggNgvMPN9uph4pQ0kgzWr4M")'
                  }}
                />
                <div className="flex w-full flex-grow flex-col items-stretch justify-between gap-4 p-4">
                  <div>
                    <h3 className="text-lg font-bold leading-tight tracking-tight text-text-light-primary dark:text-dark-primary">Ramen House</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-lg">star</span>
                      <span className="ml-1 text-sm text-text-light-secondary dark:text-dark-secondary">4.4 (980 reviews)</span>
                    </div>
                    <p className="text-sm font-normal leading-normal text-text-light-secondary dark:text-dark-secondary mt-2">Open until 9 PM • 2.1 km away</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Japanese</span>
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Noodles</span>
                    </div>
                  </div>
                  <button className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal transition-colors hover:bg-primary/90">
                    <span className="truncate">View Menu</span>
                  </button>
                </div>
              </div>

              {/* Regular Card 4 */}
              <div className="group flex flex-col items-stretch justify-start rounded-xl bg-card-light dark:bg-card-dark shadow-md ring-1 ring-border-light dark:ring-border-dark transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div 
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-t-xl"
                  style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZ28y_KbpUGEuddequ8Ven4c0x_TTiNTABSk7ZYy_v5SkljuHFEQZeVkYvxqmylEL967D7gXFouWYXdAK4lDKoTxEMRhmlltAWfdTLJMO4QlyDQR-txQGKIPlCXZAESiHKhkJqWwdw6Twygu9G9wVIbTXXIzO6MSLdrUYIiygzDH2Z_nDDIVj0MzlwRW0F1vEDZq8Y1mZsVggYd0Pz6MM3H7mMPBgn1QP5vKj2pPiIRQc64Rc6b7MjXiau9Vf2QlwAkEtILW5ISww")'
                  }}
                />
                <div className="flex w-full flex-grow flex-col items-stretch justify-between gap-4 p-4">
                  <div>
                    <h3 className="text-lg font-bold leading-tight tracking-tight text-text-light-primary dark:text-dark-primary">Taco Fiesta</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                      <span className="ml-1 text-sm text-text-light-secondary dark:text-dark-secondary">4.7 (2,100 reviews)</span>
                    </div>
                    <p className="text-sm font-normal leading-normal text-text-light-secondary dark:text-dark-secondary mt-2">Open 24 hours • 3.5 km away</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Mexican</span>
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Street Food</span>
                    </div>
                  </div>
                  <button className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal transition-colors hover:bg-primary/90">
                    <span className="truncate">View Menu</span>
                  </button>
                </div>
              </div>

              {/* Regular Card 5 */}
              <div className="group flex flex-col items-stretch justify-start rounded-xl bg-card-light dark:bg-card-dark shadow-md ring-1 ring-border-light dark:ring-border-dark transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div 
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-t-xl"
                  style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAbmftFYB7B5TMSOVh9gjt4ivzfYIVkPHJXg1hIUWrCxzCIQnCp6n0eVfbLocatAQOYr-UZCBVYXc8SB0Uh7GI3EpA_i4FEl9azLstXO3AnsQHXwtvBfsSHsata0ylY4jNsVZvFZYLlqKPdk6hT0zFARg4aAalEj-oHKzcJPxXvonBf64zUwMLN7kTi5iajgfDXDSFwlpde4mQKAChlVU4WcVWbdIEnycjxfuFqmbRa4mGu3hDW8RRNFl1Fep2L3kBj9l2GVMKlGQc")'
                  }}
                />
                <div className="flex w-full flex-grow flex-col items-stretch justify-between gap-4 p-4">
                  <div>
                    <h3 className="text-lg font-bold leading-tight tracking-tight text-text-light-primary dark:text-dark-primary">The Green Leaf</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-lg">star</span>
                      <span className="ml-1 text-sm text-text-light-secondary dark:text-dark-secondary">4.3 (765 reviews)</span>
                    </div>
                    <p className="text-sm font-normal leading-normal text-text-light-secondary dark:text-dark-secondary mt-2">Open until 8 PM • 1.8 km away</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Vegan</span>
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Healthy</span>
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Salads</span>
                    </div>
                  </div>
                  <button className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal transition-colors hover:bg-primary/90">
                    <span className="truncate">View Menu</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <button className="flex h-10 items-center justify-center gap-x-2 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-6 text-sm font-medium leading-normal text-text-light-primary dark:text-dark-primary shadow-sm transition-colors hover:bg-primary/10">
                Load More
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TravelPlannerRestaurants;