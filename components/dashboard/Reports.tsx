'use client';
import { useState } from 'react';
import { FileText, Download, Calendar, Car, Bike, TrendingUp, TrendingDown } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function Reports() {
  const { queueItems, transactions } = useContent();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [reportType, setReportType] = useState<'summary' | 'detailed'>('summary');

  // Get month data
  const getMonthData = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    
    const monthQueues = queueItems.filter((q) => {
      const qDate = new Date(q.createdAt);
      return qDate.getFullYear() === year && qDate.getMonth() + 1 === month;
    });

    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate.getFullYear() === year && tDate.getMonth() + 1 === month;
    });

    return { monthQueues, monthTransactions };
  };

  const { monthQueues, monthTransactions } = getMonthData();

  // Calculate statistics
  const completedQueues = monthQueues.filter((q) => q.status === 'completed');
  const totalVehicles = completedQueues.length;
  const totalCars = completedQueues.filter((q) => q.vehicleType === 'car').length;
  const totalMotorcycles = completedQueues.filter((q) => q.vehicleType === 'motorcycle').length;
  const totalRevenue = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  // Service breakdown
  const serviceStats = completedQueues.reduce((acc, queue) => {
    const serviceName = queue.serviceName;
    if (!acc[serviceName]) {
      acc[serviceName] = { count: 0, revenue: 0 };
    }
    acc[serviceName].count += 1;
    acc[serviceName].revenue += queue.price;
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);

  // Generate PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();
    const [year, month] = selectedMonth.split('-');
    const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Satria Car & Moto Clean', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Monthly Report - ${monthName}`, 105, 28, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-US')}`, 105, 34, { align: 'center' });

    // Summary Statistics
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary Statistics', 14, 45);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    let yPos = 52;
    
    doc.text(`Total Vehicles Serviced: ${totalVehicles}`, 14, yPos);
    yPos += 6;
    doc.text(`  - Cars: ${totalCars}`, 14, yPos);
    yPos += 6;
    doc.text(`  - Motorcycles: ${totalMotorcycles}`, 14, yPos);
    yPos += 8;
    
    doc.text(`Total Revenue: Rp ${totalRevenue.toLocaleString('id-ID')}`, 14, yPos);
    yPos += 6;
    doc.text(`Total Expenses: Rp ${totalExpenses.toLocaleString('id-ID')}`, 14, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text(`Net Profit: Rp ${netProfit.toLocaleString('id-ID')}`, 14, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 10;

    // Service Breakdown
    if (Object.keys(serviceStats).length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Service Breakdown', 14, yPos);
      yPos += 7;

      const serviceData = Object.entries(serviceStats).map(([service, data]) => [
        service,
        data.count.toString(),
        `Rp ${data.revenue.toLocaleString('id-ID')}`,
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Service', 'Count', 'Revenue']],
        body: serviceData,
        theme: 'grid',
        headStyles: { fillColor: [252, 222, 4], textColor: [29, 29, 29] },
        styles: { fontSize: 9 },
      });

      yPos = (doc as any).lastAutoTable?.finalY + 10;
    }

    // Detailed Transactions (if detailed report)
    if (reportType === 'detailed' && yPos < 250) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Financial Transactions', 14, yPos);
      yPos += 7;

      // Income
      const incomeData = monthTransactions
        .filter((t) => t.type === 'income')
        .map((t) => [
          new Date(t.date).toLocaleDateString('id-ID'),
          t.category,
          t.description,
          `Rp ${t.amount.toLocaleString('id-ID')}`,
        ]);

      if (incomeData.length > 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Income:', 14, yPos);
        yPos += 5;

        autoTable(doc, {
          startY: yPos,
          head: [['Date', 'Category', 'Description', 'Amount']],
          body: incomeData,
          theme: 'grid',
          headStyles: { fillColor: [34, 197, 94] },
          styles: { fontSize: 8 },
        });

        yPos = (doc as any).lastAutoTable?.finalY + 8;
      }

      // Expenses (start new page if needed)
      const expenseData = monthTransactions
        .filter((t) => t.type === 'expense')
        .map((t) => [
          new Date(t.date).toLocaleDateString('id-ID'),
          t.category,
          t.description,
          `Rp ${t.amount.toLocaleString('id-ID')}`,
        ]);

      if (expenseData.length > 0) {
        if (yPos > 230) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Expenses:', 14, yPos);
        yPos += 5;

        autoTable(doc, {
          startY: yPos,
          head: [['Date', 'Category', 'Description', 'Amount']],
          body: expenseData,
          theme: 'grid',
          headStyles: { fillColor: [239, 68, 68] },
          styles: { fontSize: 8 },
        });
      }
    }

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    // Save PDF
    doc.save(`Satria-Report-${selectedMonth}.pdf`);
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-600">Generate monthly reports for business analysis</p>
      </div>

      {/* Report Configuration */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-lg font-bold text-[#1D1D1D] mb-4">Report Settings</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
              Select Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as 'summary' | 'detailed')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04]"
            >
              <option value="summary">Summary Report</option>
              <option value="detailed">Detailed Report</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={generatePDF}
              className="w-full flex items-center justify-center gap-2 bg-[#FCDE04] text-[#1D1D1D] px-6 py-2 rounded-lg font-semibold hover:bg-[#e8cd04] transition-colors"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-6 h-6 text-[#6797BF]" />
          <h3 className="text-lg font-bold text-[#1D1D1D]">Report Preview</h3>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <p className="text-xs text-blue-600 font-medium">Total Vehicles</p>
            </div>
            <p className="text-2xl font-bold text-blue-800">{totalVehicles}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Car className="w-5 h-5 text-purple-600" />
              <p className="text-xs text-purple-600 font-medium">Cars</p>
            </div>
            <p className="text-2xl font-bold text-purple-800">{totalCars}</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Bike className="w-5 h-5 text-orange-600" />
              <p className="text-xs text-orange-600 font-medium">Motorcycles</p>
            </div>
            <p className="text-2xl font-bold text-orange-800">{totalMotorcycles}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <p className="text-xs text-green-600 font-medium">Revenue</p>
            </div>
            <p className="text-lg font-bold text-green-800">
              Rp {(totalRevenue / 1000).toFixed(0)}K
            </p>
          </div>

          <div className={`p-4 rounded-lg border ${netProfit >= 0 ? 'bg-[#FCDE04] border-[#e8cd04]' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              {netProfit >= 0 ? (
                <TrendingUp className="w-5 h-5 text-[#1D1D1D]" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
              <p className={`text-xs font-medium ${netProfit >= 0 ? 'text-[#1D1D1D]' : 'text-red-600'}`}>
                Net Profit
              </p>
            </div>
            <p className={`text-lg font-bold ${netProfit >= 0 ? 'text-[#1D1D1D]' : 'text-red-800'}`}>
              Rp {(netProfit / 1000).toFixed(0)}K
            </p>
          </div>
        </div>

        {/* Service Breakdown */}
        {Object.keys(serviceStats).length > 0 && (
          <div className="mb-6">
            <h4 className="font-bold text-[#1D1D1D] mb-3">Service Breakdown</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Service</th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Count</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(serviceStats).map(([service, data]) => (
                    <tr key={service}>
                      <td className="px-4 py-2 text-sm text-gray-700">{service}</td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700">{data.count}</td>
                      <td className="px-4 py-2 text-sm text-right font-semibold text-[#6797BF]">
                        Rp {data.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Financial Summary */}
        <div>
          <h4 className="font-bold text-[#1D1D1D] mb-3">Financial Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-700">Total Income</span>
              <span className="text-lg font-bold text-green-800">Rp {totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-red-700">Total Expenses</span>
              <span className="text-lg font-bold text-red-800">Rp {totalExpenses.toLocaleString()}</span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded-lg ${netProfit >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
              <span className={`text-sm font-medium ${netProfit >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                Net Profit
              </span>
              <span className={`text-lg font-bold ${netProfit >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                Rp {netProfit.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="bg-gradient-to-r from-[#6797BF] to-[#5686ae] p-6 rounded-xl text-white">
        <h4 className="font-bold mb-2">📊 Report Information</h4>
        <ul className="space-y-1 text-sm">
          <li>• Summary reports include key statistics and service breakdown</li>
          <li>• Detailed reports include complete transaction history</li>
          <li>• Reports are generated in PDF format for easy sharing</li>
          <li>• Data is calculated based on completed services and recorded transactions</li>
        </ul>
      </div>
    </div>
  );
}
