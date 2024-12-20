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
  
  