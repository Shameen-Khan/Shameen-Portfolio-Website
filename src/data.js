/**
 * EDIT YOUR PORTFOLIO HERE.
 * Source: the supplied Resume 2.pdf, including embedded hyperlinks.
 * ASSUMPTIONS: dark orbital branding, editorial headline and project categories.
 * No employers, project outcomes, production status, or technology stacks are invented.
 * The resume does not specify per-project stacks: add confirmed values to `tech`.
 * PLACEHOLDERS: email and siteUrl are intentionally empty and hidden until set.
 */
export const portfolio = {
  name: 'J Shameenkhan',
  shortName: 'Shameen',
  initials: 'JS',
  role: 'Developer · AI/ML student · Author',
  location: 'Coimbatore, India',
  availability: 'Seeking software development & applied AI internships',
  headline: ['Curiosity,', 'put into orbit.'],
  introduction: 'I’m Shameen. I explore the space between intelligent technology, thoughtful design and human stories.',
  summary: 'AI and ML undergraduate with project work in interview preparation and personalized product discovery. Seeking software development and applied AI internships.',
  about: [
    'I’m a second-year B.E. student at KGISL Institute of Technology, studying Computer Science and Engineering with a specialization in Artificial Intelligence and Machine Learning.',
    'My projects explore practical uses of AI, from personalized product discovery to spoken interview practice. Alongside code, I write poetry—another way to ask questions and make sense of people.',
  ],
  // ASSUMPTION: this is a design palette, not a supplied brand standard.
  theme: { accent: '#d4b6ff', warm: '#e4b787' },
  email: '', // PLACEHOLDER: add your real email to enable the email contact button.
  siteUrl: '', // PLACEHOLDER: e.g. https://your-domain.com (no path). Enables canonical + sitemap.
  resume: '/resume.pdf',
  links: {
    linkedin: 'https://www.linkedin.com/in/shameenkhan-j',
    github: 'https://github.com/Shameen-Khan',
    unstop: 'https://unstop.com/u/shamekha78104',
    author: 'https://notionpress.com/author/1557670',
  },
  projects: [
    {
      id: 'glowsync', number: '01', title: 'GlowSync', category: 'Applied AI',
      label: 'Personalized discovery', visual: 'discovery',
      description: 'Exploring camera-based skin-tone analysis and personalized beauty-product recommendations, with links to specific products.',
      detail: 'Planned experience: sign-in, analysis, recommendations, wishlist, dashboard and price-drop notifications.',
      tags: ['Personalization', 'Product discovery'], tech: [],
      link: 'https://github.com/Shameen-Khan/GlowSync-AI', linkLabel: 'Explore repository',
    },
    {
      id: 'interview-pro', number: '02', title: 'Interview Pro', category: 'Applied AI',
      label: 'Spoken interview practice', visual: 'voice',
      description: 'An interview preparation project incorporating a voice AI component for spoken interview practice.',
      detail: 'An exploration of voice interaction as part of interview preparation.',
      tags: ['Voice AI', 'Interview preparation'], tech: [],
      link: 'https://github.com/Shameen-Khan/Interview-pro', linkLabel: 'Explore repository',
    },
    {
      id: 'tedx', number: '03', title: 'Why I Left My Book Untitled', category: 'TEDx talk',
      label: 'Ideas, spoken aloud', visual: 'talk',
      description: 'A TEDx talk delivered on the international TEDx platform about why I left my book UNTITLED.',
      detail: 'A talk connecting the questions behind my philosophical poetry collection with the courage to leave it unnamed.',
      tags: ['TEDx speaker', 'Storytelling'], tech: [],
      link: 'https://www.youtube.com/watch?v=t5KsyuXAtK4', linkLabel: 'View my talk',
    },
    {
      id: 'untitled', number: '04', title: 'UNTITLED', category: 'Writing',
      label: 'A different kind of language', visual: 'writing',
      description: 'A philosophical poetry collection exploring loneliness, grief and love. Published with Notion Press.',
      detail: 'Poetry is part of my practice of observing, questioning and finding the words for an idea.',
      tags: ['Poetry', 'Published author'], tech: [],
      link: 'https://notionpress.com/author/1557670', linkLabel: 'Visit author profile',
    },
  ],
  skills: [
    { title: 'Languages', label: '01 / FOUNDATIONS', items: ['Python', 'Java', 'C', 'SQL'] },
    { title: 'Computer science', label: '02 / THINKING', items: ['Data structures & algorithms', 'Object-oriented programming', 'Relational databases'] },
    { title: 'Development', label: '03 / BUILDING', items: ['Git', 'GitHub', 'Visual Studio Code', 'MySQL'] },
    { title: 'Design & AI tools', label: '04 / EXPLORING', items: ['Figma', 'Canva', 'Claude', 'ChatGPT'] },
  ],
  journey: [
    { date: 'SECOND YEAR', title: 'B.E. · Computer Science & Engineering', organization: 'KGISL Institute of Technology', description: 'Specialization in Artificial Intelligence and Machine Learning.' },
    { date: 'JUL 2026', title: 'Published author · UNTITLED', organization: 'Notion Press', description: 'A philosophical poetry collection exploring loneliness, grief and love.' },
    { date: 'AUG 2026', title: 'TEDx speaker · Why I Left My Book Untitled', organization: 'TEDx', description: 'Delivered a speech on the international TEDx platform.' },
    { date: 'OCT 2025', title: 'NASA International Space Apps Challenge', organization: 'Participant', description: 'Participation certificate listed in my resume.' },
  ],
  certificates: [
    { name: 'Python Essentials 1', issuer: 'Cisco Networking Academy', date: 'Nov 2025', url: 'https://drive.google.com/file/d/1-oVcronwXRrog6FD-BOVbZyXjwEu_6t7/view' },
    { name: 'Discover the Art of Prompting', issuer: 'Google', date: 'Jul 2026', url: 'https://coursera.org/verify/22ACMEB8VHXW' },
    { name: 'Introduction to Cloud Computing', issuer: 'IBM', date: 'Sep 2026', url: 'https://coursera.org/verify/9M1C8FXDANMA' },
    { name: 'Introduction to DevOps', issuer: 'IBM', date: 'Sep 2026', url: 'https://coursera.org/verify/2N8Q4KMG52W2' },
    { name: 'Introduction to Agile Development and Scrum', issuer: 'IBM', date: 'Sep 2026', url: 'https://coursera.org/verify/KNR25O3FRJB7' },
    { name: 'AI For Everyone', issuer: 'DeepLearning.AI', date: 'Sep 2026', url: 'https://coursera.org/verify/AIAA127L7WBI' },
    { name: 'Generative AI for Everyone', issuer: 'DeepLearning.AI', date: 'Sep 2026', url: 'https://coursera.org/verify/J99PXI9WPR5V' },
    { name: 'NASA International Space Apps Challenge', issuer: 'Participation', date: 'Oct 2025', url: '' },
  ],
};
