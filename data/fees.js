const referralFees = {
    automotive: {
      helmetsAndGloves: [
        { maxPrice: 500, percentage: 6.50 },
        { minPrice: 500, percentage: 8.50 }
      ],
      tyresAndRims: [
        { maxPrice: 500, percentage: 5.00 },
        { minPrice: 500, percentage: 7.00 }
      ],
      vehicles: { percentage: 5.00 }
    },
    baby: {
      hardlines: [
        { maxPrice: 300, percentage: 6.00 },
        { maxPrice: 500, percentage: 8.50 },
        { maxPrice: 1000, percentage: 6.00 }
      ]
    },
    books: { percentage: 15.00 }
  };
  
  const weightHandlingFees = {
    easyShip: {
      standard: {
        first500g: { local: 20, zonal: 30, national: 40 },
        additional500gUpTo1kg: { local: 10, zonal: 15, national: 20 },
        additionalKgAfter1kg: { local: 15, zonal: 20, national: 25 },
        additionalKgAfter5kg: { local: 20, zonal: 25, national: 30 }
      },
      heavyBulky: {
        first12kg: { local: 100, zonal: 150, national: 200 },
        additionalKgAfter12kg: { local: 10, zonal: 15, national: 20 }
      }
    },
    fba: {
      standard: {
        standard: {
          first500g: 50,
          additional500gUpTo1kg: 30,
          additionalKgAfter1kg: 20,
          additionalKgAfter5kg: 25
        }
      }
    }
  };
  
  const closingFees = {
    fba: {
      normal: {
        upTo250: 5.00,
        upTo500: 10.00,
        upTo1000: 15.00,
        above1000: 20.00
      }
    },
    easyShip: {
      standard: {
        upTo250: 5.00,
        upTo500: 10.00,
        upTo1000: 15.00,
        above1000: 20.00
      }
    },
    selfShip: {
      upTo250: 5.00,
      upTo500: 10.00,
      upTo1000: 15.00,
      above1000: 20.00
    }
  };
  
  const otherFees = {
    pickAndPack: {
      standard: 14,
      oversizeHeavyBulky: 26
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
  };
  
  module.exports = {
    referralFees,
    weightHandlingFees,
    closingFees,
    otherFees
  };