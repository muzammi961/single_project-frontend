import React from 'react';

const Dashboard = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-body text-text-light dark:text-text-dark min-h-screen">
      <div className="flex">
        {/* SideNavBar */}
        <aside className="flex flex-col w-64 bg-card-light dark:bg-card-dark p-4 shadow-md">
          <div className="flex items-center gap-3 mb-8">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCBwI1AKJ6XCFbuHnGQWo31jb5LJ2RVnjqmrlYDx2xJwn1xRJeoEZyGyO4HNCp9OTMRUIIVw_llbk87MdTgNwC0Xsq8KLmxp5gqHZiIW69-6eskBmSV_NzVGEyV4jQgZMqH5OUmYVmY8kEDP4yMd-V98UZ3lRQWHn8pkZnToS079UNe7ebHDlFSUaWIHocEzZb4os84dZ43JQY5FK8JbKugekFOgG3wAtMgvLk5yUAm5DHki26fgNjYetnI0TC1JupjTQ0p-sufVzU")'
              }}
            ></div>
            <div className="flex flex-col">
              <h1 className="text-subtext-light dark:text-subtext-dark text-sm font-normal leading-normal">
                Welcome back,
              </h1>
              <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal">
                John Doe
              </p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-2">
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 dark:bg-primary/30" href="#">
              <span className="material-symbols-outlined text-primary fill">dashboard</span>
              <p className="text-primary text-sm font-medium leading-normal">Dashboard</p>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20" href="#">
              <span className="material-symbols-outlined text-text-light dark:text-text-dark">flight_takeoff</span>
              <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal">Trips</p>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20" href="#">
              <span className="material-symbols-outlined text-text-light dark:text-text-dark">receipt_long</span>
              <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal">Expenses</p>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20" href="#">
              <span className="material-symbols-outlined text-text-light dark:text-text-dark">bar_chart</span>
              <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal">Reports</p>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20" href="#">
              <span className="material-symbols-outlined text-text-light dark:text-text-dark">settings</span>
              <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal">Settings</p>
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* PageHeading & Quick Actions */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <h1 className="text-text-light dark:text-text-dark text-4xl font-bold leading-tight tracking-tight font-heading">
                Dashboard
              </h1>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary text-white font-medium hover:bg-secondary/90 transition-all shadow-sm">
                  <span className="material-symbols-outlined">add</span>
                  New Trip
                </button>
                <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-all shadow-sm">
                  <span className="material-symbols-outlined">post_add</span>
                  Add Expense
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark shadow-sm hover:shadow-lg transition-shadow">
                <p className="text-subtext-light dark:text-subtext-dark text-base font-medium leading-normal">
                  Total Trips
                </p>
                <p className="text-text-light dark:text-text-dark tracking-light text-4xl font-bold leading-tight font-heading">
                  12
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark shadow-sm hover:shadow-lg transition-shadow">
                <p className="text-subtext-light dark:text-subtext-dark text-base font-medium leading-normal">
                  Upcoming Trips
                </p>
                <p className="text-text-light dark:text-text-dark tracking-light text-4xl font-bold leading-tight font-heading">
                  3
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark shadow-sm hover:shadow-lg transition-shadow">
                <p className="text-subtext-light dark:text-subtext-dark text-base font-medium leading-normal">
                  Total Spent
                </p>
                <p className="text-text-light dark:text-text-dark tracking-light text-4xl font-bold leading-tight font-heading">
                  $5,430
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Budget Summary Chart */}
                <div className="rounded-xl p-6 bg-card-light dark:bg-card-dark shadow-sm">
                  <h2 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight font-heading mb-4">
                    Budget Overview
                  </h2>
                  <div className="flex items-center gap-8">
                    <div className="relative size-48">
                      <svg className="size-full" viewBox="0 0 36 36">
                        <path
                          className="stroke-primary/20 dark:stroke-primary/30"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          strokeWidth="3"
                        ></path>
                        <path
                          className="stroke-primary"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          strokeDasharray="75, 100"
                          strokeLinecap="round"
                          strokeWidth="3"
                        ></path>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-subtext-light dark:text-subtext-dark text-sm">Spent</p>
                        <p className="text-text-light dark:text-text-dark text-2xl font-bold font-heading">$7,500</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary/20 dark:bg-primary/30"></div>
                        <div>
                          <p className="text-subtext-light dark:text-subtext-dark text-sm">Budgeted</p>
                          <p className="text-text-light dark:text-text-dark font-bold text-lg">$10,000</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <div>
                          <p className="text-subtext-light dark:text-subtext-dark text-sm">Spent</p>
                          <p className="text-text-light dark:text-text-dark font-bold text-lg">$7,500</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-xl p-6 bg-card-light dark:bg-card-dark shadow-sm">
                  <h2 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight font-heading mb-4">
                    Recent Activity
                  </h2>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
                          <span className="material-symbols-outlined text-primary">flight</span>
                        </div>
                        <div>
                          <p className="font-medium text-text-light dark:text-text-dark">Flight to Paris added</p>
                          <p className="text-sm text-subtext-light dark:text-subtext-dark">2 hours ago</p>
                        </div>
                      </div>
                      <p className="font-bold text-red-500">-$1,200</p>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
                          <span className="material-symbols-outlined text-primary">restaurant</span>
                        </div>
                        <div>
                          <p className="font-medium text-text-light dark:text-text-dark">Lunch at Cafe Central logged</p>
                          <p className="text-sm text-subtext-light dark:text-subtext-dark">Yesterday</p>
                        </div>
                      </div>
                      <p className="font-bold text-red-500">-$45</p>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
                          <span className="material-symbols-outlined text-primary">hotel</span>
                        </div>
                        <div>
                          <p className="font-medium text-text-light dark:text-text-dark">Hotel in Tokyo booked</p>
                          <p className="text-sm text-subtext-light dark:text-subtext-dark">3 days ago</p>
                        </div>
                      </div>
                      <p className="font-bold text-red-500">-$850</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Trip */}
              <div className="rounded-xl p-6 bg-card-light dark:bg-card-dark shadow-sm flex flex-col">
                <h2 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight font-heading mb-4">
                  Upcoming Trip
                </h2>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4">
                      <img
                        className="object-cover w-full h-full"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxUqEJYvRjBkdACTDroCW25sYlPofW1VAg6qO8YtzeIRneMOwQr6x-Up_hRNFZt7elgS1GnZbKFX0tWoGf5hxSuOBnQDgmXmL9fzUOQ2p5-dNKwmisoKMypJz3RL8vcEZT-eBfNlA8CY06VldpBpc3-Qck_2jyOD8w549i54HV6oFOrV5Uw4cYeMUTc5dK4CeSUOIGDH5h6ft3HYV3fa1Lxbs-aoMJ56ltC85AC6pTdXIrVQ7tesuWRpTzE0OO6c-meXKPvu_y04w"
                        alt="Tokyo at night with the Tokyo Tower"
                      />
                    </div>
                    <h3 className="text-lg font-bold font-heading text-text-light dark:text-text-dark">
                      Trip to Tokyo
                    </h3>
                    <p className="text-sm text-subtext-light dark:text-subtext-dark mb-4">
                      Oct 15, 2024 - Oct 22, 2024
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-light dark:text-text-dark mb-1">
                      Status: Planning in Progress
                    </p>
                    <div className="w-full bg-primary/20 dark:bg-primary/30 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: '60%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

