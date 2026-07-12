import React, { useState, useMemo } from 'react';
import { FileText, Calendar, Building, CreditCard, ChevronRight } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import DataTable from '../../components/ui/common/DataTable';
import ExportButton from '../../components/ui/buttons/ExportButton';
import Select from '../../components/ui/inputs/Select';
import ChartCard from '../../components/ui/cards/ChartCard';
import MetricCard from '../../components/ui/cards/MetricCard';

export default function ReportsPage() {
  const { assets, employees, departments, bookings, maintenance } = useMockState();
  const [reportPeriod, setReportPeriod] = useState('monthly'); // 'monthly' | 'yearly'

  // Mock computed reports dataset based on active lists
  const departmentUtilizationReport = useMemo(() => {
    return departments.map((d, idx) => {
      const allocatedAssets = assets.filter(a => a.status === 'Allocated' && a.currentHolderId && 
        employees.find(e => e.id === a.currentHolderId)?.department === d.name
      ).length;
      
      const totalBudgetVal = parseInt(d.budget.replace(/[^0-9]/g, '')) || 50000;
      const computedUtilization = allocatedAssets > 0 ? Math.min(Math.round((allocatedAssets / (d.employeeCount || 5)) * 100), 100) : 10 + (idx * 15);
      const computedCosts = Math.round(totalBudgetVal * (computedUtilization / 100));

      return {
        id: d.id,
        name: d.name,
        manager: d.manager,
        utilizationRate: `${computedUtilization}%`,
        activeAssetsCount: allocatedAssets || Math.round(d.employeeCount * 0.4) || 2,
        maintenanceCost: `$${(computedCosts * 0.08).toLocaleString()}`,
        totalAssetValuation: `$${computedCosts.toLocaleString()}`
      };
    });
  }, [departments, assets]);

  // Aggregate metrics
  const totalValuationSum = departmentUtilizationReport.reduce((acc, d) => acc + parseInt(d.totalAssetValuation.replace(/[^0-9]/g, '')), 0);
  const totalMaintenanceSpent = departmentUtilizationReport.reduce((acc, d) => acc + parseInt(d.maintenanceCost.replace(/[^0-9]/g, '')), 0);

  const columns = [
    { header: 'Department', accessor: 'name', render: (row) => <span className="font-bold text-white">{row.name}</span> },
    { header: 'Manager', accessor: 'manager' },
    { header: 'Active Assets', accessor: 'activeAssetsCount', render: (row) => <span className="font-semibold text-indigo-300">{row.activeAssetsCount}</span> },
    { header: 'Utilization Rate', accessor: 'utilizationRate', render: (row) => <span className="font-mono text-brand-success">{row.utilizationRate}</span> },
    { header: 'Maintenance Servicing', accessor: 'maintenanceCost', render: (row) => <span className="font-mono">{row.maintenanceCost}</span> },
    { header: 'Total Value Booked', accessor: 'totalAssetValuation', render: (row) => <span className="font-mono font-bold text-white">{row.totalAssetValuation}</span> }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5.5 h-5.5 text-brand-primary" />
            <span>Reports Ledger</span>
          </h2>
          <p className="text-xs text-brand-secondaryText mt-1">Export transaction registries, depreciation records, and billing sheets.</p>
        </div>
        
        {/* Period Selector */}
        <div className="w-36 shrink-0">
          <Select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="py-1.5"
          >
            <option value="monthly">Monthly Cycle</option>
            <option value="yearly">Yearly Cycle</option>
          </Select>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Consolidated Valuation"
          value={`$${totalValuationSum.toLocaleString()}`}
          icon={Building}
          description="Total capital assets monitored"
        />
        <MetricCard
          title="Maintenance Expenses"
          value={`$${totalMaintenanceSpent.toLocaleString()}`}
          icon={CreditCard}
          iconColor="text-brand-danger"
          description="All service invoices processed"
        />
        <MetricCard
          title="Asset Utilization Rating"
          value="74.2%"
          icon={FileText}
          iconColor="text-brand-success"
          trend="+4.8%"
          description="Overall deployment efficiency"
        />
      </div>

      {/* Main Reports Table */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Departmental Asset Allocations & Valuations</h3>
          
          {/* Export button group */}
          <div className="flex flex-wrap items-center gap-2">
            <ExportButton format="CSV" data={departmentUtilizationReport} filename="department_utilization" />
            <ExportButton format="Excel" data={departmentUtilizationReport} filename="department_utilization" />
            <ExportButton format="PDF" data={departmentUtilizationReport} filename="department_utilization" />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={departmentUtilizationReport}
          searchPlaceholder="Search departments..."
          searchKeys={['name', 'manager', 'utilizationRate']}
          itemsPerPage={6}
        />
      </div>
    </div>
  );
}
