import React from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
  "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", 
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", 
  "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const creditScores = [
  { label: "800 - 850", value: "800-850" },
  { label: "740 - 799", value: "740-799" },
  { label: "670 - 739", value: "670-739" },
  { label: "580 - 669", value: "580-669" },
  { label: "350 - 579", value: "350-579" },
];

interface CalculatorInputsProps {
  principal: number;
  setPrincipal: (value: number) => void;
  rate: number;
  setRate: (value: number) => void;
  term: number;
  setTerm: (value: number) => void;
  homeValue: number;
  setHomeValue: (value: number) => void;
  annualIncrease: number;
  setAnnualIncrease: (value: number) => void;
  income: number;
  setIncome: (value: number) => void;
  incomeGrowth: number;
  setIncomeGrowth: (value: number) => void;
  loanPayments: number;
  setLoanPayments: (value: number) => void;
  loanPaymentChange: number;
  setLoanPaymentChange: (value: number) => void;
  creditScore: string;
  setCreditScore: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  ownershipYears: number;
  setOwnershipYears: (value: number) => void;
  sellingCostsPercent: number;
  setSellingCostsPercent: (value: number) => void;
  pmiRate: number;
  setPmiRate: (value: number) => void;
  propertyTaxRate: number;
  setPropertyTaxRate: (value: number) => void;
  propertyInsuranceRate: number;
  setPropertyInsuranceRate: (value: number) => void;
  maintenanceExpenses: number;
  setMaintenanceExpenses: (value: number) => void;
  hoaFees: number;
  setHoaFees: (value: number) => void;
  assessedValuePercent: number;
  setAssessedValuePercent: (value: number) => void;
}

const CalculatorInputs: React.FC<CalculatorInputsProps> = ({
  principal,
  setPrincipal,
  rate,
  setRate,
  term,
  setTerm,
  homeValue,
  setHomeValue,
  annualIncrease,
  setAnnualIncrease,
  income,
  setIncome,
  incomeGrowth,
  setIncomeGrowth,
  loanPayments,
  setLoanPayments,
  loanPaymentChange,
  setLoanPaymentChange,
  creditScore,
  setCreditScore,
  state,
  setState,
  ownershipYears,
  setOwnershipYears,
  sellingCostsPercent,
  setSellingCostsPercent,
  pmiRate,
  setPmiRate,
  propertyTaxRate,
  setPropertyTaxRate,
  propertyInsuranceRate,
  setPropertyInsuranceRate,
  maintenanceExpenses,
  setMaintenanceExpenses,
  hoaFees,
  setHoaFees,
  assessedValuePercent,
  setAssessedValuePercent,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputField
        label="Loan Amount"
        value={principal.toString()}
        onChange={(value) =>
          setPrincipal(parseFloat(value.replace(/[$,]/g, "")) || 0)
        }
        isCurrency
      />
      <InputField
        label="Interest Rate (%)"
        value={rate.toString()}
        onChange={(value) => setRate(parseFloat(value.replace(/%/g, "")) || 0)}
        isPercentage
      />
      <InputField
        label="Loan Term (Years)"
        value={term.toString()}
        onChange={(value) => setTerm(parseInt(value, 10))}
        type="number"
      />
      <InputField
        label="Home Value"
        value={homeValue.toString()}
        onChange={(value) =>
          setHomeValue(parseFloat(value.replace(/[$,]/g, "")) || 0)
        }
        isCurrency
      />
      <InputField
        label="Annual Home Value Increase (%)"
        value={annualIncrease.toString()}
        onChange={(value) => setAnnualIncrease(parseFloat(value))}
        type="text"
        step={0.01}
        isPercentage
        allowNegative
      />
      <InputField
        label="PMI Rate (%)"
        value={pmiRate.toString()}
        onChange={(value) => setPmiRate(parseFloat(value))}
        type="text"
        step={0.01}
        isPercentage
      />
      <InputField
        label="Property Insurance Rate (%)"
        value={propertyInsuranceRate.toString()}
        onChange={(value) => setPropertyInsuranceRate(parseFloat(value))}
        type="text"
        step={0.01}
        isPercentage
      />
      <InputField
        label="Monthly Maintenance Expenses ($)"
        value={maintenanceExpenses.toString()}
        onChange={(value) =>
          setMaintenanceExpenses(parseFloat(value.replace(/[$,]/g, "")) || 0)
        }
        isCurrency
      />
      <InputField
        label="Monthly HOA Fees ($)"
        value={hoaFees.toString()}
        onChange={(value) =>
          setHoaFees(parseFloat(value.replace(/[$,]/g, "")) || 0)
        }
        isCurrency
      />
      <InputField
        label="Annual Household Income"
        value={income.toString()}
        onChange={(value) =>
          setIncome(parseFloat(value.replace(/[$,]/g, "")) || 0)
        }
        isCurrency
      />
      <InputField
        label="Annual Income Growth (%)"
        value={incomeGrowth.toString()}
        onChange={(value) => setIncomeGrowth(parseFloat(value))}
        type="text"
        step={0.01}
        isPercentage
        allowNegative
      />
      <InputField
        label="Monthly Loan Payments"
        value={loanPayments.toString()}
        onChange={(value) =>
          setLoanPayments(parseFloat(value.replace(/[$,]/g, "")) || 0)
        }
        isCurrency
      />
      <InputField
        label="Annual Loan Payment Change (%)"
        value={loanPaymentChange.toString()}
        onChange={(value) => setLoanPaymentChange(parseFloat(value))}
        type="text"
        step={0.01}
        isPercentage
        allowNegative
      />
      <InputField
        label="How Long Will You Own This Home (Years)"
        value={ownershipYears.toString()}
        onChange={(value) => setOwnershipYears(parseInt(value, 10))}
        type="number"
      />
      <InputField
        label="Selling Costs (%)"
        value={sellingCostsPercent.toString()}
        onChange={(value) =>
          setSellingCostsPercent(parseFloat(value.replace(/%/g, "")) || 0)
        }
        isPercentage
      />
      <SelectField
        label="State"
        value={state}
        options={states.map((state) => ({ label: state, value: state }))}
        onChange={(e) => setState(e.target.value)}
      />
      <SelectField
        label="Credit Score"
        value={creditScore}
        options={creditScores}
        onChange={(e) => setCreditScore(e.target.value)}
      />
      <InputField
        label="Assessed Value (% of Market Value)"
        value={assessedValuePercent.toString()}
        onChange={(value) =>
          setAssessedValuePercent(parseFloat(value.replace(/%/g, "")) || 0)
        }
        isPercentage
      />
      <InputField
        label="Property Tax Rate (%)"
        value={propertyTaxRate.toString()}
        onChange={(value) => setPropertyTaxRate(parseFloat(value))}
        type="text"
        step={0.01}
        isPercentage
      />
    </div>
  );
};

export default CalculatorInputs;