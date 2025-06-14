import {
  benefitIcon1,
  benefitIcon2,
  benefitIcon3,
  benefitIcon4,
  benefitImage2,
  chromecast,
  disc02,
  discord,
  discordBlack,
  facebook,
  figma,
  file02,
  git,
  github,
  homeSmile,
  instagram,
  meta,
  notification2,
  notification3,
  notification4,
  notion,
  openai,
  plusSquare,
  react,
  recording01,
  recording03,
  roadmap2,
  roadmap3,
  searchMd,
  sliders04,
  telegram,
  twitter,
  yourlogo,
} from '../assets'

export const navigation = [
  {
    id: '0',
    title: 'Features',
    url: '#features',
  },
  {
    id: '1',
    title: 'Pricing',
    url: '#pricing',
  },
  {
    id: '2',
    title: 'How to use',
    url: '#how-to-use',
  },
  {
    id: '3',
    title: 'Roadmap',
    url: '#roadmap',
  },
  {
    id: '5',
    title: 'Sign in',
    url: '/login',
    onlyMobile: true,
  },
]

export const heroIcons = [homeSmile, file02, searchMd, plusSquare]

export const notificationImages = [notification4, notification3, notification2]

export const companyLogos = [yourlogo, yourlogo, yourlogo, yourlogo, yourlogo]

export const brainwaveServices = ['Photo generating', 'Photo enhance', 'Seamless Integration']

export const brainwaveServicesIcons = [recording03, recording01, disc02, chromecast, sliders04]

export const roadmap = [
  {
    id: '1',
    title: 'Branch Health Monitoring',
    text: 'Automatically monitor the health of each branch, providing alerts for potential issues like merge conflicts, stale branches, or deviations from coding standards.',
    date: 'May 2024',
    status: 'progress',
    imageUrl: roadmap2,
    colorful: true,
  },
  {
    id: '2',
    title: 'Customizable Review Rules',
    text: "Allow users to set customized rules and guidelines for code reviews that the AI uses to evaluate pull requests, ensuring reviews are tailored to your project's specific needs.",
    date: 'May 2024',
    status: 'progress',
    imageUrl: roadmap3,
  },
]

export const collabText =
  "With smart automation and top-notch security, it's the perfect solution for teams looking to work smarter."

export const collabContent = [
  {
    id: '0',
    title: 'Seamless Integration',
    text: collabText,
  },
  {
    id: '1',
    title: 'Smart Automation',
  },
  {
    id: '2',
    title: 'Top-notch Security',
  },
]

export const collabApps = [
  {
    id: '0',
    title: 'Figma',
    icon: figma,
    width: 26,
    height: 36,
  },
  {
    id: '1',
    title: 'Notion',
    icon: notion,
    width: 34,
    height: 36,
  },
  {
    id: '2',
    title: 'Discord',
    icon: discord,
    width: 36,
    height: 28,
  },
  {
    id: '3',
    title: 'github',
    icon: github,
    width: 34,
    height: 35,
  },
  {
    id: '4',
    title: 'meta',
    icon: meta,
    width: 34,
    height: 34,
  },
  {
    id: '5',
    title: 'git',
    icon: git,
    width: 34,
    height: 34,
  },
  {
    id: '6',
    title: 'openai',
    icon: openai,
    width: 26,
    height: 34,
  },
  {
    id: '7',
    title: 'react',
    icon: react,
    width: 38,
    height: 32,
  },
]

export const pricing = [
  {
    id: '0',
    title: 'Basic',
    description: 'AI chatbot, personalized recommendations',
    price: '0',
    features: [
      'An AI chatbot that can understand your queries',
      'Personalized recommendations based on your preferences',
      'Ability to explore the app and its features without any cost',
    ],
  },
  {
    id: '1',
    title: 'Premium',
    description: 'Advanced AI chatbot, priority support, analytics dashboard',
    price: '9.99',
    features: [
      'An advanced AI chatbot that can understand complex queries',
      'An analytics dashboard to track your conversations',
      'Priority support to solve issues quickly',
    ],
  },
  {
    id: '2',
    title: 'Enterprise',
    description: 'Custom AI chatbot, advanced analytics, dedicated account',
    price: null,
    features: [
      'An AI chatbot that can understand your queries',
      'Personalized recommendations based on your preferences',
      'Ability to explore the app and its features without any cost',
    ],
  },
]

export const benefits = [
  {
    id: '0',
    title: 'Real-Time Updates',
    text: 'Instantly receive notifications for new pull requests and updates, keeping you in sync with your team’s progress.',
    backgroundUrl: './src/home/assets/benefits/card-1.svg',
    iconUrl: benefitIcon3,
    imageUrl: benefitImage2,
  },
  {
    id: '1',
    title: 'Automated Difference Analysis',
    text: 'Quickly compare changes between branches with our automated diff tool, streamlining your review process.',
    backgroundUrl: './src/home/assets/benefits/card-2.svg',
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: '2',
    title: 'AI-Powered Code Review',
    text: 'Improve code quality with AI-driven insights, helping you identify issues and enhance your codebase efficiently.',
    backgroundUrl: './src/home/assets/benefits/card-3.svg',
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: '3',
    title: 'Fast responding',
    text: 'Lets users quickly find answers to their questions without having to search through multiple sources.',
    backgroundUrl: './src/home/assets/benefits/card-4.svg',
    iconUrl: benefitIcon4,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: '4',
    title: 'Secure Connection',
    text: 'Connect to GitHub with confidence. Our secure authentication ensures your data and access credentials are protected, providing peace of mind while you work.',
    backgroundUrl: './src/home/assets/benefits/card-5.svg',
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
]

export const socials = [
  {
    id: '0',
    title: 'Discord',
    iconUrl: discordBlack,
    url: '#',
  },
  {
    id: '1',
    title: 'Twitter',
    iconUrl: twitter,
    url: '#',
  },
  {
    id: '2',
    title: 'Instagram',
    iconUrl: instagram,
    url: '#',
  },
  {
    id: '3',
    title: 'Telegram',
    iconUrl: telegram,
    url: '#',
  },
  {
    id: '4',
    title: 'Facebook',
    iconUrl: facebook,
    url: '#',
  },
]