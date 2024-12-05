import React, { useState } from "react";

interface ScheduleRow {
  year: number;
  fromMonth: number;
  toMonth: number;
  beginningBalance: number;
  payment: number;
  interestPayment: number;
  principalPayment: number;
  endingBalance: number;
  beginningHomeValue: number;
  endingHomeValue: number;
  beginningEquity: number;
  endingEquity: number;
  equityGrowth: number;
  cumulativeEquityGrowth: number;
  ltv: number;
  monthlyIncome: number;
  monthlyLoanPayments: number;
  salesProceeds?: number;
  sellingCosts?: number;
  loanPayoff?: number;
  netSalesProceeds?: number;
}

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma",
  "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee",
  "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

const creditScores = [
  { label: "800 - 850", value: "800-850", color: "bg-green-600" },
  { label: "740 - 799", value: "740-799", color: "bg-green-500" },
  { label: "670 - 739", value: "670-739", color: "bg-green-400" },
  { label: "580 - 669", value: "580-669", color: "bg-yellow-400" },
  { label: "350 - 579", value: "350-579", color: "bg-red-500" },
];

const Calculator: React.FC = () => {
  const [principal, setPrincipal] = useState(0);
  const [rate, setRate] = useState(0);
  const [term, setTerm] = useState(0);
  const [homeValue, setHomeValue] = useState(0);
  const [annualIncrease, setAnnualIncrease] = useState(0);
  const [income, setIncome] = useState(0);
  const [incomeGrowth, setIncomeGrowth] = useState(0);
  const [loanPayments, setLoanPayments] = useState(0);
  const [loanPaymentChange, setLoanPaymentChange] = useState(0);
  const [creditScore, setCreditScore] = useState("");
  const [state, setState] = useState("");
  const [ownershipYears, setOwnershipYears] = useState(0);
  const [sellingCostsPercent, setSellingCostsPercent] = useState(0);
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const calculateAmortization = () => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;
    const monthlyPayment =
      (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));
    const monthlyGrowthRate = Math.pow(1 + annualIncrease / 100, 1 / 12) - 1;

    const salesMonth = ownershipYears * 12;
    let balance = principal;
    let currentHomeValue = homeValue;
    let adjustedMonthlyIncome = income / 12;
    let adjustedMonthlyLoanPayments = loanPayments;
    let cumulativeEquityGrowth = 0;

    const amortizationSchedule: ScheduleRow[] = [];

    for (let month = 1; month <= numPayments; month++) {
      const year = Math.ceil(month / 12);

      if (month % 12 === 1 && month !== 1) {
        adjustedMonthlyIncome += adjustedMonthlyIncome * (incomeGrowth / 100);
        adjustedMonthlyLoanPayments +=
          adjustedMonthlyLoanPayments * (loanPaymentChange / 100);
      }

      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      const endingBalance = balance - principalPayment;

      const beginningEquity = currentHomeValue - balance;
      const endingHomeValue = currentHomeValue + currentHomeValue * monthlyGrowthRate;
      const endingEquity = endingHomeValue - endingBalance;
      const equityGrowth = endingEquity - beginningEquity;

      cumulativeEquityGrowth += equityGrowth;

      const ltv = (balance / homeValue) * 100;

      const row: ScheduleRow = {
        year,
        fromMonth: month - 1,
        toMonth: month,
        beginningBalance: balance,
        payment: monthlyPayment,
        interestPayment,
        principalPayment,
        endingBalance,
        beginningHomeValue: currentHomeValue,
        endingHomeValue,
        beginningEquity,
        endingEquity,
        equityGrowth,
        cumulativeEquityGrowth,
        ltv,
        monthlyIncome: adjustedMonthlyIncome,
        monthlyLoanPayments: adjustedMonthlyLoanPayments,
      };

      if (month === salesMonth) {
        const salesProceeds = currentHomeValue;
        const sellingCosts = salesProceeds * (sellingCostsPercent / 100);
        const loanPayoff = balance;
        const netSalesProceeds = salesProceeds - sellingCosts - loanPayoff;

        row.salesProceeds = salesProceeds;
        row.sellingCosts = sellingCosts;
        row.loanPayoff = loanPayoff;
        row.netSalesProceeds = netSalesProceeds;
      }

      amortizationSchedule.push(row);

      balance = endingBalance;
      currentHomeValue = endingHomeValue;
    }

    setSchedule(amortizationSchedule);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Mortgage Calculator</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Input Fields */}
        <div>
          <label className="block font-medium">Loan Amount</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formatCurrency(principal)}
            onChange={(e) =>
              setPrincipal(parseFloat(e.target.value.replace(/[$,]/g, "")) || 0)
            }
          />
        </div>
        <div>
          <label className="block font-medium">Interest Rate (%)</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label className="block font-medium">Loan Term (Years)</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={term}
            onChange={(e) => setTerm(parseInt(e.target.value, 10))}
          />
        </div>
        <div>
          <label className="block font-medium">Home Value</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formatCurrency(homeValue)}
            onChange={(e) =>
              setHomeValue(parseFloat(e.target.value.replace(/[$,]/g, "")) || 0)
            }
          />
        </div>
        <div>
          <label className="block font-medium">Annual Home Value Increase (%)</label>
          <input
            type="number"
            step="0.01"
            className="w-full border rounded p-2"
            value={annualIncrease}
            onChange={(e) => setAnnualIncrease(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label className="block font-medium">Annual Household Income</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formatCurrency(income)}
            onChange={(e) =>
              setIncome(parseFloat(e.target.value.replace(/[$,]/g, "")) || 0)
            }
          />
        </div>
        <div>
          <label className="block font-medium">Annual Income Growth (%)</label>
          <input
            type="number"
            step="0.01"
            className="w-full border rounded p-2"
            value={incomeGrowth}
            onChange={(e) => setIncomeGrowth(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label className="block font-medium">Monthly Loan Payments</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={formatCurrency(loanPayments)}
            onChange={(e) =>
              setLoanPayments(parseFloat(e.target.value.replace(/[$,]/g, "")) || 0)
            }
          />
        </div>
        <div>
          <label className="block font-medium">Annual Loan Payment Change (%)</label>
          <input
            type="number"
            step="0.01"
            className="w-full border rounded p-2"
            value={loanPaymentChange}
            onChange={(e) => setLoanPaymentChange(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label className="block font-medium">How Long Will You Own This Home (Years)</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={ownershipYears}
            onChange={(e) => setOwnershipYears(parseInt(e.target.value, 10))}
          />
        </div>
        <div>
          <label className="block font-medium">Selling Costs (%)</label>
          <input
            type="number"
            step="0.01"
            className="w-full border rounded p-2"
            value={sellingCostsPercent}
            onChange={(e) => setSellingCostsPercent(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label className="block font-medium">State</label>
          <select
            className="w-full border rounded p-2"
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            <option value="" disabled>
              Select a state
            </option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Credit Score</label>
          <select
            className="w-full border rounded p-2"
            value={creditScore}
            onChange={(e) => setCreditScore(e.target.value)}
          >
            <option value="" disabled>
              Select a credit score
            </option>
            {creditScores.map((score) => (
              <option key={score.value} value={score.value}>
                {score.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Calculate Button */}
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        onClick={calculateAmortization}
      >
        Calculate
      </button>
      {/* Schedule Table */}
      {schedule.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">Amortization Schedule</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">Year</th>
                <th className="border px-4 py-2">From Month</th>
                <th className="border px-4 py-2">To Month</th>
                <th className="border px-4 py-2">Monthly Income</th>
                <th className="border px-4 py-2">Monthly Loan Payments</th>
                <th className="border px-4 py-2">Beginning Balance</th>
                <th className="border px-4 py-2">Payment</th>
                <th className="border px-4 py-2">Interest Payment</th>
                <th className="border px-4 py-2">Principal Payment</th>
                <th className="border px-4 py-2">Ending Balance</th>
                <th className="border px-4 py-2">Beginning Home Value</th>
                <th className="border px-4 py-2">Ending Home Value</th>
                <th className="border px-4 py-2">Beginning Equity</th>
                <th className="border px-4 py-2">Ending Equity</th>
                <th className="border px-4 py-2">Equity Growth</th>
                <th className="border px-4 py-2">Cumulative Equity Growth</th>
                <th className="border px-4 py-2">LTV (%)</th>
                <th className="border px-4 py-2">Sales Proceeds</th>
                <th className="border px-4 py-2">Selling Costs</th>
                <th className="border px-4 py-2">Loan Payoff</th>
                <th className="border px-4 py-2">Net Sales Proceeds</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{row.year}</td>
                  <td className="border px-4 py-2">{row.fromMonth}</td>
                  <td className="border px-4 py-2">{row.toMonth}</td>
                  <td className="border px-4 py-2">{formatCurrency(row.monthlyIncome)}</td>
                  <td className="border px-4 py-2">{formatCurrency(row.monthlyLoanPayments)}</td>
                  <td className="border px-4 py-2">{formatCurrency(row.beginningBalance)}</td>
                  <td className="border px-4 py-2">{formatCurrency(row.payment)}</td>
                  <td className="border px-4 py-2">{formatCurrency(row.interestPayment)}</td>
                  <td className="border px-4 py-2">{formatCurrency(row.principalPayment)}</td>
                  <td className="border px-4 py-2">{formatCurrency(row.endingBalance)}</td>
                  <td className="border px-4 py-2">{formatCurrency(row.beginningHomeValue)}</td>
                  <td className="border px-4 py-2">{formatCurrency(row.endingHomeValue)}</td>
                  <td className="border px-4 py-2">{formatCurrency(row.beginningEquity)}</td>
                  <td className="border px-4 py-2">{formatCurrency(row.endingEquity)}</td>
                  <td className="border px-4 py-2">{formatCurrency(row.equityGrowth)}</td>
                  <td className="border px-4 py-2">{formatCurrency(row.cumulativeEquityGrowth)}</td>
                  <td className="border px-4 py-2">{row.ltv.toFixed(2)}%</td>
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
                  {row.netSalesProceeds
                    ? formatCurrency(row.netSalesProceeds)
                    : "-"}
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Calculator;