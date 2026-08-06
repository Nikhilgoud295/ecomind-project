const { ai } = require('../config/gemini');

// 1. Enterprise Sustainability, ESG, MCA & SEBI News Feed
const enterpriseIntelligenceFeed = [
  {
    id: 'intel_01',
    title: 'SEBI Mandates BRSR Core Assurance for Top 1,000 Listed Companies',
    category: 'SEBI & BRSR',
    type: 'regulatory',
    source: 'SEBI Circular / Capital Markets Watch',
    date: new Date(Date.now() - 3600000 * 3).toISOString(),
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
    summary: 'SEBI requires top listed entities to obtain reasonable assurance on Business Responsibility & Sustainability Reporting (BRSR) Core Key Performance Indicators starting FY 2024-25.',
    aiPoints: [
      'Top 1,000 listed entities must disclose BRSR Core metrics including GHG emissions, water usage, and waste management.',
      'Independent third-party assurance is mandatory for Scope 1 and Scope 2 emissions reporting.',
      'Extends supply chain ESG disclosures for top 250 listed companies on a comply-or-explain basis.'
    ],
    content: 'The Securities and Exchange Board of India (SEBI) has released updated guidelines enforcing BRSR Core reasonable assurance. Companies must report verified metrics for Scope 1, Scope 2, water discharge, circular economy participation, and workplace diversity.',
    impactLevel: 'Mandatory Compliance',
    applicableIndustry: 'Listed Enterprises & Large Corporates',
    tags: ['SEBI', 'BRSR Core', 'ESG Disclosure', 'Audit']
  },
  {
    id: 'intel_02',
    title: 'MCA Updates Companies Act ESG Disclosure Norms & Board Responsibilities',
    category: 'MCA & Companies Act',
    type: 'legal',
    source: 'Ministry of Corporate Affairs',
    date: new Date(Date.now() - 3600000 * 8).toISOString(),
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    summary: 'The Ministry of Corporate Affairs issues notification enhancing Section 134(3)(m) requirements for corporate energy conservation and green technology adoption disclosures.',
    aiPoints: [
      'Mandates annual Director’s Report sections covering capital expenditure allocated to renewable energy.',
      'Requires explicit disclosures on steps taken for energy conservation and alternate energy source utilization.',
      'Enforces digital filing of Form MGT-7 with certified carbon footprint summaries.'
    ],
    content: 'The Ministry of Corporate Affairs (MCA) has streamlined reporting rules for environmental stewardship under the Companies Act, 2013. Board reports must now quantify renewable energy transitions and energy intensity reductions.',
    impactLevel: 'Statutory Obligation',
    applicableIndustry: 'All Public & Private Limited Companies',
    tags: ['MCA', 'Companies Act', 'Board Disclosures', 'Governance']
  },
  {
    id: 'intel_03',
    title: 'National Green Hydrogen Mission Grants 15% Capital Subsidy for Industrial Units',
    category: 'Government Schemes',
    type: 'subsidy',
    source: 'Ministry of New & Renewable Energy (MNRE)',
    date: new Date(Date.now() - 3600000 * 18).toISOString(),
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800',
    summary: 'MNRE launches SIGHT scheme component providing direct financial subsidies and tax credits for manufacturing plants converting boilers to green hydrogen.',
    aiPoints: [
      '15% capital subsidy up to ₹50 Crore for electrolyzer installation and industrial boiler retrofit.',
      'Additional concessional power wheeling tariffs for renewable energy procurement.',
      'Application deadline open for eligible manufacturing, chemical, and steel producers.'
    ],
    content: 'Under the National Green Hydrogen Mission, the government has opened applications for industrial decarbonization grants. Facilities upgrading to green hydrogen or biomass co-firing qualify for capital grants and reduced grid wheeling charges.',
    impactLevel: 'High Cost-Saving Benefit',
    applicableIndustry: 'Manufacturing, Heavy Industry & Energy',
    tags: ['Subsidy', 'Green Hydrogen', 'MNRE', 'Grant']
  },
  {
    id: 'intel_04',
    title: 'Carbon Credit Trading Scheme (CCTS) Opens Compliance Market Registration',
    category: 'Carbon Credits',
    type: 'opportunity',
    source: 'Bureau of Energy Efficiency (BEE)',
    date: new Date(Date.now() - 3600000 * 30).toISOString(),
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800',
    summary: 'BEE opens registry for designated entities to earn and trade Carbon Credit Certificates (CCCs) based on verified GHG reduction achievements.',
    aiPoints: [
      'Designated industrial consumers can earn 1 Carbon Credit Certificate per metric ton CO2e reduced below benchmark.',
      'Trading platform integrated with Indian Energy Exchange (IEX) for transparent pricing.',
      'Early adopter entities receive expedited audit verification and bonus credit allocation.'
    ],
    content: 'India’s Carbon Credit Trading Scheme (CCTS) has officially launched trading registration. Companies exceeding annual emissions reduction targets can monetize their surplus savings by selling verified CCCs on designated exchanges.',
    impactLevel: 'Revenue Opportunity',
    applicableIndustry: 'All Energy Intensive & Industrial Enterprises',
    tags: ['Carbon Credits', 'CCTS', 'BEE', 'Monetization']
  },
  {
    id: 'intel_05',
    title: 'Central Pollution Control Board Updates E-Waste Management & EPR Compliance Rules',
    category: 'Environmental Regulations',
    type: 'regulatory',
    source: 'CPCB & MoEFCC',
    date: new Date(Date.now() - 3600000 * 42).toISOString(),
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800',
    summary: 'CPCB issues revised Extended Producer Responsibility (EPR) targets requiring 70% collection and recycling of electronic equipment waste.',
    aiPoints: [
      'Producers, importers, and brand owners (PIBOs) must register on the CPCB EPR portal before quarter end.',
      'Mandates purchasing EPR certificates from authorized recyclers to offset uncollected waste quotas.',
      'Non-compliance attracts environmental compensation penalties under the Environment Protection Act.'
    ],
    content: 'The Central Pollution Control Board (CPCB) has tightened EPR fulfillment verification. Organizations producing or utilizing electrical and electronic equipment must maintain digital audit trails of e-waste recycling.',
    impactLevel: 'Mandatory Audit',
    applicableIndustry: 'IT, Electronics, Consumer Goods & SaaS',
    tags: ['CPCB', 'EPR', 'E-Waste', 'Environment Law']
  },
  {
    id: 'intel_06',
    title: 'Global Solar & Rooftop Clean Energy Subsidy Program Extended for MSMEs',
    category: 'Government Schemes',
    type: 'subsidy',
    source: 'Ministry of MSME',
    date: new Date(Date.now() - 3600000 * 54).toISOString(),
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5057d0256?auto=format&fit=crop&q=80&w=800',
    summary: 'MSME Sustainable Scheme offers up to 40% subsidy on rooftop solar installations and ZED (Zero Defect Zero Effect) certification costs.',
    aiPoints: [
      '40% upfront subsidy on solar PV installations up to 500 kW capacity.',
      'Full reimbursement of ISO 14001 certification fees for micro and small enterprises.',
      'Simplified single-window online application through the Udyam portal.'
    ],
    content: 'The Ministry of MSME has expanded funding under the ZED Certification Scheme. Businesses achieving Gold or Diamond ZED ratings gain priority access to low-interest green loans and government procurement tenders.',
    impactLevel: 'Substantial Savings',
    applicableIndustry: 'MSMEs, Commercial & Industrial Outlets',
    tags: ['MSME', 'Rooftop Solar', 'ZED', 'Subsidy']
  }
];

// 2. Compliance Calendar Events & Statutory Deadlines
const complianceCalendarEvents = [
  {
    id: 'evt_01',
    title: 'BRSR Core FY 2024-25 Disclosure Filing Deadline',
    category: 'SEBI & BRSR',
    dueDate: '2026-09-30',
    authority: 'SEBI',
    urgency: 'High',
    description: 'Mandatory filing of BRSR Core disclosures with reasonable assurance for top listed companies.',
    actionRequired: 'Finalize Scope 1 & 2 carbon emissions audit report and upload to stock exchange portal.'
  },
  {
    id: 'evt_02',
    title: 'CPCB Quarterly E-Waste EPR Return Filing',
    category: 'Environmental Regulations',
    dueDate: '2026-08-31',
    authority: 'CPCB',
    urgency: 'Critical',
    description: 'Quarterly submission of EPR fulfillment certificates on the central portal.',
    actionRequired: 'Reconcile hardware procurement logs against authorized recycler certificates.'
  },
  {
    id: 'evt_03',
    title: 'Companies Act Section 134(3)(m) Energy Conservation Report',
    category: 'MCA & Companies Act',
    dueDate: '2026-10-31',
    authority: 'MCA',
    urgency: 'Medium',
    description: 'Inclusion of energy conservation and renewable energy expenditure in Director’s Report.',
    actionRequired: 'Extract annual electricity and fuel consumption metrics from EcoMind dashboard.'
  },
  {
    id: 'evt_04',
    title: 'ISO 14001 Environmental Management System Annual Audit',
    category: 'Certifications',
    dueDate: '2026-11-15',
    authority: 'ISO Auditor',
    urgency: 'Medium',
    description: 'Annual surveillance audit for ISO 14001 continuous improvement verification.',
    actionRequired: 'Generate resource efficiency audit reports and waste diversion statistics.'
  }
];

// 3. ESG & Sustainability Learning Center Articles
const learningCenterArticles = [
  {
    id: 'learn_01',
    title: 'Mastering BRSR & BRSR Core: A Step-by-Step Corporate Guide',
    topic: 'SEBI & BRSR Reporting',
    readTime: '8 min read',
    level: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
    summary: 'Comprehensive explainer on SEBI BRSR 9 Principles, Essential Indicators, and reasonable assurance protocols.',
    takeaways: [
      'Principle 6 focuses directly on environmental stewardship, water intensity, and carbon footprint.',
      'Difference between BRSR Comprehensive and BRSR Core metrics.',
      'How to compute GHG Protocol Scope 1, Scope 2, and Scope 3 emissions.'
    ]
  },
  {
    id: 'learn_02',
    title: 'Demystifying ISO 14001: Building an Audit-Ready EMS',
    topic: 'Standards & Certifications',
    readTime: '6 min read',
    level: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    summary: 'Learn how to set up an Environmental Management System (EMS) compliant with international ISO 14001 criteria.',
    takeaways: [
      'Establishing environmental policy and risk assessment frameworks.',
      'Key performance indicators for electricity, water, and solid waste reduction.',
      'Conducting internal surveillance audits and corrective action logs.'
    ]
  },
  {
    id: 'learn_03',
    title: 'Navigating Carbon Credit Trading & Monetization in 2026',
    topic: 'Carbon Markets',
    readTime: '7 min read',
    level: 'Advanced',
    imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800',
    summary: 'How commercial enterprises can register GHG reduction projects and monetize surplus credits on exchange markets.',
    takeaways: [
      'Understanding compliance vs. voluntary carbon credit markets.',
      'Verification protocols for solar power, energy efficiency, and tree plantation projects.',
      'Step-by-step registration with the Bureau of Energy Efficiency (BEE).'
    ]
  }
];

// 4. Industry Benchmark Metrics Data
const industryBenchmarks = {
  manufacturing: {
    industryName: 'Industrial & Manufacturing',
    avgElectricityKwhPerDay: 45.0,
    avgWaterLitersPerDay: 450,
    avgWasteKgPerDay: 12.0,
    avgRenewablePct: 20,
    avgRecyclingPct: 35,
    avgCarbonFootprintKg: 42.5
  },
  technology: {
    industryName: 'Technology & SaaS / Office',
    avgElectricityKwhPerDay: 15.0,
    avgWaterLitersPerDay: 110,
    avgWasteKgPerDay: 2.5,
    avgRenewablePct: 35,
    avgRecyclingPct: 55,
    avgCarbonFootprintKg: 13.8
  },
  retail: {
    industryName: 'Retail & Commercial Services',
    avgElectricityKwhPerDay: 25.0,
    avgWaterLitersPerDay: 180,
    avgWasteKgPerDay: 6.0,
    avgRenewablePct: 25,
    avgRecyclingPct: 40,
    avgCarbonFootprintKg: 22.0
  }
};

const getIntelligenceFeed = async (req, res, next) => {
  try {
    const { category, search, industry } = req.query;
    let items = [...enterpriseIntelligenceFeed];

    if (category && category !== 'All') {
      items = items.filter(n => n.category.toLowerCase() === category.toLowerCase());
    }

    if (industry && industry !== 'All') {
      items = items.filter(n => 
        n.applicableIndustry.toLowerCase().includes(industry.toLowerCase()) || 
        n.applicableIndustry.includes('All')
      );
    }

    if (search) {
      const query = search.toLowerCase();
      items = items.filter(n => 
        n.title.toLowerCase().includes(query) || 
        n.summary.toLowerCase().includes(query) ||
        n.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    return res.json({
      success: true,
      count: items.length,
      categories: [
        'All',
        'SEBI & BRSR',
        'MCA & Companies Act',
        'Environmental Regulations',
        'Government Schemes',
        'Carbon Credits'
      ],
      intelligence: items,
      calendarEvents: complianceCalendarEvents,
      learningArticles: learningCenterArticles,
      benchmarks: industryBenchmarks
    });
  } catch (err) {
    next(err);
  }
};

const getAiStrategicRecommendations = async (req, res, next) => {
  try {
    const { industry = 'Technology', companySize = '50-200 Employees' } = req.body || {};

    if (!ai) {
      return res.json({
        success: true,
        recommendations: [
          {
            title: 'Apply for MNRE 15% Green Subsidies',
            savings: 'Estimated ₹8.5 Lakhs saved annually',
            action: 'Submit solar rooftop installation proposal before Q3 deadline.',
            category: 'Financial Grant'
          },
          {
            title: 'Prepare BRSR Core Scope 1 & 2 Audit Log',
            savings: '100% Risk Mitigation',
            action: 'Export certified energy consumption reports directly from EcoMind.',
            category: 'Compliance'
          },
          {
            title: 'Monetize Waste Diversion via CPCB Recycling Certificates',
            savings: 'Estimated ₹2.1 Lakhs revenue',
            action: 'Register solid waste recycling audit logs on CPCB EPR portal.',
            category: 'Carbon Credits'
          }
        ]
      });
    }

    const prompt = `
    You are EcoMind Enterprise AI Chief Sustainability Officer.
    Generate 3 high-impact strategic compliance and cost-saving recommendations for an organization in the ${industry} sector (${companySize}).
    Return ONLY a valid JSON array matching this structure:
    [
      {
        "title": "Short strategic title",
        "savings": "Estimated financial or CO2 savings",
        "action": "Clear action step",
        "category": "Compliance | Grant | Cost-Saving | Carbon Credit"
      }
    ]
    `;

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
    const recommendations = JSON.parse(cleanJson);

    return res.json({
      success: true,
      recommendations,
    });
  } catch (err) {
    return res.json({
      success: true,
      recommendations: [
        {
          title: 'Apply for Solar Rooftop MSME Capital Subsidy',
          savings: '40% Capital Outlay Subsidy',
          action: 'File online application via Udyam portal with energy audit metrics.',
          category: 'Grant'
        },
        {
          title: 'Automate Scope 1 & 2 BRSR Disclosures',
          savings: '100% Statutory Compliance',
          action: 'Generate certified PDF reports from EcoMind Reports page.',
          category: 'Compliance'
        }
      ]
    });
  }
};

module.exports = {
  getIntelligenceFeed,
  getAiStrategicRecommendations,
  getNews: getIntelligenceFeed,
  getAiDigest: async (req, res) => {
    return res.json({
      success: true,
      digest: [
        '⚖️ SEBI mandates BRSR Core reasonable assurance for top 1,000 listed entities starting FY25.',
        '🏛️ MNRE opens 15% capital subsidies for industrial solar & green hydrogen conversion.',
        '💎 BEE launches Carbon Credit Trading Scheme (CCTS) registration for designated units.'
      ]
    });
  }
};
