import { ScheduleRow } from "../components/types";

export const calculateAmortization = ({
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
  incomeTaxRate,
}: {
  principal: number;
  rate: number;
  term: number;
  homeValue: number;
  annualIncrease: number;
  income: number;
  incomeGrowth: number;
  loanPayments: number;
  loanPaymentChange: number;
  ownershipYears: number;
  sellingCostsPercent: number;
  pmiRate: number;
  propertyTaxRate: number;
  propertyInsuranceRate: number;
  maintenanceExpenses: number;
  hoaFees: number;
  assessedValuePercent: number;
  incomeTaxRate: number;
}): ScheduleRow[] => {
    if (!ownershipYears || ownershipYears <= 0) {
        ownershipYears = term;
      }
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

  let hasPMI = true;
  let currentPMIPayment = 0;
  let currentAssessedValue = 0;
  let currentPropertyTax = 0;
  let currentPropertyInsurance = 0;
  let cumulativePropertyTax = 0;
  let cumulativeInterestPayment = 0;

  const amortizationSchedule: ScheduleRow[] = [];
  
  // Array to store monthly rows for the current year before calculating tax benefits
  let currentYearRows: ScheduleRow[] = [];

  for (let month = 1; month <= numPayments; month++) {
    const year = Math.ceil(month / 12);
  
    // Reset cumulative values and temp storage at the start of each year
    if (month % 12 === 1) {
      cumulativePropertyTax = 0;
      cumulativeInterestPayment = 0;
      currentYearRows = [];
    }
  
    if (month > salesMonth) {
      break;
    }
  
    if (month % 12 === 1) {
      adjustedMonthlyIncome += adjustedMonthlyIncome * (incomeGrowth / 100);
      adjustedMonthlyLoanPayments +=
        adjustedMonthlyLoanPayments * (loanPaymentChange / 100);
  
      currentAssessedValue = (assessedValuePercent / 100) * currentHomeValue;
      currentPropertyTax = (currentAssessedValue * (propertyTaxRate / 100)) / 12;
      currentPropertyInsurance =
        (currentHomeValue * (propertyInsuranceRate / 100)) / 12;
  
      const ltv = (balance / homeValue) * 100;
      if (ltv > 80 && hasPMI) {
        const annualPMI = (pmiRate / 100) * balance;
        currentPMIPayment = annualPMI / 12;
      } else {
        currentPMIPayment = 0;
        hasPMI = false;
      }
    }
  
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    const endingBalance = balance - principalPayment;
  
    const beginningEquity = currentHomeValue - balance;
    const endingHomeValue = currentHomeValue + currentHomeValue * monthlyGrowthRate;
    const endingEquity = endingHomeValue - endingBalance;
    const equityGrowth = endingEquity - beginningEquity;
  
    cumulativeEquityGrowth += equityGrowth;
    cumulativePropertyTax += currentPropertyTax;
    cumulativeInterestPayment += interestPayment;
  
    // Create the base row without tax benefits
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
      ltv: (balance / homeValue) * 100,
      monthlyIncome: adjustedMonthlyIncome,
      monthlyLoanPayments: adjustedMonthlyLoanPayments,
      pmiPayment: currentPMIPayment,
      assessedValue: currentAssessedValue,
      propertyTax: currentPropertyTax,
      propertyInsurance: currentPropertyInsurance,
      maintenance: maintenanceExpenses,
      hoaFees: hoaFees,
      totalHousingPayment:
        monthlyPayment +
        currentPropertyTax +
        currentPropertyInsurance +
        hoaFees +
        currentPMIPayment,
      taxDeduction: 0,
      taxBenefit: 0,
      monthlyTaxBenefit: 0,
    };
  
    // Store the row for the current year
    currentYearRows.push(row);
  
    // At the end of each year or at the sale month, calculate tax benefits
    if (month % 12 === 0 || month === salesMonth) {
      const taxDeduction = cumulativePropertyTax + cumulativeInterestPayment;
      const taxBenefit = taxDeduction * (incomeTaxRate / 100);
      const monthlyTaxBenefit = taxBenefit / 12;
      
      // Update all rows for the current year with the calculated monthly tax benefit
      currentYearRows.forEach(yearRow => {
        yearRow.taxDeduction = yearRow.toMonth % 12 === 0 ? taxDeduction : 0;
        yearRow.taxBenefit = yearRow.toMonth % 12 === 0 ? taxBenefit : 0;
        yearRow.monthlyTaxBenefit = monthlyTaxBenefit;
      });
      
      // Add all rows for the current year to the schedule
      amortizationSchedule.push(...currentYearRows);
    }
  
    // Add sale-related values if the property is sold this month
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
  
    // Update balances for the next month
    balance = endingBalance;
    currentHomeValue = endingHomeValue;
  }

  return amortizationSchedule;
};