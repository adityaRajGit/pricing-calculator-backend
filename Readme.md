# API for Calculating Profitability:

- Endpoint: /api/v1/profitability-calculator
- Accepts product details (e.g., category, selling price, weight, shipping mode, service level, product size, location).
- Calculates fees (referral, weight handling, closing, pick-and-pack).
- Returns a detailed breakdown of fees and net earnings.

# API for Fetching Fee Structures:


- Endpoint: /api/v1/fee-structures
- Provides the full fee structure data for integration or debugging purposes.

# Dynamic Fee Calculation:

- Uses the feeStructures object to compute fees based on various parameters like product category, weight, and shipping mode.

## Error Handling:

* Validates input for missing fields.
* Returns appropriate error messages for invalid or incomplete requests.
* Handles server errors with middleware to ensure the API responds gracefully.

# Static Fee Structure:

- Stores static fee data for referral, weight handling, closing, and other fees within the feeStructures object.

- Supports multiple product categories, shipping modes, and service levels.


## Cross-Origin Support:

* Utilizes cors middleware to allow cross-origin requests, enabling integration with frontend applications.