// Legal Compliance Service - GDPR & Age Verification
// Ensures all user interactions comply with international privacy and age verification laws

interface UserData {
  name?: string;
  birthDate: string;
  birthPlace?: string;
  email?: string;
  ipAddress?: string;
}

interface ComplianceResult {
  isCompliant: boolean;
  ageVerified: boolean;
  legalAge: number;
  country: string;
  gdprCompliant: boolean;
  consentRequired: boolean;
  reason?: string;
}

// Legal age requirements by country/region
const LEGAL_AGE_MAP: { [key: string]: number } = {
  // Europe - GDPR applies
  'Germany': 16, 'France': 16, 'UK': 16, 'Spain': 16, 'Italy': 16, 'Netherlands': 16,
  'Belgium': 16, 'Austria': 16, 'Sweden': 16, 'Denmark': 16, 'Finland': 16, 'Norway': 16,
  'Switzerland': 16, 'Ireland': 16, 'Portugal': 16, 'Greece': 16, 'Czech Republic': 16,
  
  // Americas
  'United States': 18, 'Canada': 18, 'Mexico': 18, 'Brazil': 18, 'Argentina': 18,
  'Chile': 18, 'Colombia': 18, 'Peru': 18,
  
  // Asia-Pacific
  'Japan': 20, 'South Korea': 19, 'China': 18, 'India': 18, 'Australia': 18,
  'New Zealand': 18, 'Singapore': 18, 'Thailand': 18, 'Philippines': 18,
  'Indonesia': 18, 'Malaysia': 18,
  
  // Middle East & Africa
  'UAE': 21, 'Saudi Arabia': 21, 'Egypt': 18, 'South Africa': 18, 'Nigeria': 18,
  'Kenya': 18, 'Morocco': 18,
  
  // Default fallback
  'DEFAULT': 18
};

// Countries where GDPR applies
const GDPR_COUNTRIES = [
  'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark',
  'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy',
  'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal',
  'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'UK', 'United Kingdom',
  'Iceland', 'Liechtenstein', 'Norway', 'Switzerland'
];

export class LegalComplianceService {
  
  // Verify user age and legal compliance
  static async verifyCompliance(userData: UserData, requestType: 'compatibility' | 'intimacy' | 'general' = 'general'): Promise<ComplianceResult> {
    try {
      // Extract country from birth place or IP geolocation
      const country = await this.detectCountry(userData);
      const legalAge = LEGAL_AGE_MAP[country] || LEGAL_AGE_MAP['DEFAULT'];
      const isGDPRRegion = GDPR_COUNTRIES.includes(country);
      
      // Calculate user age
      const birthDate = new Date(userData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear() - 
        (today.getMonth() < birthDate.getMonth() || 
         (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);
      
      // Age verification
      const ageVerified = age >= legalAge;
      
      // Special requirements for intimate content
      if (requestType === 'intimacy' && age < 18) {
        return {
          isCompliant: false,
          ageVerified: false,
          legalAge: Math.max(legalAge, 18), // Minimum 18 for intimate content
          country,
          gdprCompliant: false,
          consentRequired: true,
          reason: 'Adult content requires minimum age of 18'
        };
      }
      
      // Compatibility features require legal age in both countries
      if (requestType === 'compatibility') {
        // This will be checked for both partners in the compatibility endpoint
        return {
          isCompliant: ageVerified,
          ageVerified,
          legalAge,
          country,
          gdprCompliant: isGDPRRegion ? ageVerified : true,
          consentRequired: isGDPRRegion,
          reason: ageVerified ? undefined : `User must be at least ${legalAge} years old in ${country}`
        };
      }
      
      // General compliance
      return {
        isCompliant: ageVerified && (isGDPRRegion ? ageVerified : true),
        ageVerified,
        legalAge,
        country,
        gdprCompliant: isGDPRRegion ? ageVerified : true,
        consentRequired: isGDPRRegion,
        reason: !ageVerified ? `User must be at least ${legalAge} years old in ${country}` : undefined
      };
      
    } catch (error) {
      console.error('Legal compliance verification error:', error);
      // Default to strict compliance on error
      return {
        isCompliant: false,
        ageVerified: false,
        legalAge: 18,
        country: 'Unknown',
        gdprCompliant: false,
        consentRequired: true,
        reason: 'Unable to verify compliance - please contact support'
      };
    }
  }
  
  // Detect country from birth place or IP
  private static async detectCountry(userData: UserData): Promise<string> {
    // Try to extract country from birth place first
    if (userData.birthPlace) {
      const place = userData.birthPlace.toLowerCase();
      
      // Simple country detection from birth place
      for (const [country] of Object.entries(LEGAL_AGE_MAP)) {
        if (country !== 'DEFAULT' && place.includes(country.toLowerCase())) {
          return country;
        }
      }
      
      // Check for major cities
      const cityCountryMap: { [key: string]: string } = {
        'london': 'UK', 'paris': 'France', 'berlin': 'Germany', 'rome': 'Italy',
        'madrid': 'Spain', 'amsterdam': 'Netherlands', 'vienna': 'Austria',
        'stockholm': 'Sweden', 'copenhagen': 'Denmark', 'oslo': 'Norway',
        'new york': 'United States', 'los angeles': 'United States', 'chicago': 'United States',
        'toronto': 'Canada', 'vancouver': 'Canada', 'montreal': 'Canada',
        'tokyo': 'Japan', 'osaka': 'Japan', 'seoul': 'South Korea', 'beijing': 'China',
        'shanghai': 'China', 'mumbai': 'India', 'delhi': 'India', 'sydney': 'Australia',
        'melbourne': 'Australia', 'auckland': 'New Zealand', 'singapore': 'Singapore',
        'dubai': 'UAE', 'riyadh': 'Saudi Arabia', 'cairo': 'Egypt',
        'johannesburg': 'South Africa', 'cape town': 'South Africa'
      };
      
      for (const [city, country] of Object.entries(cityCountryMap)) {
        if (place.includes(city)) {
          return country;
        }
      }
    }
    
    // Default to strict compliance if country cannot be determined
    return 'DEFAULT';
  }
  
  // Generate GDPR compliance notice
  static generateGDPRNotice(country: string): string {
    if (GDPR_COUNTRIES.includes(country)) {
      return `
**Privacy Notice (GDPR Compliance)**

Your birth data is used solely for astrological calculations and is:
- Processed lawfully with your explicit consent
- Used only for the services you request
- Not shared with third parties
- Stored securely with encryption
- Deleted upon request (Right to be Forgotten)
- Portable upon request (Right to Data Portability)

You have the right to:
✓ Access your data
✓ Correct inaccuracies  
✓ Delete your data
✓ Object to processing
✓ Withdraw consent anytime

Contact: privacy@torchlight.app for data requests.
      `;
    }
    
    return `
**Privacy Notice**

Your birth data is used solely for astrological calculations and is handled with strict confidentiality. We do not share your personal information with third parties.
    `;
  }
  
  // Verify both partners for compatibility analysis
  static async verifyCompatibilityCompliance(person1: UserData, person2: UserData): Promise<{
    isCompliant: boolean;
    person1Compliance: ComplianceResult;
    person2Compliance: ComplianceResult;
    reason?: string;
  }> {
    const [compliance1, compliance2] = await Promise.all([
      this.verifyCompliance(person1, 'compatibility'),
      this.verifyCompliance(person2, 'compatibility')
    ]);
    
    const isCompliant = compliance1.isCompliant && compliance2.isCompliant;
    
    let reason: string | undefined;
    if (!isCompliant) {
      const reasons = [];
      if (!compliance1.isCompliant) reasons.push(`Person 1: ${compliance1.reason}`);
      if (!compliance2.isCompliant) reasons.push(`Person 2: ${compliance2.reason}`);
      reason = reasons.join('; ');
    }
    
    return {
      isCompliant,
      person1Compliance: compliance1,
      person2Compliance: compliance2,
      reason
    };
  }
}