const { referralFees, weightHandlingFees, closingFees, otherFees } = require('../data/fees');

function calculateReferralFee(category, price) {
  try {
    let feeStructure;


    if (category.startsWith('Automotive')) {
      if (category.includes('Helmets')) {
        feeStructure = referralFees.automotive.helmetsAndGloves;
      } else if (category.includes('Tyres')) {
        feeStructure = referralFees.automotive.tyresAndRims;
      } else if (category.includes('Vehicles')) {
        return price * (referralFees.automotive.vehicles.percentage / 100);
      }
    } else if (category.startsWith('Baby')) {
      feeStructure = referralFees.baby.hardlines;
    } else if (category === 'Books') {
      feeStructure = referralFees.books;
    }

    if (!feeStructure) 
          return price * 0.15; // Dft. rate

    for (const tier of feeStructure) {
      if (('maxPrice' in tier && price <= tier.maxPrice) || 
          ('minPrice' in tier && price > tier.minPrice)) {
        return price * (tier.percentage / 100);
      }
    }

    return price * 0.15; // Dft. fallback
  } catch (error) {
    console.error('Error in calculateReferralFee:', error);
    throw error;
  }
}

function calculateWeightHandlingFee(mode, weight, serviceLevel, location, size) {
  try {
    if (mode === 'Easy Ship') {
      const fees = weightHandlingFees.easyShip;
      const sizeFees = size === 'Standard' ? fees.standard : fees.heavyBulky;

      if (size === 'Standard') {
        if (weight <= 0.5) {
          return sizeFees.first500g[location.toLowerCase()];
        } else if (weight <= 1) {
          return sizeFees.first500g[location.toLowerCase()] + 
                 sizeFees.additional500gUpTo1kg[location.toLowerCase()];
        } else if (weight <= 5) {
          return sizeFees.first500g[location.toLowerCase()] +
                 sizeFees.additional500gUpTo1kg[location.toLowerCase()] +
                 (Math.ceil(weight - 1) * sizeFees.additionalKgAfter1kg[location.toLowerCase()]);
        } else {
          return sizeFees.first500g[location.toLowerCase()] +
                 sizeFees.additional500gUpTo1kg[location.toLowerCase()] +
                 (4 * sizeFees.additionalKgAfter1kg[location.toLowerCase()]) +
                 (Math.ceil(weight - 5) * sizeFees.additionalKgAfter5kg[location.toLowerCase()]);
        }
      } else {
        if (weight <= 12) {
          return sizeFees.first12kg[location.toLowerCase()];
        } else {
          return sizeFees.first12kg[location.toLowerCase()] +
                 (Math.ceil(weight - 12) * sizeFees.additionalKgAfter12kg[location.toLowerCase()]);
        }
      }
    }

    if (mode === 'FBA') {
      const fees = weightHandlingFees.fba.standard[serviceLevel.toLowerCase()];
      if (!fees) {
        throw new Error(`Weight handling fees not defined for service level: ${serviceLevel}`);
      }
      if (weight <= 0.5) return fees.first500g;
      if (weight <= 1) return fees.first500g + fees.additional500gUpTo1kg;
      if (weight <= 5) {
        return fees.first500g + fees.additional500gUpTo1kg +
               (Math.ceil(weight - 1) * fees.additionalKgAfter1kg);
      }
      return fees.first500g + fees.additional500gUpTo1kg +
             (4 * fees.additionalKgAfter1kg) +
             (Math.ceil(weight - 5) * fees.additionalKgAfter5kg);
    }

    return 0;
  } catch (error) {
    console.error('Error in calculateWeightHandlingFee:', error);
    throw error;
  }
}

function calculateClosingFee(mode, price) {
  try {
    const getFeeRange = (price) => {
      if (price <= 250) return 'upTo250';
      if (price <= 500) return 'upTo500';
      if (price <= 1000) return 'upTo1000';
      return 'above1000';
    };

    const range = getFeeRange(price);

    if (mode === 'FBA') {
      return closingFees.fba.normal[range];
    } else if (mode === 'Easy Ship') {
      return closingFees.easyShip.standard[range];
    } else if (mode === 'Self Ship') {
      return closingFees.selfShip[range];
    }

    return 0;
  } catch (error) {
    console.error('Error in calculateClosingFee:', error);
    throw error;
  }
}

function calculatePickAndPackFee(mode, size) {
  try {
    if (mode !== 'FBA') return 0;
    return size === 'Standard' ? otherFees.pickAndPack.standard : otherFees.pickAndPack.oversizeHeavyBulky;
  } catch (error) {
    console.error('Error in calculatePickAndPackFee:', error);
    throw error;
  }
}

function calculateFees(data, feeStructures) {
  try {
    const referralFee = calculateReferralFee(data.productCategory, data.sellingPrice);
    const weightHandlingFee = calculateWeightHandlingFee(
      data.shippingMode,
      data.weight,
      data.serviceLevel,
      data.location,
      data.productSize
    );
    const closingFee = calculateClosingFee(data.shippingMode, data.sellingPrice);
    const pickAndPackFee = calculatePickAndPackFee(data.shippingMode, data.productSize);

    const totalFees = referralFee + weightHandlingFee + closingFee + pickAndPackFee;
    const netEarnings = data.sellingPrice - totalFees;

    return {
      referralFee,
      weightHandlingFee,
      closingFee,
      pickAndPackFee,
      totalFees,
      netEarnings
    };
  } catch (error) {
    console.error('Error in calculateFees:', error);
    throw error;
  }
}

module.exports = {
  calculateFees
};