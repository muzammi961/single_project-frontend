import React, { useState } from 'react';

const ExpenseTracker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      name: 'Lunch with Client',
      category: 'Food',
      date: '2023-10-26',
      amount: '$45.00'
    },
    {
      id: 2,
      name: 'Office Supplies',
      category: 'Work',
      date: '2023-10-25',
      amount: '$120.00'
    },
    {
      id: 3,
      name: 'Flight to SF',
      category: 'Travel',
      date: '2023-10-24',
      amount: '$450.00'
    }
  ]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    // Add expense logic here
    setIsModalOpen(false);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-neutral-dark-gray dark:text-neutral-white">
      <div className="relative flex min-h-screen">
        {/* SideNavBar */}
        <aside className="w-64 bg-neutral-white dark:bg-neutral-dark-gray/10 p-4 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAVh1Tc_CbVaRwHfyESY08TxT4f9X02y9z6ltMcePXrg5KwybUk60hisOkG13DDkFivHTy7EfgiI2WCUxLRnuJAQ6wbLE0v1UkED7HKP6KeN7M2wA4QxOcpBDCke43R0YDW0Ku4zDdCPlTfTUtyb1gWnHJ_njuUFRxbAdMHgazhFDYi9LdFc1aJvZhbcrh72weimUBMVC_nkRnCFqOfkzvVnPRD4dEd8HWFXA0rbsBpC19yAGiFA_Y3PHiq8tNpNU7pSSig5c6pGDg")' }}
              ></div>
              <div>
                <h1 className="text-neutral-dark-gray dark:text-neutral-white text-lg font-bold">Alex Doe</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">alex.doe@example.com</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-dark-gray dark:text-neutral-white hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors" href="#">
                <span className="material-symbols-outlined">dashboard</span>
                <span className="font-medium">Dashboard</span>
              </a>
              <a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/20 dark:bg-primary/30 text-primary font-medium" href="#">
                <span className="material-symbols-outlined">receipt_long</span>
                <span className="font-medium">Expenses</span>
              </a>
              <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-dark-gray dark:text-neutral-white hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors" href="#">
                <span className="material-symbols-outlined">flight</span>
                <span className="font-medium">Travel Plans</span>
              </a>
              <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-dark-gray dark:text-neutral-white hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors" href="#">
                <span className="material-symbols-outlined">bar_chart</span>
                <span className="font-medium">Reports</span>
              </a>
              <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-dark-gray dark:text-neutral-white hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors" href="#">
                <span className="material-symbols-outlined">settings</span>
                <span className="font-medium">Settings</span>
              </a>
            </nav>
          </div>
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-dark-gray dark:text-neutral-white hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-medium">Logout</span>
          </button>
        </aside>

        <main className="flex-1 p-8">
          {/* PageHeading */}
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-black tracking-tight text-neutral-dark-gray dark:text-neutral-white">Expenses</h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold shadow-md hover:bg-primary/90 transition-transform transform hover:scale-105"
            >
              <span className="material-symbols-outlined">add</span>
              <span>Add New Expense</span>
            </button>
          </header>

          {/* Charts Section */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
            <div className="lg:col-span-2 bg-neutral-white dark:bg-neutral-dark-gray/20 p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-neutral-dark-gray dark:text-neutral-white">Spending by Category</h2>
              <div className="flex justify-center items-center h-64">
                <img 
                  alt="A colorful pie chart showing expense distribution by category" 
                  className="max-w-full max-h-full" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJXeLVWH3H-vP9IeYgU38VFIokRStnt3EbWQmk6lm-BBFKgtPXXB8wgbSFUUqVG8CXP4O5sbeBoaeVM_eIkDw5t3uoaXMxpid02loVSeB_MMBV0yWoLO1ybpRlgaf07YQ-YnAEtmqSzA04xj_M-hfw5nPPw-VXyMsU-sFpY8cyTlrBMVS9_fUyOg7U8KUisTI08ue_9BhvQXkhPk6FLKOjd2ELc1viMt8dqekjqdD76OpBYU1honJAto6iRXyYW3RghAeOYYczS14"
                />
              </div>
            </div>
            <div className="lg:col-span-3 bg-neutral-white dark:bg-neutral-dark-gray/20 p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-neutral-dark-gray dark:text-neutral-white">Monthly Spending Overview</h2>
              <div className="h-64 flex items-end gap-4">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                  <div key={month} className="flex-1 text-center">
                    <div 
                      className={`rounded-t-lg ${
                        month === 'Apr' 
                          ? 'bg-primary' 
                          : index < 3 
                            ? 'bg-primary/20 dark:bg-primary/40' 
                            : 'bg-secondary/20 dark:bg-secondary/40'
                      }`}
                      style={{ 
                        height: month === 'Jan' ? '60%' : 
                                month === 'Feb' ? '80%' : 
                                month === 'Mar' ? '40%' : 
                                month === 'Apr' ? '90%' : 
                                month === 'May' ? '70%' : '50%' 
                      }}
                    ></div>
                    <p className={`text-sm mt-2 font-medium ${
                      month === 'Apr' ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {month}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Filters & Table */}
          <div className="bg-neutral-white dark:bg-neutral-dark-gray/20 p-6 rounded-xl shadow-sm">
            {/* Chips/Filters */}
            <div className="flex gap-4 mb-6">
              <button className="flex items-center gap-2 px-4 py-2 bg-neutral-light-gray dark:bg-neutral-dark-gray/30 rounded-full text-neutral-dark-gray dark:text-neutral-white font-medium hover:bg-gray-200 dark:hover:bg-neutral-dark-gray/50 transition-colors">
                <span>Filter by Category</span>
                <span className="material-symbols-outlined text-lg">arrow_drop_down</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-neutral-light-gray dark:bg-neutral-dark-gray/30 rounded-full text-neutral-dark-gray dark:text-neutral-white font-medium hover:bg-gray-200 dark:hover:bg-neutral-dark-gray/50 transition-colors">
                <span>Filter by Date</span>
                <span className="material-symbols-outlined text-lg">arrow_drop_down</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="p-4 text-sm font-bold uppercase text-gray-500 dark:text-gray-400">Name</th>
                    <th className="p-4 text-sm font-bold uppercase text-gray-500 dark:text-gray-400">Category</th>
                    <th className="p-4 text-sm font-bold uppercase text-gray-500 dark:text-gray-400">Date</th>
                    <th className="p-4 text-sm font-bold uppercase text-gray-500 dark:text-gray-400">Amount</th>
                    <th className="p-4 text-sm font-bold uppercase text-gray-500 dark:text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-neutral-dark-gray/30">
                      <td className="p-4 font-medium text-neutral-dark-gray dark:text-neutral-white">{expense.name}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          expense.category === 'Food' ? 'bg-primary/20 text-primary' :
                          expense.category === 'Work' ? 'bg-secondary/20 text-secondary' :
                          'bg-green-500/20 text-green-500'
                        }`}>
                          {expense.category}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{expense.date}</td>
                      <td className="p-4 font-medium text-neutral-dark-gray dark:text-neutral-white">{expense.amount}</td>
                      <td className="p-4 text-right">
                        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-dark-gray/50 transition-colors">
                          <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-dark-gray/50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-red-500">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-neutral-white dark:bg-neutral-dark-gray/40 w-full max-w-lg p-8 rounded-xl shadow-2xl m-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-dark-gray dark:text-neutral-white">Add New Expense</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-dark-gray/50"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form className="space-y-6" onSubmit={handleAddExpense}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="expense-name">
                    Expense Name
                  </label>
                  <input 
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-neutral-light-gray dark:bg-neutral-dark-gray/30 focus:ring-primary focus:border-primary" 
                    id="expense-name" 
                    placeholder="e.g., Dinner with team" 
                    type="text"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="amount">
                    Amount
                  </label>
                  <input 
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-neutral-light-gray dark:bg-neutral-dark-gray/30 focus:ring-primary focus:border-primary" 
                    id="amount" 
                    placeholder="$0.00" 
                    type="text"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="date">
                    Date
                  </label>
                  <input 
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-neutral-light-gray dark:bg-neutral-dark-gray/30 focus:ring-primary focus:border-primary" 
                    id="date" 
                    type="date"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="category">
                    Category
                  </label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-neutral-light-gray dark:bg-neutral-dark-gray/30 focus:ring-primary focus:border-primary" 
                    id="category"
                    required
                  >
                    <option>Food</option>
                    <option>Work</option>
                    <option>Travel</option>
                    <option>Entertainment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="notes">
                    Notes (optional)
                  </label>
                  <textarea 
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-neutral-light-gray dark:bg-neutral-dark-gray/30 focus:ring-primary focus:border-primary" 
                    id="notes" 
                    placeholder="Add any details..." 
                    rows="3"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 rounded-lg text-neutral-dark-gray dark:text-neutral-white bg-gray-200 dark:bg-neutral-dark-gray/50 hover:bg-gray-300 dark:hover:bg-neutral-dark-gray/70 font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90"
                  >
                    Save Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;