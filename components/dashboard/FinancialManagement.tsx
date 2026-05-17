'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, TrendingUp, TrendingDown, Wallet, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { useToast } from '@/context/ToastContext';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { Skeleton } from '@/components/ui/skeleton';

export function FinancialManagement() {
  const { transactions, setTransactions, isLoading } = useContent();
  const { addToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<string>('today');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const resetForm = () => {
    setFormData({
      type: 'expense',
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsAdding(false);
    setEditingTransaction(null);
  };

  // Handle escape key to close form
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAdding) {
        resetForm();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isAdding]);

  const expenseCategories = [
    'Cleaning Supplies',
    'Equipment Maintenance',
    'Utilities',
    'Salaries',
    'Marketing',
    'Rent',
    'Other',
  ];

  const incomeCategories = ['Service Payment', 'Other Income'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      addToast('error', 'Jumlah harus berupa angka positif');
      return;
    }

    const transactionData = {
      id: editingTransaction?.id || crypto.randomUUID(),
      type: formData.type,
      category: formData.category,
      amount: parsedAmount,
      description: formData.description,
      date: new Date(formData.date),
      // precise timestamp (ISO) including hour:minute:second
      transaction_at: editingTransaction?.transaction_at || new Date().toISOString(),
      createdAt: editingTransaction?.createdAt || new Date(),
    };

    if (editingTransaction) {
      setTransactions(transactions.map((t) => (t.id === editingTransaction.id ? transactionData : t)));
      addToast('success', 'Transaksi berhasil diperbarui!');
    } else {
      setTransactions([...transactions, transactionData]);
      addToast('success', 'Transaksi baru berhasil ditambahkan!');
    }

    resetForm();
  };

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: new Date(transaction.date).toISOString().split('T')[0],
    });
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setTransactions(transactions.filter((t) => t.id !== deleteTarget));
    setDeleteTarget(null);
    addToast('success', 'Transaksi berhasil dihapus!');
  };

  // Filtering logic
  const getFilteredTransactions = () => {
    let filtered = transactions;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    // Filter by period
    if (filterPeriod !== 'all') {
      const now = new Date();
      filtered = filtered.filter((t) => {
        const transDate = new Date(t.date);
        if (filterPeriod === 'today') {
          return transDate.toDateString() === now.toDateString();
        } else if (filterPeriod === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return transDate >= weekAgo;
        } else if (filterPeriod === 'month') {
          return (
            transDate.getMonth() === now.getMonth() &&
            transDate.getFullYear() === now.getFullYear()
          );
        }
        return true;
      });
    }

    // Sort by latest first
    return filtered.sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());
  };

  const filteredTransactions = getFilteredTransactions();
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Calculate statistics
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;

  // Monthly statistics
  const now = new Date();
  const monthlyIncome = transactions
    .filter(
      (t) =>
        t.type === 'income' &&
        new Date(t.date).getMonth() === now.getMonth() &&
        new Date(t.date).getFullYear() === now.getFullYear()
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = transactions
    .filter(
      (t) =>
        t.type === 'expense' &&
        new Date(t.date).getMonth() === now.getMonth() &&
        new Date(t.date).getFullYear() === now.getFullYear()
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyProfit = monthlyIncome - monthlyExpense;

  // Loading skeleton for statistics cards
  const StatisticsSkeleton = () => (
    <div className="grid md:grid-cols-4 gap-6 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="w-6 h-6" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-8 w-32" />
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <DeleteConfirmDialog
        open={deleteTarget !== null}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmLabel="Delete Transaction"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
      {/* Statistics */}
      {isLoading ? (
        <StatisticsSkeleton />
      ) : (
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <p className="text-sm text-green-600 font-medium">Total Income</p>
          </div>
          <p className="text-2xl font-bold text-green-800">Rp {totalIncome.toLocaleString()}</p>
        </div>

        <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-6 h-6 text-red-600" />
            <p className="text-sm text-red-600 font-medium">Total Expense</p>
          </div>
          <p className="text-2xl font-bold text-red-800">Rp {totalExpense.toLocaleString()}</p>
        </div>

        <div className={`p-6 rounded-xl border-2 ${netProfit >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
          <div className="flex items-center gap-3 mb-2">
            <Wallet className={`w-6 h-6 ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            <p className={`text-sm font-medium ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Net Profit</p>
          </div>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
            Rp {netProfit.toLocaleString()}
          </p>
        </div>

        <div className="bg-[#FCDE04] p-6 rounded-xl border-2 border-[#e8cd04]">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-[#1D1D1D]" />
            <p className="text-sm text-[#1D1D1D] font-medium">Monthly Profit</p>
          </div>
          <p className="text-2xl font-bold text-[#1D1D1D]">Rp {monthlyProfit.toLocaleString()}</p>
        </div>
      </div>
      )}

      {/* Filters and Add Button */}
      {!isLoading && (
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 pr-10 py-2 bg-white border border-[#FCDE04] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FCDE04] text-gray-700 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '18px',
            }}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filterPeriod}
            onChange={(e) => {
              setFilterPeriod(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 pr-10 py-2 bg-white border border-[#FCDE04] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FCDE04] text-gray-700 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '18px',
            }}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-[#FCDE04] text-[#1D1D1D] px-4 py-2 rounded-lg font-semibold hover:bg-[#e8cd04] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>
      )}

      {/* Transactions List */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="space-y-4 p-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ) : (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Amount</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(transaction.date).toLocaleDateString('id-ID')} {new Date(transaction.createdAt || transaction.date).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{transaction.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{transaction.description}</td>
                  <td
                    className={`px-6 py-4 text-sm font-semibold text-right ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}Rp {transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {!transaction.queueId && (
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors border border-gray-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg font-medium transition-colors ${
                        pageNum === currentPage
                          ? 'bg-[#FCDE04] text-[#1D1D1D]'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors border border-gray-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Add/Edit Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#1D1D1D]">
                {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
              </h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as 'income' | 'expense',
                      category: '',
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-white dark:bg-white text-black dark:text-black"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-white dark:bg-white text-black dark:text-black"
                >
                  <option value="">Select Category</option>
                  {(formData.type === 'expense' ? expenseCategories : incomeCategories).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">Amount (Rp) *</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  min="0"
                  step="1000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-white dark:bg-white text-black dark:text-black"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-white dark:bg-white text-black dark:text-black"
                  placeholder="Transaction details..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-white dark:bg-white text-black dark:text-black"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#FCDE04] text-[#1D1D1D] px-6 py-3 rounded-lg font-semibold hover:bg-[#e8cd04] transition-colors"
                >
                  {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-red-50 border-2 border-red-300 text-red-700 rounded-lg font-semibold hover:bg-red-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
