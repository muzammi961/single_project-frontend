import React, { useState } from 'react';

const Payments = () => {
  const [transactions] = useState([
    {
      id: 1,
      date: '2023-10-26',
      description: 'Flight to New York',
      amount: '$542.00',
      status: 'Completed',
      statusColor: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
    },
    {
      id: 2,
      date: '2023-10-25',
      description: 'Hotel in New York',
      amount: '$1200.00',
      status: 'Completed',
      statusColor: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
    },
    {
      id: 3,
      date: '2023-10-24',
      description: 'Conference Ticket',
      amount: '$350.00',
      status: 'Completed',
      statusColor: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
    },
    {
      id: 4,
      date: '2023-10-23',
      description: 'Dinner with client',
      amount: '$150.00',
      status: 'Pending',
      statusColor: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
    },
    {
      id: 5,
      date: '2023-10-22',
      description: 'Taxi to airport',
      amount: '$60.00',
      status: 'Failed',
      statusColor: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
    }
  ]);

  const handleNewExpense = () => {
    console.log('New Expense clicked');
    // Add new expense logic here
  };

  const handlePayNow = () => {
    console.log('Pay Now clicked');
    // Add payment logic here
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display">
      <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800">
            <div className="flex h-full min-h-[700px] flex-col justify-between p-4">
              <div className="flex flex-col gap-4">
                {/* User Profile */}
                <div className="flex items-center gap-3 p-2">
                  <div 
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                    style={{ 
                      backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDBNBF3yZ0iYXIFXAf0xs7tONqa05sYvf1rBz2KahpAnf9j256FUQc0zduiCNTHUnsldnrOpFI4HNTSJroBwuLlVj_tmguJLQHoBw9A04L_P_Vb7HblinUpS7Dir7FvNP75a_BuFz5kgF6-5V8ABaT4_JGVJ-Ks4FzrcrKUj-AZjApA4vlP0WKukun6fyJP44H_Fthhl5t_lRAOTZd2G9iJ4flddFxR9XcsEjSU7AUqX5BTZyldMv2YGW66IUAQf0SqLQCuU3gq5bY")' 
                    }}
                  ></div>
                  <div className="flex flex-col">
                    <h1 className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal">John Doe</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">john.doe@email.com</p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex flex-col gap-1 mt-4">
                  <a className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg" href="#">
                    <span className="material-symbols-outlined text-xl">dashboard</span>
                    <p className="text-sm font-medium">Dashboard</p>
                  </a>
                  <a className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg" href="#">
                    <span className="material-symbols-outlined text-xl">receipt_long</span>
                    <p className="text-sm font-medium">Expenses</p>
                  </a>
                  <a className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg" href="#">
                    <span className="material-symbols-outlined text-xl">flight</span>
                    <p className="text-sm font-medium">Travel</p>
                  </a>
                  <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary" href="#">
                    <span 
                      className="material-symbols-outlined text-xl" 
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      payments
                    </span>
                    <p className="text-sm font-medium">Payments</p>
                  </a>
                </div>
              </div>

              {/* New Expense Button */}
              <button 
                onClick={handleNewExpense}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors"
              >
                <span className="truncate">New Expense</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 p-8">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-3 pb-6 border-b border-slate-200 dark:border-zinc-800">
              <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Payments</p>
              <button 
                onClick={handlePayNow}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-primary/90 text-white gap-2 text-base font-bold transition-colors"
              >
                <span className="material-symbols-outlined">credit_card</span>
                <span className="truncate">Pay Now</span>
              </button>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Account Balance</h3>
                <p className="text-4xl font-bold text-primary mt-2">$2,458.00</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Available for expenses</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Pending Payments</h3>
                <p className="text-4xl font-bold text-secondary mt-2">$210.00</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">2 upcoming payments</p>
              </div>
            </div>

            {/* Transaction History */}
            <div className="mt-8">
              <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Transaction History
              </h2>
              <div className="px-4 py-3">
                <div className="flex overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-zinc-800/50">
                        <th className="px-4 py-3 text-left text-slate-600 dark:text-slate-300 text-sm font-medium">Date</th>
                        <th className="px-4 py-3 text-left text-slate-600 dark:text-slate-300 text-sm font-medium">Description</th>
                        <th className="px-4 py-3 text-left text-slate-600 dark:text-slate-300 text-sm font-medium">Amount</th>
                        <th className="px-4 py-3 text-left text-slate-600 dark:text-slate-300 text-sm font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="h-[72px] px-4 py-2 text-slate-500 dark:text-slate-400 text-sm">
                            {transaction.date}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-slate-800 dark:text-slate-200 text-sm font-medium">
                            {transaction.description}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-slate-500 dark:text-slate-400 text-sm">
                            {transaction.amount}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.statusColor}`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Payments;