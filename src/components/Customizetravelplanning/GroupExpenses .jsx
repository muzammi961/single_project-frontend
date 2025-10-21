import React from 'react';

const GroupExpenses = () => {
  const expenses = [
    {
      id: 1,
      title: "Dinner at The Grand",
      description: "Paid by Jane",
      amount: "$120.00",
      date: "Oct 26",
      icon: "restaurant"
    },
    {
      id: 2,
      title: "Groceries",
      description: "Paid by John",
      amount: "$85.50",
      date: "Oct 25",
      icon: "shopping_cart"
    },
    {
      id: 3,
      title: "Gas",
      description: "Paid by Alice",
      amount: "$55.25",
      date: "Oct 25",
      icon: "local_gas_station"
    }
  ];

  const balances = [
    { id: 1, description: "John owes Jane", amount: "$25.50" },
    { id: 2, description: "Bob owes Alice", amount: "$12.75" },
    { id: 3, description: "John owes Alice", amount: "$5.00" }
  ];

  const participants = [
    {
      id: 1,
      name: "John (You)",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvEF-sE4EOocuoFS-BCkd8QSkl0insikMToZvNX2AvEKAo-BCQnmxbidUaM6RF_VwRyKTtFBLcNqTGFkisP27F7echiZe4zhlSWPi8PKfxNwjs5IE2YjO1SlFp8Il3lUhVAVsQXgSxBKFKy5yMygRSWhV_S8ftuX5hI-GAgK3_sn9nQNlYCBr1uHezhh58iGazsM_saRZCvh_etwbg3Yl4gpmdvHtYEJCZuQw2J7aPnof859fUtv9LkNlhoqSAfKpxwQcjF3MugzI"
    },
    {
      id: 2,
      name: "Jane",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSMmWajY0H6uRO8HH7U9EoFOhX9HhJreLffpHnWKCEUqNUEfaGgsd2QeylVvi1DQ62NqT9m9iLY072EHkyOZzExcBK9b3XViJXD1-5r3E0LXVwKHOJTOYhjtKUZuabdsGS82G9H-1KRVwJiUPgPxDxxYdQSr8fP1AR7mW3vdFzdQbFDBUfK0QSEjZID4VNmoGW-Rrn3QXWEohvTy82w55bgLwR9ksb4esZoraUM6yA6RPTUGCk8hNFclAG5sZlpOJbHXITh7qVYME"
    },
    {
      id: 3,
      name: "Alice",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2RJZGyAY4yx5dquFYHafnxsHdmNM_ybOM5uQuATUbSp8lhikz8qFCAx9sd3n1e2WmGbpR_MCuyK5UXMnmk83WPQZ0qdqhDZSgEUQXjJIJ5hE_m9hgsPTA48Th8G9ss5nabOXl1dX2PH_rr7m8Ega8_8qY6VvegV9dP4o0zXnHSTN0xvsgx6FDJG2mHf-xEtVjjJPur4VVucuZ90B56gPTDaw2bOm1o1HQzHBWRSaZ2ZHLdMiy1pbdXvUajKOG_oNz_ApRhmSl7MI"
    },
    {
      id: 4,
      name: "Bob",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQyXs9qoxoiSkmSmWNCGZMCV6pVLOAlAjbsUA9iEetXOnXTGpC-N24lwfpZb0o7sXemFOnoPKzIyDW2K3Qz4P6d0DIouJ0VxllJsnTT5fBwtByVQqz_GflAtgxiEnZluJGt7nTyZ0gXHbz1e2WQqpFMdTDbdNkiXU9xjJWcerqh_T1TO3kBL9JGeJP4mj8bY_bkcLx6cSpQtnfO9joY4xk6y_pX8E0KTWSklUEohFde6h0WP3CQ0g7tyblbe7IItgWlZf9CGnkttg"
    }
  ];

  const user = {
    name: "John Doe",
    email: "john.doe@email.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCy-DW34b52BRgLIJwXlJaqCOJJrq65JL_hfKPCvKDoJ6quR0GIYrfAdt5s0ctQGBMuyZd0tfGP0fj7e4rz4v2atGDOR65qzxzleNfvevZXt2ji96RnVjhZ_Y5eNLG2RShB1uRmzZ4lovaoav0266aV2rXtqS2cQPYrw428e277Q2qn7rWxQuCyIoU0TbJxexPoDYMhXudjCxar-WLDEOZMgzEVcClCjMANXX02tcpgKo2ZiLwR62fUQbJ_pO33s64ydPdRC7BNsms"
  };

  return (
    <div className="flex h-screen font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-light dark:bg-neutral-dark p-4 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{ backgroundImage: `url("${user.avatar}")` }}
              alt="User's avatar"
            ></div>
            <div>
              <h1 className="text-base font-bold">{user.name}</h1>
              <p className="text-sm text-medium-gray">{user.email}</p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-2">
            <a className="flex items-center gap-3 px-3 py-2 text-medium-gray hover:bg-primary/10 rounded-lg" href="#">
              <span className="material-symbols-outlined">dashboard</span>
              <p className="text-sm font-medium">Dashboard</p>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 bg-primary/20 text-primary rounded-lg" href="#">
              <span className="material-symbols-outlined">group</span>
              <p className="text-sm font-medium">Group Expenses</p>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-medium-gray hover:bg-primary/10 rounded-lg" href="#">
              <span className="material-symbols-outlined">flight</span>
              <p className="text-sm font-medium">Trips</p>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-medium-gray hover:bg-primary/10 rounded-lg" href="#">
              <span className="material-symbols-outlined">settings</span>
              <p className="text-sm font-medium">Settings</p>
            </a>
          </nav>
        </div>
        
        <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold tracking-[0.015em] hover:bg-primary/90 transition-colors">
          <span className="truncate">New Trip</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <h1 className="text-4xl font-black tracking-[-0.033em]">Weekend Trip to the Mountains</h1>
            <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary/20 text-primary text-sm font-bold tracking-[0.015em] hover:bg-primary/30 transition-colors">
              <span className="material-symbols-outlined mr-2">person_add</span>
              <span className="truncate">Invite</span>
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Expenses Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Expenses</h2>
                <button className="flex items-center justify-center rounded-full h-14 w-14 lg:w-auto lg:rounded-lg lg:px-6 bg-primary text-white text-base font-bold shadow-lg hover:bg-primary/90 transition-all duration-300 group">
                  <span className="material-symbols-outlined">add</span>
                  <span className="truncate hidden lg:inline ml-2">Add Expense</span>
                </button>
              </div>

              <div className="bg-neutral-light dark:bg-neutral-dark p-4 rounded-lg shadow-md space-y-2">
                {expenses.map((expense) => (
                  <div key={expense.id}>
                    <div className="flex items-center gap-4 py-2 justify-between hover:bg-background-light dark:hover:bg-background-dark rounded-md transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="text-text-light dark:text-text-dark flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12">
                          <span className="material-symbols-outlined">{expense.icon}</span>
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="text-base font-medium line-clamp-1">{expense.title}</p>
                          <p className="text-medium-gray text-sm font-normal line-clamp-2">{expense.description}</p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-base font-bold">{expense.amount}</p>
                        <p className="text-xs text-medium-gray">{expense.date}</p>
                      </div>
                    </div>
                    {expense.id !== expenses.length && (
                      <hr className="border-gray-200 dark:border-gray-700" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Final Balances Card */}
              <div className="bg-neutral-light dark:bg-neutral-dark p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Final Balances</h3>
                <div className="space-y-3">
                  {balances.map((balance) => (
                    <div key={balance.id} className="flex justify-between items-center">
                      <p>{balance.description}</p>
                      <span className="font-bold text-green-500">{balance.amount}</span>
                    </div>
                  ))}
                  <button className="w-full mt-4 flex items-center justify-center rounded-lg h-10 px-4 bg-secondary text-white text-sm font-bold tracking-wider hover:bg-secondary/90 transition-colors">
                    Settle Up All
                  </button>
                </div>
              </div>

              {/* Participants Card */}
              <div className="bg-neutral-light dark:bg-neutral-dark p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Participants</h3>
                <div className="space-y-4">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3">
                      <div 
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                        style={{ backgroundImage: `url("${participant.avatar}")` }}
                        alt={`${participant.name}'s avatar`}
                      ></div>
                      <p className="font-medium">{participant.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GroupExpenses;