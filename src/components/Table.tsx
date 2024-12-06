import React from "react";
import { ScheduleRow } from "./types"; // Define ScheduleRow in a separate types file

interface TableProps {
  schedule: ScheduleRow[];
  formatCurrency: (value: number) => string;
}

const Table: React.FC<TableProps> = ({ schedule, formatCurrency }) => (
  <div className="mt-8">
    <h2 className="text-xl font-bold mb-4">Amortization Schedule</h2>
    <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
      <thead>
        {/* Grouped Headers */}
        <tr className="bg-gray-100">
          <th className="border px-4 py-2" colSpan={3}>
            Year Details
          </th>
          <th className="border px-4 py-2" colSpan={8}>
            Payment Details
          </th>
          <th className="border px-4 py-2" colSpan={6}>
            DTI and Income
          </th>
          <th className="border px-4 py-2" colSpan={10}>
            Mortgage and Home Value
          </th>
          <th className="border px-4 py-2" colSpan={4}>
            Sales Details
          </th>
        </tr>
        {/* Column Headers */}
        <tr className="bg-gray-200">
          {/* Year Group */}
          <th className="border px-4 py-2">Year</th>
          <th className="border px-4 py-2">From Month</th>
          <th className="border px-4 py-2">To Month</th>
          {/* Payment Group */}
          <th className="border px-4 py-2">Mortgage Payment</th>
          <th className="border px-4 py-2">Interest Payment</th>
          <th className="border px-4 py-2">Principal Payment</th>
          <th className="border px-4 py-2">PMI Payment</th>
          <th className="border px-4 py-2">Property Tax</th>
          <th className="border px-4 py-2">Property Insurance</th>
          <th className="border px-4 py-2">HOA Fees</th>
          <th className="border px-4 py-2">Total Housing Payment</th>
          {/* DTI and Income Group */}
          <th className="border px-4 py-2">Monthly Income</th>
          <th className="border px-4 py-2">Front-End DTI</th>
          <th className="border px-4 py-2">Monthly Loan Payments</th>
          <th className="border px-4 py-2">Non-Housing DTI</th>
          <th className="border px-4 py-2">Back-End DTI</th>
          <th className="border px-4 py-2">Maintenance</th>
          {/* Mortgage and Home Value Group */}
          <th className="border px-4 py-2">Beginning Mortgage Balance</th>
          <th className="border px-4 py-2">Ending Mortgage Balance</th>
          <th className="border px-4 py-2">LTV (%)</th>
          <th className="border px-4 py-2">Beginning Home Value</th>
          <th className="border px-4 py-2">Ending Home Value</th>
          <th className="border px-4 py-2">Assessed Value</th>
          <th className="border px-4 py-2">Beginning Equity</th>
          <th className="border px-4 py-2">Ending Equity</th>
          <th className="border px-4 py-2">Equity Growth</th>
          <th className="border px-4 py-2">Cumulative Equity Growth</th>
          {/* Sales Group */}
          <th className="border px-4 py-2">Sales Proceeds</th>
          <th className="border px-4 py-2">Selling Costs</th>
          <th className="border px-4 py-2">Loan Payoff</th>
          <th className="border px-4 py-2">Net Sales Proceeds</th>
        </tr>
      </thead>
      <tbody>
        {schedule.map((row, index) => (
          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            {/* Year Group */}
            <td className="border px-4 py-2">{row.year}</td>
            <td className="border px-4 py-2">{row.fromMonth}</td>
            <td className="border px-4 py-2">{row.toMonth}</td>
            {/* Payment Group */}
            <td className="border px-4 py-2">{formatCurrency(row.payment)}</td>
            <td className="border px-4 py-2">{formatCurrency(row.interestPayment)}</td>
            <td className="border px-4 py-2">{formatCurrency(row.principalPayment)}</td>
            <td className="border px-4 py-2">{formatCurrency(row.pmiPayment || 0)}</td>
            <td className="border px-4 py-2">{formatCurrency(row.propertyTax || 0)}</td>
            <td className="border px-4 py-2">{formatCurrency(row.propertyInsurance)}</td>
            <td className="border px-4 py-2">{formatCurrency(row.hoaFees)}</td>
            <td className="border px-4 py-2">{formatCurrency(row.totalHousingPayment)}</td>
            {/* DTI and Income Group */}
            <td className="border px-4 py-2">{formatCurrency(row.monthlyIncome)}</td>
            <td className="border px-4 py-2">
              {(row.totalHousingPayment / row.monthlyIncome * 100).toFixed(2)}%
            </td>
            <td className="border px-4 py-2">{formatCurrency(row.monthlyLoanPayments)}</td>
            <td className="border px-4 py-2">
              {(row.monthlyLoanPayments / row.monthlyIncome * 100).toFixed(2)}%
            </td>
            <td className="border px-4 py-2">
              {(
                ((row.totalHousingPayment + row.monthlyLoanPayments) /
                  row.monthlyIncome) *
                100
              ).toFixed(2)}%
            </td>
            <td className="border px-4 py-2">{formatCurrency(row.maintenance)}</td>
            {/* Mortgage and Home Value Group */}
            <td className="border px-4 py-2">{formatCurrency(row.beginningBalance)}</td>
            <td className="border px-4 py-2">{formatCurrency(row.endingBalance)}</td>
            <td className="border px-4 py-2">{row.ltv.toFixed(2)}%</td>
            <td className="border px-4 py-2">{formatCurrency(row.beginningHomeValue)}</td>
            <td className="border px-4 py-2">{formatCurrency(row.endingHomeValue)}</td>
            <td className="border px-4 py-2">{formatCurrency(row.assessedValue || 0)}</td>
            <td className="border px-4 py-2">{formatCurrency(row.beginningEquity)}</td>
            <td className="border px-4 py-2">{formatCurrency(row.endingEquity)}</td>
            <td className="border px-4 py-2">{formatCurrency(row.equityGrowth)}</td>
            <td className="border px-4 py-2">{formatCurrency(row.cumulativeEquityGrowth)}</td>
            {/* Sales Group */}
            <td className="border px-4 py-2">
              {row.salesProceeds ? formatCurrency(row.salesProceeds) : "-"}
            </td>
            <td className="border px-4 py-2">
              {row.sellingCosts ? formatCurrency(row.sellingCosts) : "-"}
            </td>
            <td className="border px-4 py-2">
              {row.loanPayoff ? formatCurrency(row.loanPayoff) : "-"}
            </td>
            <td className="border px-4 py-2">
              {row.netSalesProceeds ? formatCurrency(row.netSalesProceeds) : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Table;