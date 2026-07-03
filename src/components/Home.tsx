import React from 'react';

import { ArrowRight, Calculator, Shield, Globe, ArrowUpRight, Users, Scale } from 'lucide-react';


interface HomeProps {
    setCurrentTab: (tab: string) => void;
  setSelectedProduct?: (productId: string) => void;
  products?: any[];
}

const HOME_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    hero_title: "Empowering Trade and Investment in the DRC",
    hero_desc: "SmartTrade RDC provides instant customs cost estimations, tax incentive checklists, and real-time updates to facilitate investments across the Democratic Republic of Congo.",
    cta_start: "Estimate Customs & Taxes",
    cta_incentives: "Explore Incentives",
    section_features: "Core Platform Services",
    section_features_sub: "Digital decision-support tools tailored for investors and cross-border operators in the DRC.",
    section_corridor: "Key DRC Entry Points",
    section_corridor_sub: "Understanding major customs points and commercial hubs for import/export in the DRC.",
    pb_title: "Eastern Borders (e.g. Goma, Bukavu)",
    pb_desc: "Primary crossing points for regional trade with East Africa. Key hubs for agricultural exports, mineral transport, and Simplified Trade Regime (STR) clearance.",
    gb_title: "Western & Southern Hubs (Matadi, Kasumbalesa)",
    gb_desc: "The main gateways for heavy commercial ocean freight and southern corridor transport. Handles the majority of industrial imports and large-scale investment capital goods.",
    how_works: "How SmartTrade RDC Works",
    how_1_title: "1. Select Trade Route / Sector",
    how_1_desc: "Choose your port of entry or investment sector.",
    how_2_title: "2. Input Value & Profile",
    how_2_desc: "Enter cargo or capital values and specify your profile (e.g. holding STR certificates or local investment exonerations).",
    how_3_title: "3. Get Cost Transparency",
    how_3_desc: "View line-by-line tax calculations (Duties, VAT, withholding, local fees) and see your savings.",
    section_products: "Primary Import Products",
    section_products_sub: "Quick access tariff rules for top products. Click any product to launch the Estimator pre-filled.",
    stat_vol_title: "Monthly Trade Volume",
    stat_vol_val: "$500M+",
    stat_vol_desc: "Across major DRC customs corridors",
    stat_threshold_title: "STR Duty-Free Limit",
    stat_threshold_val: "$2,000",
    stat_threshold_desc: "EAC Simplified Trade Regime threshold",
    stat_savings_title: "Informal Cost Reduction",
    stat_savings_val: "Up to 30%",
    stat_savings_desc: "By utilizing official tax exemptions and STR"
  },
  fr: {
    hero_title: "Faciliter le Commerce dans le Corridor Goma–Gisenyi",
    hero_desc: "SmartTrade RDC propose des estimations instantanées des coûts de douane, des listes d'éligibilité aux avantages fiscaux et des guides étape par étape pour stimuler le commerce transfrontalier.",
    cta_start: "Estimer les Coûts Douaniers",
    cta_incentives: "Découvrir les Avantages",
    section_features: "Services Principaux du Portail",
    section_features_sub: "Des outils d'aide à la décision conçus pour les opérateurs du commerce transfrontalier de la région des Grands Lacs.",
    section_corridor: "Points de Passage Goma–Gisenyi",
    section_corridor_sub: "Comprendre les deux barrières frontalières reliant Goma (RDC) et Rubavu/Gisenyi (Rwanda).",
    pb_title: "Petite Barrière (Petit Commerce)",
    pb_desc: "Le point de passage privilégié des petits commerçants transfrontaliers. Optimisé pour les flux de piétons, les coopératives agricoles et le dédouanement simplifié (RCS).",
    gb_title: "Grande Barrière (Commercial)",
    gb_desc: "Le portail majeur pour les cargaisons commerciales lourdes, les camions et les investisseurs. Il abrite les directions de douane (DGDA & RRA) et le Guichet Unique Électronique.",
    how_works: "Comment fonctionne SmartTrade RDC",
    how_1_title: "1. Choisissez la Route",
    how_1_desc: "Sélectionnez le sens du voyage (Goma vers Gisenyi ou Gisenyi vers Goma) et votre produit.",
    how_2_title: "2. Remplissez votre Profil",
    how_2_desc: "Saisissez les valeurs et précisez si vous détenez un certificat ou un numéro d'impôt.",
    how_3_title: "3. Obtenez la Transparence",
    how_3_desc: "Visualisez les taxes calculées ligne par ligne et découvrez vos économies fiscales.",
    section_products: "Produits Majeurs du Corridor",
    section_products_sub: "Consultez les tarifs pour les produits courants. Cliquez sur un produit pour préremplir l'estimateur.",
    stat_vol_title: "Commerçants Quotidiens",
    stat_vol_val: "50 000+",
    stat_vol_desc: "Majoritairement des petits exploitants agricoles",
    stat_threshold_title: "Seuil RCS Exonéré",
    stat_threshold_val: "2 000 $",
    stat_threshold_desc: "Limite de valeur du Régime Simplifié EAC",
    stat_savings_title: "Réduction des Frais Informels",
    stat_savings_val: "Jusqu'à 30%",
    stat_savings_desc: "En utilisant les exonérations officielles et le RCS"
  },
  sw: {
    hero_title: "Kukuza Biashara Kwenye Mpaka wa Goma–Gisenyi",
    hero_desc: "SmartTrade RDC inatoa makadirio ya haraka ya ushuru, miongozo ya vivutio vya kodi, na hatua za kuvuka mpaka ili kurahisisha biashara na uwekezaji mipakani.",
    cta_start: "Kadiria Gharama za Forodha",
    cta_incentives: "Gundua Vivutio vya Kodi",
    section_features: "Huduma Kuu za Tovuti",
    section_features_sub: "Zana za usaidizi wa maamuzi zilizoundwa kwa ajili ya wafanyabiashara katika ukanda wa Maziwa Makuu.",
    section_corridor: "Njia za Kuvuka za Goma–Gisenyi",
    section_corridor_sub: "Kuelewa milango tofauti ya mpakani inayounganisha Goma (DRC) na Rubavu/Gisenyi (Rwanda).",
    pb_title: "Petite Barrière (Mfanyabiashara Mdogo)",
    pb_desc: "Kituo kikuu cha kuvuka kwa wafanyabiashara wadogo wa mipakani. Kimeboreshwa kwa watembea kwa miguu, vyama vya ushirika, na STR ya EAC.",
    gb_title: "Grande Barrière (Kibiashara)",
    gb_desc: "Lango kuu la shehena nzito za kibiashara, malori, na wawekezaji. Inahifadhi ofisi zote za forodha (DGDA & RRA) na Single Window.",
    how_works: "Jinsi SmartTrade RDC Inafanya Kazi",
    how_1_title: "1. Chagua Njia",
    how_1_desc: "Chagua mwelekeo (Goma kwenda Gisenyi au Gisenyi kwenda Goma) na bidhaa yako.",
    how_2_title: "2. Weka Thamani na Wasifu",
    how_2_desc: "Weka thamani ya bidhaa na uonyeshe kama una cheti cha STR au TIN ya mlipa kodi.",
    how_3_title: "3. Pata Uwazi wa Gharama",
    how_3_desc: "Angalia mchanganuo wa ushuru na ada hatua kwa hatua, na uone unafuu uliopata.",
    section_products: "Bidhaa Kuu Mipakani",
    section_products_sub: "Ufikiaji wa haraka wa sheria za ushuru. Bonyeza bidhaa ili kuanza kikokotoo.",
    stat_vol_title: "Wafanyabiashara wa Kila Siku",
    stat_vol_val: "50,000+",
    stat_vol_desc: "Wengi wao wakiwa wafanyabiashara wadogo wa kilimo",
    stat_threshold_title: "Kikomo cha Ushuru 0% cha STR",
    stat_threshold_val: "$2,000",
    stat_threshold_desc: "Kiwango cha juu cha utaratibu uliorahisishwa wa EAC",
    stat_savings_title: "Kupunguza Gharama Zisizo Rasmi",
    stat_savings_val: "Hadi 30%",
    stat_savings_desc: "Kwa kutumia misamaha ya kodi na STR rasmi"
  }
};

export const Home: React.FC<HomeProps> = ({ setCurrentTab, setSelectedProduct, products = [] }) => {
    const ht = HOME_TRANSLATIONS["en"];

  const handleProductClick = (productId: string) => {
    if (setSelectedProduct) {
      setSelectedProduct(productId);
    }
    setCurrentTab('estimator');
  };

  const services = [
    {
      title: 'Customs Cost Estimator',
      desc: 'Estimate import duties, VAT, and administrative fees for your cargo crossing the Gomaâ€“Gisenyi border. Apply tax incentives automatically.',
      icon: Calculator,
      tab: 'estimator',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Tax Incentives',
      desc: 'Understand and verify the legal exemptions and tax holidays available for cross-border trade and investments in the Great Lakes region.',
      icon: Shield,
      tab: 'incentives',
      color: 'from-amber-500 to-orange-500'
    },
  ];

  return (
    <div className="space-y-12">
      {/* Modern Landing Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-6 pt-4">
        <span className="inline-flex items-center gap-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <Globe className="h-3.5 w-3.5 animate-spin-slow" />
          DRC Trade & Investment Portal
        </span>
        
        <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white leading-tight font-display tracking-tight">
          {ht.hero_title}
        </h1>
        
        <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          {ht.hero_desc}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setCurrentTab('estimator')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-xs font-bold text-white shadow-lg shadow-brand-500/20 transition-all active:scale-95 cursor-pointer"
          >
            {ht.cta_start}
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setCurrentTab('incentives')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-750 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer"
          >
            {ht.cta_incentives}
            <ArrowUpRight className="h-4 w-4 text-accent-500" />
          </button>
        </div>
      </div>

      {/* Regional Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-brand-900/10 dark:border-zinc-800/80">
        <div className="text-center space-y-1">
          <span className="block text-3xl font-black text-brand-600 dark:text-brand-400 font-display">
            {ht.stat_vol_val}
          </span>
          <span className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
            {ht.stat_vol_title}
          </span>
          <span className="block text-[10px] text-zinc-400">
            {ht.stat_vol_desc}
          </span>
        </div>
        <div className="text-center space-y-1 border-y md:border-y-0 md:border-x border-brand-900/10 dark:border-zinc-800/80 py-4 md:py-0">
          <span className="block text-3xl font-black text-accent-500 font-display">
            {ht.stat_threshold_val}
          </span>
          <span className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
            {ht.stat_threshold_title}
          </span>
          <span className="block text-[10px] text-zinc-400">
            {ht.stat_threshold_desc}
          </span>
        </div>
        <div className="text-center space-y-1">
          <span className="block text-3xl font-black text-brand-600 dark:text-brand-400 font-display">
            {ht.stat_savings_val}
          </span>
          <span className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
            {ht.stat_savings_title}
          </span>
          <span className="block text-[10px] text-zinc-400">
            {ht.stat_savings_desc}
          </span>
        </div>
      </div>

      {/* Core Tools Section */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
            {ht.section_features}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
            {ht.section_features_sub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                onClick={() => setCurrentTab(srv.tab)}
                className="glass-panel rounded-3xl p-5 md:p-6 shadow-sm border border-zinc-150 dark:border-zinc-850 cursor-pointer hover:border-brand-500/40 glass-card-hover flex flex-col justify-between"
              >
                <div>
                  <div className={`p-3 rounded-2xl bg-gradient-to-tr ${srv.color} text-white w-fit shadow-md shadow-brand-500/5`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-zinc-900 dark:text-white mt-4 font-display">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed font-sans">
                    {srv.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-[10px] font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  Open Tool
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goma-Gisenyi Crossing points */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
            {ht.section_corridor}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
            {ht.section_corridor_sub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Petite Barrière */}
          <div className="glass-panel rounded-3xl p-5 md:p-6 shadow-sm border border-zinc-150 dark:border-zinc-850 flex gap-4 items-start">
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex-none mt-1">
              <Users className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-extrabold text-zinc-800 dark:text-white">
                {ht.pb_title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                {ht.pb_desc}
              </p>
            </div>
          </div>

          {/* Grande Barrière */}
          <div className="glass-panel rounded-3xl p-5 md:p-6 shadow-sm border border-zinc-150 dark:border-zinc-855 flex gap-4 items-start">
            <div className="p-2.5 rounded-xl bg-accent-500/10 text-accent-500 flex-none mt-1">
              <Scale className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-extrabold text-zinc-800 dark:text-white">
                {ht.gb_title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                {ht.gb_desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Products Showcase */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
            {ht.section_products}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
            {ht.section_products_sub}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map((prod) => (
            <div
              key={prod.id}
              onClick={() => handleProductClick(prod.id)}
              className="glass-panel rounded-2xl p-4 border border-zinc-150 dark:border-zinc-850 cursor-pointer glass-card-hover flex flex-col justify-between h-36"
            >
              <div>
                <span className="block text-[8px] font-mono text-zinc-400">HS {prod.hsCode}</span>
                <h3 className="text-xs font-black text-zinc-800 dark:text-white mt-1">
                  {(prod.nameKey && prod.nameKey) ? prod.nameKey : prod.name}
                </h3>
                <span className="inline-block mt-2 px-1.5 py-0.5 rounded text-[8px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 font-sans">
                  {prod.isEacStrEligible ? 'EAC STR Eligible' : 'Standard'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[9px] font-bold text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-2 mt-2">
                <span>Duty: {(prod.baseDutyRate * 100)}%</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-brand-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-sm border border-zinc-100 dark:border-zinc-900 text-center space-y-6">
        <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
          {ht.how_works}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="space-y-1.5 p-4 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-150 dark:border-zinc-850">
            <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {ht.how_1_title}
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
              {ht.how_1_desc}
            </p>
          </div>

          <div className="space-y-1.5 p-4 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-150 dark:border-zinc-850">
            <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {ht.how_2_title}
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
              {ht.how_2_desc}
            </p>
          </div>

          <div className="space-y-1.5 p-4 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-150 dark:border-zinc-850">
            <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {ht.how_3_title}
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
              {ht.how_3_desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
