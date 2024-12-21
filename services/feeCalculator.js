function calculateReferralFee(category, price, feeStructures) {
  const categoryFees = feeStructures.referralFees[category];
  
  if (!categoryFees) {
    throw new Error(`Unknown category: ${category}`);
  }

  if (Array.isArray(categoryFees)) {
        const applicableFee = categoryFees.find(tier => 
      (tier.maxPrice && price <= tier.maxPrice) || 
      (tier.minPrice && price > tier.minPrice)
    );
    return (price * applicableFee.percentage) / 100;
  } else {
    
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

function calculateClosingFee(price, feeStructures) {
  const fees = feeStructures.closingFees.standard;
  
  if (price <= 250) return fees.upTo250;
  if (price <= 500) return fees.upTo500;
  if (price <= 1000) return fees.upTo1000;
  return fees.above1000;
}

function calculatePickAndPackFee(productSize, feeStructures) {
  return feeStructures.pickAndPackFees[productSize];
}

function calculateFees(data, feeStructures) {
  const referralFee = calculateReferralFee(
    data.productCategory,
    data.sellingPrice,
    feeStructures
  );

  const weightHandlingFee = calculateWeightHandlingFee(
    data.weight,
    data.shippingMode,
    data.serviceLevel,
    data.location,
    feeStructures
  );

  const closingFee = calculateClosingFee(
    data.sellingPrice,
    feeStructures
  );

  const pickAndPackFee = calculatePickAndPackFee(
    data.productSize,
    feeStructures
  );

  const totalFees = referralFee + weightHandlingFee + closingFee + pickAndPackFee;
  const netEarnings = data.sellingPrice - totalFees;

  return {
    breakdown: {
      referralFee,
      weightHandlingFee,
      closingFee,
      pickAndPackFee
    },
    totalFees,
    netEarnings
  };
}

module.exports = {
  calculateFees
};
