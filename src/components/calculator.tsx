import React, { useState } from "react";
import CalculatorInputs from "./CalculatorInputs";
import Table from "./Table";
import { calculateAmortization } from "../utils/calculateAmortization";
import { ScheduleRow } from "./types";

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
  const [pmiRate, setPmiRate] = useState(0);
  const [propertyTaxRate, setPropertyTaxRate] = useState(0);
  const [propertyInsuranceRate, setPropertyInsuranceRate] = useState(0);
  const [maintenanceExpenses, setMaintenanceExpenses] = useState(0);
  const [hoaFees, setHoaFees] = useState(0);
  const [assessedValuePercent, setAssessedValuePercent] = useState<number>(0);
  const [incomeTaxRate, setIncomeTaxRate] = useState(0); // New state for income tax rate
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

  const handleCalculate = () => {
    const newSchedule = calculateAmortization({
      principal,
      rate,
      term,
      homeValue,
      annualIncrease,
      income,
      incomeGrowth,
      loanPayments,
      loanPaymentChange,
      ownershipYears,
      sellingCostsPercent,
      pmiRate,
      propertyTaxRate,
      propertyInsuranceRate,
      maintenanceExpenses,
      hoaFees,
      assessedValuePercent,
      incomeTaxRate, // Pass the new state here
    });

    setSchedule(newSchedule);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Mortgage Calculator</h1>
      <CalculatorInputs
        principal={principal}
        setPrincipal={setPrincipal}
        rate={rate}
        setRate={setRate}
        term={term}
        setTerm={setTerm}
        homeValue={homeValue}
        setHomeValue={setHomeValue}
        annualIncrease={annualIncrease}
        setAnnualIncrease={setAnnualIncrease}
        income={income}
        setIncome={setIncome}
        incomeGrowth={incomeGrowth}
        setIncomeGrowth={setIncomeGrowth}
        loanPayments={loanPayments}
        setLoanPayments={setLoanPayments}
        loanPaymentChange={loanPaymentChange}
        setLoanPaymentChange={setLoanPaymentChange}
        creditScore={creditScore}
        setCreditScore={setCreditScore}
        state={state}
        setState={setState}
        ownershipYears={ownershipYears}
        setOwnershipYears={setOwnershipYears}
        sellingCostsPercent={sellingCostsPercent}
        setSellingCostsPercent={setSellingCostsPercent}
        pmiRate={pmiRate}
        setPmiRate={setPmiRate}
        propertyTaxRate={propertyTaxRate}
        setPropertyTaxRate={setPropertyTaxRate}
        propertyInsuranceRate={propertyInsuranceRate}
        setPropertyInsuranceRate={setPropertyInsuranceRate}
        maintenanceExpenses={maintenanceExpenses}
        setMaintenanceExpenses={setMaintenanceExpenses}
        hoaFees={hoaFees}
        setHoaFees={setHoaFees}
        assessedValuePercent={assessedValuePercent}
        setAssessedValuePercent={setAssessedValuePercent}
        incomeTaxRate={incomeTaxRate} // Pass income tax rate to CalculatorInputs
        setIncomeTaxRate={setIncomeTaxRate} // Add setter for income tax rate
      />
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        onClick={handleCalculate}
      >
        Calculate
      </button>
      {schedule.length > 0 && (
        <Table schedule={schedule} formatCurrency={formatCurrency} />
      )}
    </div>
  );
};

export default Calculator;