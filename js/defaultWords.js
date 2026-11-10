/**
 * Default Fiverr Word List
 * Words and phrases that commonly trigger Fiverr's moderation: off-platform
 * contact, outside payments, external marketplaces, and review manipulation.
 *
 * Words are grouped by category so the interface can explain *why* a term is
 * risky instead of just showing a flat list. Bump VERSION whenever this list
 * changes so existing users receive the new words and categories.
 */

(function() {
  const VERSION = 4;

  const GROUPS = {
    contact: [
      // Messaging apps
      'whatsapp', 'whats app', 'watsapp', 'whatsapp number', 'skype', 'skype id',
      'telegram', 'telegram id', 'telegram username', 'discord', 'discord id',
      'viber', 'wechat', 'snapchat', 'messenger', 'facebook', 'instagram',
      'linkedin', 'twitter', 'tiktok', 'hangouts', 'zoom', 'google meet',
      'slack', 'signal app', 'signal', 'kik', 'line app', 'google chat',
      'microsoft teams', 'calendly', 'zoom link', 'meeting link',
      'facetime', 'teams link', 'whatsapp link', 'telegram link',
      'skype link', 'discord link', 'my whatsapp', 'my telegram',
      'my skype', 'my discord', 'contact me on', 'message me on',
      'chat with me on', 'reach me on', 'add me on', 'connect with me on',

      // Email and contact details
      'email', 'e-mail', 'mail me', 'email me', 'my email', 'personal email',
      'business email', 'gmail', 'gmail.com', 'yahoo', 'yahoo.com', 'hotmail',
      'hotmail.com', 'outlook', 'outlook.com', 'protonmail', 'icloud',
      'phone', 'phone number', 'mobile', 'mobile number', 'telephone',
      'my number', 'personal number', 'call me', 'text me', 'sms', 'sms me',
      'dm me', 'contact me', 'contact details', 'contact information',
      'reach me', 'my contact', 'my address', 'home address', 'mailing address',
      'inbox me', 'ping me', 'drop me a message',
      'website', 'my site', 'dot com', '.com', 'www'
    ],

    payment: [
      'pay', 'paying', 'paid', 'payment', 'payments', 'paypal', 'pay pal',
      'venmo', 'payoneer', 'transferwise', 'wise', 'cashapp', 'cash app',
      'zelle', 'stripe', 'skrill', 'neteller', 'revolut', 'western union',
      'moneygram', 'bkash', 'nagad', 'bank', 'bank transfer', 'wire transfer',
      'wire', 'bank account', 'routing number', 'iban', 'swift code',
      'credit card', 'debit card', 'card details', 'cvv', 'cash', 'cheque',
      'check payment', 'invoice', 'direct payment', 'advance payment',
      'upfront payment', 'full payment', 'half payment', 'part payment',
      'payment link', 'send money', 'receive money', 'direct pay',
      'pay directly', 'bitcoin', 'btc', 'crypto', 'cryptocurrency',
      'ethereum', 'usdt', 'binance', 'gift card', 'amazon gift card',
      'apple pay', 'google pay', 'gumroad', 'ko-fi', 'buy me a coffee',
      'patreon', 'money order', 'remitly', 'xoom', 'pay outside fiverr',
      'payment outside fiverr', 'pay outside the platform',
      'payment outside the platform', 'pay me directly',
      'send payment directly', 'friends and family payment',
      'friends & family payment', 'crypto wallet', 'wallet address', 'gift cards'
    ],

    platform: [
      'outside fiverr', 'off fiverr', 'outside of fiverr', 'off of fiverr',
      'outside platform', 'outside the platform', 'off platform',
      'off the platform', 'direct deal', 'direct contract', 'work directly',
      'hire me directly', 'hire directly', 'private deal', 'upwork',
      'freelancer', 'freelancer.com', 'peopleperhour', 'toptal', 'fivver',
      'fiverr.com', 'fiverr alternative', 'other platform', 'another platform',
      'off-site', 'offsite', 'outside fiverr platform',
      'take this off platform', 'take it off platform',
      'continue outside fiverr', 'order on upwork', 'hire me on upwork'
    ],

    review: [
      '5 star', '5 stars', '5-star', 'five star', 'five stars', 'good review',
      'positive review', 'leave a review', 'leave feedback', 'give me a review',
      'give me feedback', 'rate me', 'rate us', 'review me', 'bad review',
      'negative review', 'star rating', 'review rating', 'feedback',
      'testimonial', 'change your review', 'update your review',
      'remove your review', 'delete your review', 'leave five stars',
      'leave 5 stars', 'five-star rating', '5-star rating',
      'review in exchange for', 'feedback in exchange for'
    ],

    sensitive: [
      'password', '100%', '100 percent', 'otp', 'one time password',
      'verification code', 'login details', 'account details', 'id card',
      'passport', 'social security', 'ssn', 'national id', 'passcode',
      'security code', '2fa code', 'two-factor code', 'bank details',
      'banking details', 'credit card number', 'debit card number'
    ]
  };

  const CATEGORY_META = {
    contact: { label: 'Contact' },
    payment: { label: 'Payment' },
    platform: { label: 'Off-platform' },
    review: { label: 'Reviews' },
    sensitive: { label: 'Sensitive' }
  };

  // Keep one entry per word even if a phrase appears in more than one group.
  const WORDS = [];
  const WORD_CATEGORY = {};

  Object.keys(GROUPS).forEach((category) => {
    GROUPS[category].forEach((word) => {
      const key = word.toLowerCase();
      if (WORD_CATEGORY[key]) return;
      WORD_CATEGORY[key] = category;
      WORDS.push(word);
    });
  });

  window.DefaultWords = {
    VERSION,
    WORDS,
    GROUPS,
    CATEGORY_META,

    getCategory(word) {
      if (!word || typeof word !== 'string') return 'sensitive';
      return WORD_CATEGORY[word.trim().toLowerCase()] || 'sensitive';
    },

    /** Builds fresh word objects ready for storage. */
    build() {
      const createdAt = new Date().toISOString();
      return WORDS.map((word, i) => ({
        id: `def-${i + 1}`,
        word,
        category: WORD_CATEGORY[word.toLowerCase()] || 'sensitive',
        active: true,
        createdAt
      }));
    }
  };
})();
