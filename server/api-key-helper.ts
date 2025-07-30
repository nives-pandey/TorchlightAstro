// Helper to check and manage API keys for external services

export function checkAPIKeysStatus() {
  const status = {
    freeAstrologyAPI: {
      available: !!process.env.FREE_ASTROLOGY_API_KEY,
      required: false, // Free tier available without key
      service: 'FreeAstrologyAPI.com'
    },
    stripe: {
      available: !!process.env.STRIPE_SECRET_KEY,
      required: true,
      service: 'Stripe Payments'
    },
    anthropic: {
      available: !!process.env.ANTHROPIC_API_KEY,
      required: false,
      service: 'Anthropic AI (optional)'
    },
    openai: {
      available: !!process.env.OPENAI_API_KEY,
      required: false,
      service: 'OpenAI (optional)'
    }
  };

  return status;
}

export function logAPIStatus() {
  const status = checkAPIKeysStatus();
  console.log('\n🔑 API KEYS STATUS:');
  
  for (const [name, config] of Object.entries(status)) {
    const statusIcon = config.available ? '✅' : (config.required ? '❌' : '⚠️');
    const statusText = config.available ? 'Available' : (config.required ? 'Missing (Required)' : 'Missing (Optional)');
    console.log(`${statusIcon} ${config.service}: ${statusText}`);
  }
  
  console.log('');
}

export function getAvailableServices() {
  const status = checkAPIKeysStatus();
  return Object.entries(status)
    .filter(([, config]) => config.available)
    .map(([name, config]) => ({ name, service: config.service }));
}