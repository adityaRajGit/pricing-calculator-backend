const express = require('express');
const cors = require('cors');
const { calculateFees } = require('./services/feeCalculator');

const app = express();
app.use(cors());
app.use(express.json());

const feeStructures = {
  referralFees: {
    'Automotive - Helmets & Riding Gloves': [
      { maxPrice: 500, percentage: 6.50 },
      { minPrice: 500, percentage: 8.50 }
    ],
    'Automotive - Tyres & Rims': [
      { maxPrice: 500, percentage: 5.00 },
      { minPrice: 500, percentage: 7.00 }
    ],
    'Automotive Vehicles': { percentage: 5.00 },
    'Automotive - Parts & Accessories': [
      { maxPrice: 500, percentage: 13.00 },
      { minPrice: 500, percentage: 14.00 }
    ],
    'Automotive - Cleaning Kits': [
      { maxPrice: 500, percentage: 9.00 },
      { minPrice: 500, percentage: 12.00 }
    ],
    'Baby - Hardlines': [
      { maxPrice: 300, percentage: 6.00 },
      { maxPrice: 500, percentage: 8.50 },
      { maxPrice: 1000, percentage: 6.00 },
      { minPrice: 1000, percentage: 7.50 }
    ],
    'Baby - Strollers': [
      { maxPrice: 300, percentage: 4.00 },
      { maxPrice: 1000, percentage: 6.00 },
      { minPrice: 1000, percentage: 10.00 }
    ],
    'Baby - Diapers': [
      { maxPrice: 300, percentage: 5.00 },
      { maxPrice: 500, percentage: 5.50 },
      { minPrice: 500, percentage: 9.50 }
    ],
    'Books': [
      { maxPrice: 250, percentage: 3.00 },
      { maxPrice: 500, percentage: 4.50 },
      { maxPrice: 1000, percentage: 9.00 }
    ]
  },
  
  weightHandlingFees: {
    'Easy Ship': {
      Standard: {
        first500g: {
          Local: 43,
          Regional: 54.5,
          National: 76
        },
        additional500gUpTo1kg: {
          Local: 13,
          Regional: 17,
          National: 25
        },
        additionalKgAfter1kg: {
          Local: 21,
          Regional: 27,
          National: 33
        },
        additionalKgAfter5kg: {
          Local: 12,
          Regional: 13,
          National: 16
        }
      },
      'Heavy & Bulky': {
        first12kg: {
          Local: 192,
          Regional: 277,
          National: 371
        },
        additionalKgAfter12kg: {
          Local: 5,
          Regional: 6,
          National: 12
        }
      }
    },
    'FBA': {
      Standard: {
        Premium: {
          first500g: 29,
          additional500gUpTo1kg: 13,
          additionalKgAfter1kg: 21,
          additionalKgAfter5kg: 12
        },
        Standard: {
          first500g: 35,
          additional500gUpTo1kg: 13,
          additionalKgAfter1kg: 21,
          additionalKgAfter5kg: 12
        },
        Basic: {
          first500g: 41,
          additional500gUpTo1kg: 13,
          additionalKgAfter1kg: 21,
          additionalKgAfter5kg: 12
        }
      }
    }
  },
  
  closingFees: {
    FBA: {
      normal: {
        upTo250: 25,
        upTo500: 20,
        upTo1000: 25,
        above1000: 50
      },
      exception: {
        upTo250: 12,
        upTo500: 12,
        upTo1000: 25,
        above1000: 70
      }
    },
    'Easy Ship': {
      standard: {
        upTo250: 4,
        upTo500: 9,
        upTo1000: 30,
        above1000: 61
      }
    },
    'Self Ship': {
      upTo250: 7,
      upTo500: 20,
      upTo1000: 41,
      above1000: 80
    }
  },
  
  otherFees: {
    pickAndPack: {
      Standard: 14,
      'Heavy & Bulky': 26
    },
    storage: 45, 
    removal: {
      standard: {
        standard: 10,
        expedited: 30
      },
      heavyBulky: {
        standard: 100,
        expedited: 100
      }
    }
  }
};

app.post('/api/v1/profitability-calculator', async (req, res) => {
  try {
    const {
      productCategory,
      sellingPrice,
      weight,
      shippingMode,
      serviceLevel,
      productSize,
      location
    } = req.body;

    // Input validation
    if (!productCategory || !sellingPrice || !weight) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    const result = calculateFees({
      productCategory,
      sellingPrice,
      weight,
      shippingMode,
      serviceLevel,
      productSize,
      location
    }, feeStructures);

    res.json(result);
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.get('/api/v1/fee-structures', (req, res) => {
  res.json(feeStructures);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something broke!',
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});