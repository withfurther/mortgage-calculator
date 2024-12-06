# Mortgage Calculator - Proof of Concept

## Overview

This project is a proof of concept for a Mortgage Calculator application designed to provide detailed amortization schedules and insights into various housing costs. It includes modular components, a flexible architecture, and carefully structured logic to handle mortgage-related calculations. This README serves as an interactive product requirements document to help your engineering team understand the system, its features, and how it should be implemented in production.

## Features Overview

### Calculator Inputs
- Input fields for user data supporting percentages, currency, and negative values
- Automatic percentage formatting with 2 decimals and `%` sign  
- Invalid input prevention with dynamic state updates

### Amortization Schedule
- Detailed payment calculations including principal, interest, PMI, taxes, insurance, maintenance, and HOA fees
- Adjustable parameters for income growth, loan payments, and home appreciation
- Dynamic calculation cutoff at property sale date

### Dynamic Table
- Responsive amortization schedule with detailed breakdowns
- Styled for readability
- Backend data integration

### Modular Code
- Reusable components:
  - **InputField**: Custom input handling
  - **SelectField**: Dropdown selection  
  - **Table**: Schedule display
  - **calculateAmortization**: Core calculation logic

### Interactive UX
- Auto-prepends `0` for decimal inputs
- Smart field formatting (e.g., `6.5 → 6.50%`)
- Numeric field input validation

---

## Codebase Structure

### `src/components`

#### 1. CalculatorInputs.tsx
- Handles all calculator user inputs
- Manages input field state
- Supports numeric and dropdown inputs
- Features:
  - Automatic percentage formatting
  - Negative value support
  - Invalid input prevention

#### 2. InputField.tsx
- Reusable input component for user data
- Props:
  - `label`: Field label
  - `value`: Current field value
  - `onChange`: Parent update callback
  - `type`: Input type (number/text)
  - `step`: Numeric input step size
  - `isPercentage`: Percentage formatting flag
  - `allowNegative`: Negative value flag

**Example Usage**:
```
<InputField
 label="Annual Home Value Increase (%)"
 value={annualIncrease.toString()}
 onChange={(value) => setAnnualIncrease(parseFloat(value))}
 type="text"
 step={0.01}
 isPercentage
 allowNegative
/>
```

#### 3. SelectField.tsx
- Dropdown selector component
- Props:
  - `label`: Dropdown label
  - `value`: Currently selected value
  - `options`: Array of `{ label, value }` objects
  - `onChange`: Parent update callback

**Example Usage**:
```
<SelectField
 label="State"
 value={state}
 options={states.map((state) => ({ label: state, value: state }))}
 onChange={(e) => setState(e.target.value)}
/>
```

#### 4. Table.tsx
- Displays the calculated amortization schedule
- Features:
  - Dynamically updates based on calculated data
  - Stops rows after the property sale
  - Provides a detailed breakdown of costs
- Props:
  - `schedule`: Array of schedule rows
  - `formatCurrency`: Function to format numbers as currency

**Example Usage**:
```
<Table schedule={schedule} formatCurrency={formatCurrency} />
```

---

### `src/utils`

#### **calculateAmortization.ts**
- Core logic for calculating the amortization schedule
- Handles:
  - Principal and interest payments
  - PMI calculations (stopping after 80% LTV)
  - Property taxes, insurance, maintenance, and HOA fees
  - Dynamic schedule truncation based on the property sale
- Accepts input values and returns an array of `ScheduleRow` objects for rendering

**Key Features**:
- PMI stops automatically after LTV drops below 80%
- Property taxes and insurance are recalculated annually based on the beginning home value
- Monthly maintenance and HOA fees are included in the total payment

**Example Input and Output**:
- **Input**:
```
{
  "principal": 500000,
  "rate": 3.5,
  "term": 30,
  "homeValue": 600000,
  "annualIncrease": 3,
  "ownershipYears": 10,
  "pmiRate": 0.5,
  "propertyTaxRate": 1.2,
  "propertyInsuranceRate": 0.3,
  "maintenanceExpenses": 200,
  "hoaFees": 100
}
```

- **Output**:
```
[
  {
    "year": 1,
    "fromMonth": 0,
    "toMonth": 1,
    "beginningBalance": 500000,
    "payment": 2245.22,
    "interestPayment": 1458.33,
    "principalPayment": 786.89,
    "endingBalance": 499213.11,
    "beginningHomeValue": 600000,
    "endingHomeValue": 601500,
    "pmiPayment": 208.33,
    "propertyTax": 600,
    "propertyInsurance": 150,
    "maintenance": 200,
    "hoaFees": 100,
    "totalHousingPayment": 3503.55
  },
  ...
]
```

---

## Interactive Product Requirements

### Inputs
| Label                        | Type    | Notes                                          |
|------------------------------|---------|-----------------------------------------------|
| Loan Amount                  | Currency| Initial principal amount                      |
| Interest Rate (%)            | %       | Annual interest rate                          |
| Loan Term (Years)            | Number  | Number of years for the loan term             |
| Home Value                   | Currency| Market value of the property                  |
| Annual Home Value Increase (%) | %     | Growth rate for property value                |
| PMI Rate (%)                 | %       | Private Mortgage Insurance rate               |
| Property Tax Rate (%)        | %       | Property tax rate                             |
| Property Insurance Rate (%)  | %       | Property insurance rate                       |
| Monthly Maintenance Expenses ($) | Currency | Fixed monthly maintenance expenses         |
| Monthly HOA Fees ($)         | Currency| Fixed monthly HOA fees                        |
| Annual Household Income      | Currency| User’s household income                       |
| Annual Income Growth (%)     | %       | Yearly growth in income                       |
| Monthly Loan Payments        | Currency| Initial monthly loan payments                 |
| Annual Loan Payment Change (%) | %     | Growth rate for loan payments                 |
| Ownership Duration (Years)   | Number  | How long the user plans to own the property   |
| Selling Costs (%)            | %       | Percentage of the sale price                  |

### Outputs
| Column Name              | Description                                               |
|--------------------------|-----------------------------------------------------------|
| Beginning Balance        | Starting loan balance for the month                      |
| Payment                  | Total monthly payment (Principal + Interest)             |
| Interest Payment         | Monthly interest portion                                 |
| Principal Payment        | Monthly principal portion                                |
| PMI Payment              | PMI portion of the payment                               |
| Property Tax             | Monthly property tax                                     |
| Property Insurance       | Monthly insurance cost                                   |
| Maintenance              | Fixed monthly maintenance expenses                      |
| HOA Fees                 | Fixed monthly HOA fees                                   |
| Total Housing Payment    | Sum of all monthly payments                              |
| Beginning Home Value     | Starting home value for the month                       |
| Ending Home Value        | Ending home value for the month                         |
| Sales Proceeds           | Proceeds from the property sale                         |
| Selling Costs            | Costs associated with selling the property              |
| Loan Payoff              | Remaining loan balance at sale                          |
| Net Sales Proceeds       | Final amount after selling costs and loan payoff         |

---

## Installation and Setup

1. Clone the repository:
```
git clone https://github.com/your-repo/mortgage-calculator.git
cd mortgage-calculator
```

2. Install dependencies:
```
npm install
```

3. Run the development server:
```
npm start
```

4. Access the application at:
```
http://localhost:3000
```

---

## Engineering Notes

- **Extendable Design**: Each component is reusable and can be extended for future features.
- **State Management**: Currently uses React `useState`. Consider migrating to a global state manager (e.g., Redux, Zustand) for scalability.
- **Validation**: Basic input validation is implemented. Add stricter validation for edge cases if required.
- **Testing**: Add unit and integration tests for `calculateAmortization` and key components (e.g., `InputField`, `Table`).
