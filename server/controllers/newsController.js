const { ai } = require('../config/gemini');

// Curated live environmental news feed with rich imagery and metadata
const environmentalNewsFeed = [
  {
    id: 'news_01',
    title: 'Global Solar Capacity Reaches Historic Milestone of 2 Terawatts',
    category: 'Renewable Energy',
    source: 'CleanEnergy International',
    date: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800',
    summary: 'Solar power deployment has expanded by 34% worldwide, driven by major grid updates in North America, Europe, and East Asia, cutting annual power emissions significantly.',
    content: 'Global solar power capacity has officially surpassed 2 Terawatts. Experts attribute the rapid acceleration to falling photovoltaic manufacturing costs and new government grid incentives aimed at achieving net-zero by 2040.',
    impactLevel: 'High Positive',
    tags: ['Solar', 'Grid Transition', 'Net Zero']
  },
  {
    id: 'news_02',
    title: 'UN Global Ocean Treaty Ratified by 60 Nations to Protect Marine Sanctuaries',
    category: 'Ocean Protection',
    source: 'Global Climate Watch',
    date: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=800',
    summary: 'The landmark treaty establishes legally binding marine protection zones covering 30% of international waters to prevent overfishing and deep-sea mining.',
    content: 'In a historic victory for marine biology, 60 countries officially ratified the High Seas Treaty. The agreement creates safe havens for endangered marine species and regulates international seabed commercial ventures.',
    impactLevel: 'Critical Policy',
    tags: ['Oceans', 'Biodiversity', 'UN Treaty']
  },
  {
    id: 'news_03',
    title: 'Breakthrough Direct Air Capture Facility Removes 50,000 Tons of CO2 Annually',
    category: 'Clean Tech',
    source: 'EcoTech Daily',
    date: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800',
    summary: 'Powered entirely by geothermal energy, the new DAC plant traps carbon dioxide directly from ambient air and permanently stores it underground in basalt formations.',
    content: 'Engineers have commissioned the largest geothermal-powered carbon removal facility to date. The captured carbon is converted into mineralized calcium carbonate within underground basalt rock layers in under two years.',
    impactLevel: 'Tech Innovation',
    tags: ['Carbon Removal', 'Geothermal', 'DAC']
  },
  {
    id: 'news_04',
    title: 'EU Mandates 100% Recyclable Packaging Standards for Consumer Products',
    category: 'Zero Waste',
    source: 'Sustainability Directive',
    date: new Date(Date.now() - 3600000 * 36).toISOString(), // 1.5 days ago
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800',
    summary: 'New European regulations require consumer packaging to eliminate non-recyclable composite plastics by 2028, enforcing circular economy principles.',
    content: 'The European Parliament has approved strict new rules banning single-use plastic wraps for fresh produce and requiring all retail packaging to be easily compostable or recyclable by 2028.',
    impactLevel: 'Regulatory Reform',
    tags: ['Circular Economy', 'Packaging', 'Recycling']
  },
  {
    id: 'news_05',
    title: 'Amazon Rainforest Reforestation Project Restores 100,000 Hectares of Canopy',
    category: 'Biodiversity',
    source: 'Forest Conservation News',
    date: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800',
    summary: 'A coalition of indigenous stewards and conservation drone technology successfully planted 12 million native trees across degraded rainforest corridors.',
    content: 'Community-led reforestation programs in the Amazon basin have achieved a major landmark, re-establishing dense tree canopies across 100,000 hectares and reviving wildlife corridors for jaguar and bird species.',
    impactLevel: 'High Ecological Gain',
    tags: ['Reforestation', 'Amazon', 'WildLife']
  },
  {
    id: 'news_06',
    title: 'Next-Gen Solid State EV Batteries Cut Lithium Requirement by 60%',
    category: 'Clean Tech',
    source: 'Energy & Mobility Tech',
    date: new Date(Date.now() - 3600000 * 60).toISOString(), // 2.5 days ago
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1558441719-67450807429f?auto=format&fit=crop&q=80&w=800',
    summary: 'Researchers reveal solid-state electrolyte battery cells with 900Wh/kg energy density, offering 1,000km electric vehicle range on a single fast charge.',
    content: 'A breakthrough in battery chemistry replaces liquid electrolytes with silicon-anode solid state structures, doubling EV driving range while drastically reducing rare earth mineral dependence.',
    impactLevel: 'Market Shift',
    tags: ['EV Technology', 'Batteries', 'Clean Mobility']
  }
];

const getNews = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let filteredNews = [...environmentalNewsFeed];

    if (category && category !== 'All') {
      filteredNews = filteredNews.filter(n => n.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const query = search.toLowerCase();
      filteredNews = filteredNews.filter(n => 
        n.title.toLowerCase().includes(query) || 
        n.summary.toLowerCase().includes(query) ||
        n.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    return res.json({
      success: true,
      count: filteredNews.length,
      categories: ['All', 'Renewable Energy', 'Ocean Protection', 'Clean Tech', 'Zero Waste', 'Biodiversity'],
      news: filteredNews,
    });
  } catch (err) {
    next(err);
  }
};

const getAiDigest = async (req, res, next) => {
  try {
    if (!ai) {
      return res.json({
        success: true,
        digest: [
          '⚡ Global solar power deployment hit 2 Terawatts, cutting energy sector emissions.',
          '🌊 UN High Seas Treaty ratified by 60 nations to protect 30% of international waters.',
          '🌿 Community reforestation in the Amazon successfully restored 100,000 hectares of forest.'
        ]
      });
    }

    const prompt = `
    Provide 3 concise bullet points summarizing today's key global environmental & climate developments:
    ${environmentalNewsFeed.map(n => `- ${n.title}`).join('\n')}
    `;

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const bullets = text.split('\n').filter(b => b.trim().length > 0).slice(0, 3);

    return res.json({
      success: true,
      digest: bullets,
    });
  } catch (err) {
    return res.json({
      success: true,
      digest: [
        '⚡ Solar installation deployment reached record highs across Europe and North America.',
        '🌊 International ocean protection treaty enters into force with 60 ratifications.',
        '🔋 Next-gen battery chemistry reduces lithium usage for zero-emission transit.'
      ]
    });
  }
};

module.exports = {
  getNews,
  getAiDigest,
};
