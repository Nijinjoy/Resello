export type Language = 'en' | 'ar';

export type OnboardingPageCopy = {
  eyebrow: string;
  headline: string;
  body: string;
};

type Strings = {
  skip: string;
  continue: string;
  getStarted: string;
  haveAccount: string;
  pageOf: (page: number, total: number) => string;
  onboarding: [OnboardingPageCopy, OnboardingPageCopy, OnboardingPageCopy];
};

// Arabic copy should be reviewed by a native speaker before release.
export const strings: Record<Language, Strings> = {
  en: {
    skip: 'Skip',
    continue: 'Continue',
    getStarted: 'Get Started',
    haveAccount: 'I already have an account',
    pageOf: (page, total) => `Page ${page} of ${total}`,
    onboarding: [
      {
        eyebrow: 'Discover great deals',
        headline: 'Pre-Loved. Better Priced.',
        body: 'Discover quality pre-owned products from people across the UAE and save more on the things you love.',
      },
      {
        eyebrow: 'Sell what you no longer need',
        headline: 'Turn Clutter Into Cash.',
        body: 'List items in minutes, connect with buyers, and give your unused belongings a new home.',
      },
      {
        eyebrow: 'Shop smarter. Live greener.',
        headline: 'A Second Life for Every Find.',
        body: 'Make smarter purchases, reduce waste, and join a community building a more sustainable UAE.',
      },
    ],
  },
  ar: {
    skip: 'تخطي',
    continue: 'متابعة',
    getStarted: 'ابدأ الآن',
    haveAccount: 'لدي حساب بالفعل',
    pageOf: (page, total) => `الصفحة ${page} من ${total}`,
    onboarding: [
      {
        eyebrow: 'اكتشف عروضاً رائعة',
        headline: 'مستعمل بعناية. بسعر أفضل.',
        body: 'اكتشف منتجات مستعملة عالية الجودة من أشخاص في جميع أنحاء الإمارات، ووفّر أكثر على الأشياء التي تحبها.',
      },
      {
        eyebrow: 'بِع ما لم تعد تحتاجه',
        headline: 'حوّل الأغراض الزائدة إلى نقود.',
        body: 'اعرض منتجاتك خلال دقائق، وتواصل مع المشترين، وامنح أغراضك غير المستخدمة بيتاً جديداً.',
      },
      {
        eyebrow: 'تسوّق بذكاء. عِش بشكل أكثر استدامة.',
        headline: 'حياة ثانية لكل منتج.',
        body: 'تسوّق بذكاء، وقلّل الهدر، وانضم إلى مجتمع يبني إماراتٍ أكثر استدامة.',
      },
    ],
  },
};
