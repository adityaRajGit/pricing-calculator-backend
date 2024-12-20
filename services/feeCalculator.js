function calculateReferralFee(category, price, feeStructures) {
    const categoryFees = feeStructures.referralFees[category];
    
    if (!categoryFees) {
      throw new Error(`Unknown category: ${category}`);
    }
  
    if (Array.isArray(categoryFees)) {
      // For tiered pricing
      const applicableFee = categoryFees.find(tier => 
        (tier.maxPrice && price <= tier.maxPrice) || 
        (tier.minPrice && price > tier.minPrice)
      );
      return (price * applicableFee.percentage) / 100;
    } else {
      // For flat percentage
      return (price * categoryFees.percentage) / 100;
    }
  }
  
  function calculateWeightHandlingFee(weight, shippingMode, serviceLevel, location, feeStructures) {
    const fees = feeStructures.weightHandlingFees[shippingMode]?.[serviceLevel];
    if (!fees) {
      throw new Error('Invalid shipping mode or service level');
    }
  
    let totalFee = 0;
    const weightInGrams = weight * 1000;
  
    if (weightInGrams <= 500) {
      totalFee = fees.first500g[location];
    } else if (weightInGrams <= 1000) {
      totalFee = fees.first500g[location] + fees.additional500gUpTo1kg[location];
    } else {
      const additionalKgs = Math.ceil((weightInGrams - 1000) / 1000);
      totalFee = fees.first500g[location] + 
                 fees.additional500gUpTo1kg[location] + 
                 (additionalKgs * fees.additionalKgAfter1kg[location]);
    }
  
    return totalFee;
  }