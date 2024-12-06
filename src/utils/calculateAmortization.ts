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
}): ScheduleRow[] => {
  const monthlyRate = rate / 100 / 12; // Monthly interest rate
  const numPayments = term * 12; // Total number of payments
  const monthlyPayment =
    (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));
  const monthlyGrowthRate = Math.pow(1 + annualIncrease / 100, 1 / 12) - 1; // Home value growth rate

  const salesMonth = ownershipYears * 12; // Month when the property is sold
  let balance = principal;
  let currentHomeValue = homeValue;
  let adjustedMonthlyIncome = income / 12;
  let adjustedMonthlyLoanPayments = loanPayments;
  let cumulativeEquityGrowth = 0;

  let hasPMI = true; // Tracks if PMI is still applicable
  let currentPMIPayment = 0; // Tracks the monthly PMI payment for the year
  let currentAssessedValue = 0; // Tracks the assessed value for the year
  let currentPropertyTax = 0; // Tracks the monthly property tax for the year
  let currentPropertyInsurance = 0; // Tracks the monthly property insurance for the year

  const amortizationSchedule: ScheduleRow[] = [];

  for (let month = 1; month <= numPayments; month++) {
    const year = Math.ceil(month / 12);

    // Stop adding rows after the sale month
    if (month > salesMonth) {
      break;
    }

    // Adjust income, loan payments, assessed value, and taxes at the start of each year
    if (month % 12 === 1) {
      adjustedMonthlyIncome += adjustedMonthlyIncome * (incomeGrowth / 100);
      adjustedMonthlyLoanPayments +=
        adjustedMonthlyLoanPayments * (loanPaymentChange / 100);

      // Calculate Assessed Value
      currentAssessedValue = (assessedValuePercent / 100) * currentHomeValue;

      // Calculate Property Tax
      currentPropertyTax = (currentAssessedValue * (propertyTaxRate / 100)) / 12;

      // Calculate Property Insurance
      currentPropertyInsurance =
        (currentHomeValue * (propertyInsuranceRate / 100)) / 12;

      // PMI Calculation Logic
      const ltv = (balance / homeValue) * 100; // Calculate LTV at the start of the year
      if (ltv > 80 && hasPMI) {
        const annualPMI = (pmiRate / 100) * balance; // Annual PMI premium
        currentPMIPayment = annualPMI / 12; // Monthly PMI payment
      } else {
        currentPMIPayment = 0; // Stop PMI for the year
        hasPMI = false; // Permanently disable PMI for future years
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
    };

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

    amortizationSchedule.push(row);

    balance = endingBalance;
    currentHomeValue = endingHomeValue;
  }

  return amortizationSchedule;
};