import { useState } from "react";

export const useCalculatorState = () => {
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

  return {
    principal, setPrincipal,
    rate, setRate,
    term, setTerm,
    homeValue, setHomeValue,
    annualIncrease, setAnnualIncrease,
    income, setIncome,
    incomeGrowth, setIncomeGrowth,
    loanPayments, setLoanPayments,
    loanPaymentChange, setLoanPaymentChange,
    creditScore, setCreditScore,
    state, setState,
    ownershipYears, setOwnershipYears,
    sellingCostsPercent, setSellingCostsPercent,
    pmiRate, setPmiRate,
    propertyTaxRate, setPropertyTaxRate,
    propertyInsuranceRate, setPropertyInsuranceRate,
    maintenanceExpenses, setMaintenanceExpenses,
    hoaFees, setHoaFees,
    assessedValuePercent, setAssessedValuePercent,
  };
};