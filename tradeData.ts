export interface Product {
  id: string;
  nameKey: string;
  hsCode: string;
  category: 'agriculture' | 'merchandise';
  baseDutyRate: number; // e.g. 0.25 (25%)
  isEacStrEligible: boolean;
  notesKey: string;
}

export interface TaxIncentive {
  id: string;
  titleKey: string;
  authority: 'DRC (DGDA)' | 'Rwanda (RRA/RDB)' | 'EAC Regional';
  descriptionKey: string;
  benefitsKey: string;
  requirementsKeys: string[];
}

export interface GuideStep {
  stepNumber: number;
  titleKey: string;
  descriptionKey: string;
  documentsKeys: string[];
}

export interface PersonaGuide {
  id: 'small_scale' | 'medium_scale' | 'investor';
  titleKey: string;
  subtitleKey: string;
  overviewKey: string;
  steps: GuideStep[];
  helpfulTipsKeys: string[];
  contacts: { name: string; phone: string; roleKey: string }[];
}

// Exchange Rates (Base: 1 USD)
export const EXCHANGE_RATES = {
  USD: 1.0,
  RWF: 1295.0,
  CDF: 2800.0,
};

// Convert currency helper
export const convertCurrency = (amount: number, from: keyof typeof EXCHANGE_RATES, to: keyof typeof EXCHANGE_RATES): number => {
  const amountInUsd = amount / EXCHANGE_RATES[from];
  return amountInUsd * EXCHANGE_RATES[to];
};

export const PRODUCTS: Product[] = [
  {
    id: 'beans',
    nameKey: 'prod_beans',
    hsCode: '0713.33.00',
    category: 'agriculture',
    baseDutyRate: 0.25,
    isEacStrEligible: true,
    notesKey: 'notes_beans'
  },
  {
    id: 'maize',
    nameKey: 'prod_maize',
    hsCode: '1005.90.00',
    category: 'agriculture',
    baseDutyRate: 0.25,
    isEacStrEligible: true,
    notesKey: 'notes_maize'
  },
  {
    id: 'cassava',
    nameKey: 'prod_cassava',
    hsCode: '0714.10.00',
    category: 'agriculture',
    baseDutyRate: 0.25,
    isEacStrEligible: true,
    notesKey: 'notes_cassava'
  },
  {
    id: 'vegetables',
    nameKey: 'prod_vegetables',
    hsCode: '0709.99.00',
    category: 'agriculture',
    baseDutyRate: 0.25,
    isEacStrEligible: true,
    notesKey: 'notes_vegetables'
  },
  {
    id: 'textiles',
    nameKey: 'prod_textiles',
    hsCode: '6204.42.00',
    category: 'merchandise',
    baseDutyRate: 0.25,
    isEacStrEligible: false,
    notesKey: 'notes_textiles'
  },
  {
    id: 'electronics',
    nameKey: 'prod_electronics',
    hsCode: '8517.13.00',
    category: 'merchandise',
    baseDutyRate: 0.10,
    isEacStrEligible: false,
    notesKey: 'notes_electronics'
  },
  {
    id: 'agri_inputs',
    nameKey: 'prod_agri_inputs',
    hsCode: '3101.00.00',
    category: 'agriculture',
    baseDutyRate: 0.10, // Fertilizer/Seeds
    isEacStrEligible: true,
    notesKey: 'notes_agri_inputs'
  }
];

export const TAX_INCENTIVES: TaxIncentive[] = [
  {
    id: 'eac_str',
    titleKey: 'inc_eac_str_title',
    authority: 'EAC Regional',
    descriptionKey: 'inc_eac_str_desc',
    benefitsKey: 'inc_eac_str_benefits',
    requirementsKeys: [
      'req_eac_str_1',
      'req_eac_str_2',
      'req_eac_str_3'
    ]
  },
  {
    id: 'drc_agri_exempt',
    titleKey: 'inc_drc_agri_title',
    authority: 'DRC (DGDA)',
    descriptionKey: 'inc_drc_agri_desc',
    benefitsKey: 'inc_drc_agri_benefits',
    requirementsKeys: [
      'req_drc_agri_1',
      'req_drc_agri_2'
    ]
  },
  {
    id: 'rdb_investment_code',
    titleKey: 'inc_rdb_title',
    authority: 'Rwanda (RRA/RDB)',
    descriptionKey: 'inc_rdb_desc',
    benefitsKey: 'inc_rdb_benefits',
    requirementsKeys: [
      'req_rdb_1',
      'req_rdb_2',
      'req_rdb_3'
    ]
  },
  {
    id: 'anapi_drc_code',
    titleKey: 'inc_anapi_title',
    authority: 'DRC (DGDA)',
    descriptionKey: 'inc_anapi_desc',
    benefitsKey: 'inc_anapi_benefits',
    requirementsKeys: [
      'req_anapi_1',
      'req_anapi_2'
    ]
  }
];

export const PERSONA_GUIDES: PersonaGuide[] = [
  {
    id: 'small_scale',
    titleKey: 'guide_small_title',
    subtitleKey: 'guide_small_sub',
    overviewKey: 'guide_small_overview',
    steps: [
      {
        stepNumber: 1,
        titleKey: 'guide_small_s1_title',
        descriptionKey: 'guide_small_s1_desc',
        documentsKeys: ['doc_cpgl', 'doc_yellow_fever']
      },
      {
        stepNumber: 2,
        titleKey: 'guide_small_s2_title',
        descriptionKey: 'guide_small_s2_desc',
        documentsKeys: ['doc_str_cert']
      },
      {
        stepNumber: 3,
        titleKey: 'guide_small_s3_title',
        descriptionKey: 'guide_small_s3_desc',
        documentsKeys: ['doc_weigh']
      },
      {
        stepNumber: 4,
        titleKey: 'guide_small_s4_title',
        descriptionKey: 'guide_small_s4_desc',
        documentsKeys: ['doc_receipt']
      }
    ],
    helpfulTipsKeys: ['tip_small_1', 'tip_small_2', 'tip_small_3'],
    contacts: [
      { name: 'Maman Jeanne (Coop Goma)', phone: '+243 994 882 111', roleKey: 'contact_coop_rep' },
      { name: 'Jean Bosco (RRA Gisenyi)', phone: '+250 798 263 372', roleKey: 'contact_border_officer' },
      { name: 'DGDA Corridor Helpdesk', phone: '+243 812 555 400', roleKey: 'contact_helpdesk' }
    ]
  },
  {
    id: 'medium_scale',
    titleKey: 'guide_med_title',
    subtitleKey: 'guide_med_sub',
    overviewKey: 'guide_med_overview',
    steps: [
      {
        stepNumber: 1,
        titleKey: 'guide_med_s1_title',
        descriptionKey: 'guide_med_s1_desc',
        documentsKeys: ['doc_trade_license', 'doc_tax_id']
      },
      {
        stepNumber: 2,
        titleKey: 'guide_med_s2_title',
        descriptionKey: 'guide_med_s2_desc',
        documentsKeys: ['doc_cert_origin', 'doc_invoice']
      },
      {
        stepNumber: 3,
        titleKey: 'guide_med_s3_title',
        descriptionKey: 'guide_med_s3_desc',
        documentsKeys: ['doc_clearing_decl']
      },
      {
        stepNumber: 4,
        titleKey: 'guide_med_s4_title',
        descriptionKey: 'guide_med_s4_desc',
        documentsKeys: ['doc_bank_receipt']
      }
    ],
    helpfulTipsKeys: ['tip_med_1', 'tip_med_2'],
    contacts: [
      { name: 'Goma Clearing Agents Association', phone: '+243 853 444 800', roleKey: 'contact_clearing_assoc' },
      { name: 'Rwanda Electronic Single Window Support', phone: '+250 788 111 222', roleKey: 'contact_single_window' }
    ]
  },
  {
    id: 'investor',
    titleKey: 'guide_inv_title',
    subtitleKey: 'guide_inv_sub',
    overviewKey: 'guide_inv_overview',
    steps: [
      {
        stepNumber: 1,
        titleKey: 'guide_inv_s1_title',
        descriptionKey: 'guide_inv_s1_desc',
        documentsKeys: ['doc_rdb_cert', 'doc_anapi_cert']
      },
      {
        stepNumber: 2,
        titleKey: 'guide_inv_s2_title',
        descriptionKey: 'guide_inv_s2_desc',
        documentsKeys: ['doc_investment_plan']
      },
      {
        stepNumber: 3,
        titleKey: 'guide_inv_s3_title',
        descriptionKey: 'guide_inv_s3_desc',
        documentsKeys: ['doc_duty_exemption_appl']
      },
      {
        stepNumber: 4,
        titleKey: 'guide_inv_s4_title',
        descriptionKey: 'guide_inv_s4_desc',
        documentsKeys: ['doc_compliance_audit']
      }
    ],
    helpfulTipsKeys: ['tip_inv_1', 'tip_inv_2', 'tip_inv_3'],
    contacts: [
      { name: 'RDB One Stop Center (Kigali)', phone: '+250 252 585 188', roleKey: 'contact_rdb_center' },
      { name: 'ANAPI Investment Desk (Kinshasa/Goma)', phone: '+243 990 002 003', roleKey: 'contact_anapi_center' }
    ]
  }
];

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    // Nav & General
    app_title: "SmartTrade RDC",
    app_subtitle: "Goma–Gisenyi Trade & Tax Portal",
    nav_dashboard: "Dashboard",
    nav_estimator: "Customs Cost Estimator",
    nav_incentives: "Tax Incentives",
    nav_guides: "Trade Guides",
    nav_survey: "Evaluation Survey",
    nav_admin: "Admin Console",
    role_label: "Simulated Profile:",
    role_small_trader: "Small-Scale Trader",
    role_medium_trader: "Medium-Scale Trader",
    role_investor: "Foreign Investor",
    role_admin: "System Administrator",
    btn_calculate: "Calculate Costs",
    btn_reset: "Reset Form",
    btn_submitting: "Submitting...",
    btn_submit: "Submit Feedback",
    success_toast: "Action Completed Successfully!",
    last_updated: "Rates updated: June 2026 (Official Source: DGDA & RRA)",
    disclaimer: "Disclaimer: This platform provides estimations for trade planning. Official taxes are determined at the border by customs officers.",
    project_meta: "BSc. Software Engineering Project • Student: Mukakalisa Ketia • Supervisor: Emmanuel Annor",

    // Dashboard
    dash_welcome: "Welcome to Goma–Gisenyi Trade Portal",
    dash_summary: "Real-time decision support for border crossing, customs cost simulation, and regulatory tax incentives awareness.",
    dash_live_rates: "Live Exchange Rates (USD Base)",
    dash_status_title: "Corridor Operations Status",
    dash_status_active: "Goma (DRC) - Gisenyi (Rwanda) border crossings (Petite Barrière & Grande Barrière) are operating normally.",
    dash_stat_calculations: "Simulations Run Today",
    dash_stat_incentives: "Active Incentives Applied",
    dash_stat_satisfaction: "User Satisfaction Rating",
    dash_stat_flow: "Daily Corridor Crossings",
    dash_currency_calc: "Quick Currency Calculator",
    dash_news_ticker: "CORRIDOR UPDATES: EAC Simplified Trade Regime (STR) threshold remains at $2,000. • Rubavu/Gisenyi electronic single window is online. • OCC fee in DRC is 1.5% CIF. • DRC seed imports exemption is fully active.",

    // Products
    prod_beans: "Common Beans",
    prod_maize: "Maize / Corn",
    prod_cassava: "Cassava Roots / Flour",
    prod_vegetables: "Fresh Vegetables (Cabbage, Tomatoes, etc.)",
    prod_textiles: "Textiles / Finished Clothing",
    prod_electronics: "Smartphones & Electronics",
    prod_agri_inputs: "Agricultural Fertilizers / Seeds",
    notes_beans: "EAC STR eligible. Exchanged in high volumes in the corridor. Often 0% duty with Simplified Certificate of Origin.",
    notes_maize: "Primary grain crop. EAC STR eligible. Frequently traded from Rwanda to Goma.",
    notes_cassava: "Corridor staple crop. EAC STR eligible. 0% duty under STR conditions.",
    notes_vegetables: "Highly perishable. EAC STR eligible. Benefits from fast-track clearing.",
    notes_textiles: "Standard commercial merchandise. Subject to standard import tariffs (25%).",
    notes_electronics: "Subject to 10% duty. Requires standard declaration.",
    notes_agri_inputs: "Agricultural inputs. Eligible for DRC/Rwanda farming exemptions.",

    // Estimator
    est_title: "Customs Cost Estimator & Transparency Engine",
    est_intro: "Estimate import duties, VAT, and administrative fees for your cargo crossing the Goma–Gisenyi border. Apply tax incentives automatically.",
    est_direction: "Direction of Trade",
    est_dir_goma_gisenyi: "Goma (DRC) to Gisenyi (Rwanda)",
    est_dir_gisenyi_goma: "Gisenyi (Rwanda) to Goma (DRC)",
    est_prod_select: "Select Product Type",
    est_value: "Cargo Customs Value (FOB / USD)",
    est_weight: "Cargo Weight (Kilograms)",
    est_registered: "Are you a registered corporate taxpayer?",
    est_has_str_cert: "Do you hold an EAC Simplified Certificate of Origin?",
    est_is_small_scale: "Are you a small-scale trader (Cargo under $2,000)?",
    est_registered_yes: "Yes (Registered)",
    est_registered_no: "No (Informal / Individual)",
    est_cert_yes: "Yes, I have it",
    est_cert_no: "No Certificate",
    est_results: "Customs Valuation & Cost Breakdown",
    est_summary_val: "Calculated Import Tax Structure",
    est_base_val: "Declared Value:",
    est_duty: "Import Duty:",
    est_vat: "Value Added Tax (VAT):",
    est_withholding: "Withholding Tax:",
    est_fees: "Local Handling & Agency Fees:",
    est_total_tax: "Total Import Taxes & Fees:",
    est_final_cost: "Total Capital Required (Value + Tax):",
    est_saving_alert: "Tax Incentive Applied! You saved:",
    est_saving_congrats: "Congratulations! You qualified for the EAC Simplified Trade Regime. Your import duty is 0%.",
    est_no_incentive: "No incentives applied. Standard rates applied.",

    // Incentives Page
    inc_title: "Tax Incentives & Exemptions Directory",
    inc_intro: "Understand and verify the legal exemptions and tax holidays available for cross-border trade and investments in the Great Lakes region.",
    inc_authority: "Authority:",
    inc_benefits: "Benefit Rate:",
    inc_requirements: "Eligibility Requirements:",
    inc_quiz_title: "Incentive Eligibility Checker",
    inc_quiz_intro: "Answer a few questions to see if your trade consignment or business qualifies for major tax breaks.",
    inc_quiz_select_inc: "Select Incentive to check:",
    inc_quiz_result: "Checklist Assessment",
    inc_qualified: "You meet all eligibility criteria!",
    inc_unqualified: "You do not meet all criteria. Review the missing conditions below.",

    // Incentives definitions
    inc_eac_str_title: "EAC Simplified Trade Regime (STR)",
    inc_eac_str_desc: "A regional trade facilitation policy designed to help small-scale cross-border traders by removing import duties on goods grown or produced inside East African Community member states.",
    inc_eac_str_benefits: "0% Import Duty on eligible agricultural and manufactured goods.",
    req_eac_str_1: "Consignment value must be under $2,000 USD.",
    req_eac_str_2: "Goods must be produced locally within the EAC (certified by a simplified certificate of origin).",
    req_eac_str_3: "Traders must clear goods through official EAC border channels.",

    inc_drc_agri_title: "DRC Agricultural Seed and Input Exemption",
    inc_drc_agri_desc: "Under the DRC agricultural act, imports of certified seeds, fertilizers, chemical inputs, and specialized agricultural machinery are exempt from import customs tariffs and import VAT.",
    inc_drc_agri_benefits: "0% Duty and 0% VAT on farm inputs.",
    req_drc_agri_1: "Importer must be registered with the DRC Ministry of Agriculture.",
    req_drc_agri_2: "Goods must be strictly classified as agricultural inputs (fertilizers, seeds, tractors).",

    inc_rdb_title: "Rwanda Investment Code Benefits",
    inc_rdb_desc: "A comprehensive investor incentive framework managed by the Rwanda Development Board (RDB) to attract foreign and local capital in strategic sectors.",
    inc_rdb_benefits: "Corporate income tax holidays (up to 7 years), 15% preferential tax rate, and 0% import duty on capital equipment.",
    req_rdb_1: "Minimum investment of $250,000 USD for foreign investors (or $100,000 USD for EAC local nationals).",
    req_rdb_2: "Registration with the Rwanda Development Board and receipt of an Investment Certificate.",
    req_rdb_3: "Investment must be in target sectors (agriculture, manufacturing, tourism, ICT).",

    inc_anapi_title: "DRC ANAPI Investment Incentives",
    inc_anapi_desc: "Approved investment projects under the National Investment Promotion Agency (ANAPI) benefit from tax holidays, customs duty exemptions, and real estate tax breaks.",
    inc_anapi_benefits: "Full exemption from customs duties on capital equipment and raw materials for 3 to 5 years.",
    req_anapi_1: "Must submit a comprehensive investment plan and project dossier to ANAPI.",
    req_anapi_2: "Minimum project capital of $10,000 USD for SMEs or $200,000 USD for large corporations.",

    // Guides
    guide_title: "Step-by-Step Trade & Crossing Guides",
    guide_intro: "Choose the profile that best describes you to view an interactive, step-by-step roadmap of the Goma–Gisenyi border crossing process.",
    guide_tab_small: "Small-Scale Trader",
    guide_tab_med: "Medium-Scale Trader (SME)",
    guide_tab_investor: "Foreign Investor",
    guide_steps_header: "Border Crossing Walkthrough Steps",
    guide_docs_needed: "Documents you must carry:",
    guide_tips_header: "Practical Tips for this Pathway",
    guide_contacts_header: "Border Officials & Support Helpline",
    contact_coop_rep: "Cooperative Representative",
    contact_border_officer: "RRA Border Customs Officer",
    contact_helpdesk: "DGDA Corridor Helpdesk",
    contact_clearing_assoc: "Clearing Agents Association rep",
    contact_single_window: "ReSW support desk",
    contact_rdb_center: "RDB Investment Desk",
    contact_anapi_center: "ANAPI Promotion Desk",

    // Small guide details
    guide_small_title: "Small-Scale Cross-Border Trader Pathway",
    guide_small_sub: "Optimized for individual farmers, small shopkeepers, and women-led cooperative traders.",
    guide_small_overview: "This pathway utilizes the EAC Simplified Trade Regime. It is designed to minimize paperwork, eliminate duties for local produce, and protect small traders from informal payments.",
    guide_small_s1_title: "Cross-Border Identification & Health Check",
    guide_small_s1_desc: "Go to the joint border post (Petite Barrière). Present your CEPGL border pass or national ID card. Clear the health desk to verify yellow fever and general health compliance.",
    guide_small_s2_title: "Obtain Simplified Certificate of Origin",
    guide_small_s2_desc: "Go to the EAC Trade Information Desk (TID). Tell the officer your product type. If it's on the EAC common list, they will issue a Simplified Certificate of Origin for a nominal fee.",
    guide_small_s3_title: "Cargo Inspection and Weighing",
    guide_small_s3_desc: "Customs inspectors (DGDA in Goma, RRA in Gisenyi) will inspect your goods and weigh them to verify they are within the $2,000 threshold and qualify as local produce.",
    guide_small_s4_title: "Final Clearance & Local Fees",
    guide_small_s4_desc: "Receive your clearance slip. Pay any small municipal handling fees or cooperative levies at the cashier, and cross the border legally.",
    doc_cpgl: "CEPGL Border Pass or National ID Card",
    doc_yellow_fever: "Yellow Fever Health Card",
    doc_str_cert: "Simplified Certificate of Origin",
    doc_weigh: "Weighbridge weight ticket",
    doc_receipt: "Local municipal handling receipt",
    tip_small_1: "Always join a registered trade cooperative. Cooperatives have collective bargaining power and help clear agricultural goods faster.",
    tip_small_2: "Never pay custom duties to individual officers. All legal payments must have official receipts issued by RRA or DGDA cashiers.",
    tip_small_3: "If your cargo is under $2,000 USD, make sure to ask for the 'Simplified Certificate' specifically.",

    // Medium guide details
    guide_med_title: "Medium-Scale Trader & SME Pathway",
    guide_med_sub: "For commercial importers/exporters shipping bulk containers or full trucks.",
    guide_med_overview: "For trade consignments above $2,000, standard customs declarations are mandatory. This guide shows how to manage clearing agents and submit electronic document declarations.",
    guide_med_s1_title: "Trade Licensing & Tax Registration",
    guide_med_s1_desc: "Ensure your trading company is registered with the RCCM (DRC) or RDB (Rwanda). You must possess an active Tax Identification Number (TIN).",
    guide_med_s2_title: "Prepare Commercial Invoices & Origin Certificate",
    guide_med_s2_desc: "Acquire a formal Certificate of Origin from the Chamber of Commerce (RRA/DGDA). Organize your commercial invoices, packing lists, and transport bill of lading.",
    guide_med_s3_title: "Hire a Customs Clearing Agent",
    guide_med_s3_desc: "Submit your documents to a registered customs broker. They will file an electronic customs declaration (via ASYCUDA World in DRC or ReSW in Rwanda).",
    guide_med_s4_title: "Duty Payment & Release",
    guide_med_s4_desc: "Pay the calculated duties at a commercial bank. Once the system registers payment, customs will inspect (Green/Yellow/Red channel) and release the truck.",
    doc_trade_license: "Company Trade Registration License",
    doc_tax_id: "Taxpayer Identification Number (TIN)",
    doc_cert_origin: "Standard Certificate of Origin",
    doc_invoice: "Commercial Invoice & Packing List",
    doc_clearing_decl: "Electronic Customs Declaration",
    doc_bank_receipt: "Commercial bank payment receipt",
    tip_med_1: "Check the clearing agent's accreditation list at the customs website to avoid fraudulent brokers.",
    tip_med_2: "Submit documents 24-48 hours before the truck arrives at the Goma/Gisenyi border (Grande Barrière) to avoid demurrage costs.",

    // Investor guide details
    guide_inv_title: "Foreign Investor Strategic Pathway",
    guide_inv_sub: "For regional companies expanding trade operations, setting up manufacturing or large logistics hubs.",
    guide_inv_overview: "This guide outlines how to leverage the investment promotion agencies (RDB Rwanda and ANAPI DRC) to secure massive tax holidays and import capital equipment duty-free.",
    guide_inv_s1_title: "Incorporate Business & Apply for Certificate",
    guide_inv_s1_desc: "Register your branch or new entity. File your application with RDB (Kigali/Gisenyi) or ANAPI (Goma). Obtain your investment certificate.",
    guide_inv_s2_title: "Submit Investment Plan & List of Capital Goods",
    guide_inv_s2_desc: "Submit a detailed feasibility study and project plan. Provide a list of capital equipment (machinery, building supplies) that you intend to import.",
    guide_inv_s3_title: "Apply for Customs Duty Exemptions",
    guide_inv_s3_desc: "File for specific tax exemption licenses. The Ministry of Finance will approve 0% import duty on the equipment list for the duration of setup.",
    guide_inv_s4_title: "Compliance Audit & Operation Start",
    guide_inv_s4_desc: "Establish operations. RDB/ANAPI will perform periodic compliance audits to confirm investments meet employment and capital deployment targets.",
    doc_rdb_cert: "RDB Investment Certificate",
    doc_anapi_cert: "ANAPI Approved Certificate",
    doc_investment_plan: "Feasibility Study & 5-Year Capital Plan",
    doc_duty_exemption_appl: "Approved Tax Exemption Equipment List",
    doc_compliance_audit: "Compliance Audit certification",
    tip_inv_1: "Ensure that local materials are used where possible. Both countries offer extra tax incentives for hiring local labor and sourcing domestic raw materials.",
    tip_inv_2: "EAC national investors have lower capital requirements ($100k USD) to qualify for investment certificates in Rwanda compared to international investors ($250k USD).",
    tip_inv_3: "Approved investments can request fast-tracked border clearing lanes for project materials.",

    // Survey
    sur_title: "Usability & Perception Evaluation Survey",
    sur_intro: "Help us measure the impact of SmartTrade RDC on tax transparency and ease of cross-border trade. Rate your experience using the sliders or select buttons.",
    sur_q1: "How clear is the customs cost estimation breakdown compared to your current border experience?",
    sur_q2: "How easy is it to find and check eligibility for tax incentives on this platform?",
    sur_q3: "How useful are the step-by-step trade guides for your planning?",
    sur_q4: "Do you believe this digital tool increases transparency and trust in border customs charges?",
    sur_q5: "What is your overall satisfaction with SmartTrade RDC?",
    sur_comments: "Additional Comments or Border Challenges Experienced",
    sur_rating_1: "Very Poor",
    sur_rating_2: "Poor",
    sur_rating_3: "Neutral",
    sur_rating_4: "Good",
    sur_rating_5: "Excellent",
    sur_submitted: "Thank you! Your feedback has been simulated and added to the admin analytics dashboard.",

    // Admin Panel
    adm_title: "Simulated System Administration",
    adm_intro: "Configure customs tax rates, edit products, manage incentives, and monitor simulated portal usage analytics.",
    adm_tab_rates: "Tax Rates Management",
    adm_tab_products: "Products Registry",
    adm_tab_analytics: "Usage & Survey Analytics",
    adm_lbl_base_duty: "Base Duty Rate (%)",
    adm_lbl_vat_drc: "DRC VAT Rate (%)",
    adm_lbl_vat_rwa: "Rwanda VAT Rate (%)",
    adm_lbl_occ_fee: "DRC OCC Handling Fee (%)",
    adm_lbl_wh_nonreg: "Withholding Tax (Non-Registered) (%)",
    adm_btn_save: "Save Rate Configurations",
    adm_chart_calculations: "Simulated Calculations by Category",
    adm_chart_ratings: "Survey Ratings Average (5-point scale)",
    adm_feedback_received: "Recent Survey Feedback Responses"
  },
  fr: {
    // Nav & General
    app_title: "SmartTrade RDC",
    app_subtitle: "Portail de Commerce & Taxes Goma–Gisenyi",
    nav_dashboard: "Tableau de Bord",
    nav_estimator: "Estimateur de Coûts Douaniers",
    nav_incentives: "Incentives Fiscales",
    nav_guides: "Guides de Commerce",
    nav_survey: "Enquête d'Évaluation",
    nav_admin: "Console Admin",
    role_label: "Profil Simulé:",
    role_small_trader: "Petit Commerçant",
    role_medium_trader: "Moyen Commerçant / PME",
    role_investor: "Investisseur Étranger",
    role_admin: "Administrateur Système",
    btn_calculate: "Calculer les Coûts",
    btn_reset: "Réinitialiser",
    btn_submitting: "Envoi en cours...",
    btn_submit: "Soumettre les Commentaires",
    success_toast: "Action réussie!",
    last_updated: "Tarifs mis à jour: Juin 2026 (Source Officielle: DGDA & RRA)",
    disclaimer: "Avertissement: Ce portail fournit des estimations. Les taxes définitives sont fixées à la frontière par les agents de douane.",
    project_meta: "Projet de licence en génie logiciel • Étudiante: Mukakalisa Ketia • Superviseur: Emmanuel Annor",

    // Dashboard
    dash_welcome: "Bienvenue sur le portail de commerce Goma-Gisenyi",
    dash_summary: "Aide à la décision en temps réel pour le passage de la frontière, la simulation des coûts de douane et la sensibilisation aux avantages fiscaux réglementaires.",
    dash_live_rates: "Taux de Change Actuels (Base USD)",
    dash_status_title: "Statut des Opérations du Corridor",
    dash_status_active: "Les postes frontières de Goma (RDC) et Gisenyi (Rwanda) (Petite Barrière & Grande Barrière) fonctionnent normalement.",
    dash_stat_calculations: "Simulations Effectuées Aujourd'hui",
    dash_stat_incentives: "Avantages Fiscaux Appliqués",
    dash_stat_satisfaction: "Taux de Satisfaction Client",
    dash_stat_flow: "Traversées Quotidiennes du Corridor",
    dash_currency_calc: "Calculateur Rapide de Devises",
    dash_news_ticker: "ACTUALITÉS CORRIDOR: Le seuil du Régime Commercial Simplifié (RCS) de l'EAC reste fixé à 2000 $. • Le guichet unique électronique Rubavu/Gisenyi est opérationnel. • Les frais OCC en RDC sont de 1,5% de la valeur CIF. • L'exonération sur les intrants agricoles en RDC est active.",

    // Products
    prod_beans: "Haricots Communs",
    prod_maize: "Maïs / Grains",
    prod_cassava: "Manioc (Racines / Farine)",
    prod_vegetables: "Légumes Frais (Choux, Tomates, etc.)",
    prod_textiles: "Textiles / Vêtements Finis",
    prod_electronics: "Smartphones & Électronique",
    prod_agri_inputs: "Engrais Agricoles / Semences",
    notes_beans: "Éligible au RCS de l'EAC. Échangé en grands volumes dans le corridor. Souvent à 0% de douane avec certificat simplifié.",
    notes_maize: "Céréale principale. Éligible au RCS. Fréquemment importé vers Goma depuis le Rwanda.",
    notes_cassava: "Culture vivrière du corridor. Éligible au RCS. 0% de droit de douane sous conditions.",
    notes_vegetables: "Très périssable. Éligible au RCS. Bénéficie d'une procédure de dédouanement accélérée.",
    notes_textiles: "Marchandise commerciale standard. Soumis au tarif d'importation normal (25%).",
    notes_electronics: "Soumis à 10% de droit de douane. Nécessite une déclaration standard.",
    notes_agri_inputs: "Intrants agricoles. Éligible aux exonérations agricoles RDC/Rwanda.",

    // Estimator
    est_title: "Estimateur de Coûts & Moteur de Transparence",
    est_intro: "Estimez les droits d'importation, la TVA et les frais administratifs pour vos cargaisons traversant la frontière Goma-Gisenyi. Application automatique des réductions.",
    est_direction: "Direction du Commerce",
    est_dir_goma_gisenyi: "De Goma (RDC) à Gisenyi (Rwanda)",
    est_dir_gisenyi_goma: "De Gisenyi (Rwanda) à Goma (RDC)",
    est_prod_select: "Sélectionnez le Produit",
    est_value: "Valeur en Douane de la Cargaison (FOB / USD)",
    est_weight: "Poids de la Cargaison (Kilogrammes)",
    est_registered: "Êtes-vous un contribuable enregistré (TIN/Numéro d'Impôt)?",
    est_has_str_cert: "Avez-vous un Certificat d'Origine Simplifié EAC?",
    est_is_small_scale: "Êtes-vous un petit commerçant (Cargaison < 2000 $)?",
    est_registered_yes: "Oui (Enregistré)",
    est_registered_no: "Non (Informel / Individu)",
    est_cert_yes: "Oui, je le possède",
    est_cert_no: "Non, pas de Certificat",
    est_results: "Détail de l'Évaluation et des Taxes",
    est_summary_val: "Structure des Taxes d'Importation Calculée",
    est_base_val: "Valeur Déclarée:",
    est_duty: "Droit de Douane d'Importation:",
    est_vat: "Taxe sur la Valeur Ajoutée (TVA):",
    est_withholding: "Impôt Retenu à la Source:",
    est_fees: "Frais de Manutention Locaux & Agence:",
    est_total_tax: "Total des Taxes & Frais d'Importation:",
    est_final_cost: "Capital Total Requis (Valeur + Taxes):",
    est_saving_alert: "Avantage Fiscal Appliqué! Vous avez économisé:",
    est_saving_congrats: "Félicitations! Vous êtes éligible au Régime Commercial Simplifié de l'EAC. Droit de douane à 0%.",
    est_no_incentive: "Aucun avantage appliqué. Tarifs standard appliqués.",

    // Incentives Page
    inc_title: "Répertoire des Avantages Fiscaux & Exonérations",
    inc_intro: "Comprenez et vérifiez les exonérations légales et avantages fiscaux disponibles pour le commerce transfrontalier et les investissements dans la région des Grands Lacs.",
    inc_authority: "Autorité:",
    inc_benefits: "Taux de l'Avantage:",
    inc_requirements: "Conditions d'Éligibilité:",
    inc_quiz_title: "Vérificateur d'Éligibilité aux Avantages Fiscaux",
    inc_quiz_intro: "Répondez à quelques questions pour voir si votre cargaison ou votre entreprise est éligible à des réductions d'impôts.",
    inc_quiz_select_inc: "Sélectionnez l'avantage à tester:",
    inc_quiz_result: "Évaluation des Conditions",
    inc_qualified: "Vous remplissez toutes les conditions d'éligibilité!",
    inc_unqualified: "Vous ne remplissez pas toutes les conditions. Examinez les points manquants ci-dessous.",

    // Incentives definitions
    inc_eac_str_title: "Régime Commercial Simplifié de l'EAC (RCS)",
    inc_eac_str_desc: "Une politique régionale visant à aider les petits commerçants transfrontaliers en supprimant les droits de douane d'importation sur les produits cultivés ou fabriqués localement au sein de la Communauté d'Afrique de l'Est.",
    inc_eac_str_benefits: "Droits de douane d'importation à 0% sur les produits agricoles éligibles.",
    req_eac_str_1: "La valeur de la cargaison doit être inférieure à 2000 $ USD.",
    req_eac_str_2: "Les marchandises doivent être produites localement dans l'EAC (certifié par un certificat d'origine simplifié).",
    req_eac_str_3: "Les commerçants doivent déclarer leurs marchandises via les postes frontières officiels de l'EAC.",

    inc_drc_agri_title: "Exonération RDC sur les Intrants et Semences Agricoles",
    inc_drc_agri_desc: "Conformément à la loi agricole en RDC, les importations de semences certifiées, d'engrais, d'intrants chimiques et de machines agricoles spécialisées sont exemptées des droits de douane et de la TVA à l'importation.",
    inc_drc_agri_benefits: "0% Droits de douane et 0% TVA sur les intrants agricoles.",
    req_drc_agri_1: "L'importateur doit être agréé par le Ministère de l'Agriculture de la RDC.",
    req_drc_agri_2: "Les marchandises doivent être strictement classées comme intrants agricoles (semences, engrais, tracteurs).",

    inc_rdb_title: "Code des Investissements du Rwanda (RDB)",
    inc_rdb_desc: "Un cadre complet d'incitations géré par le Rwanda Development Board (RDB) pour attirer les capitaux locaux et étrangers dans des secteurs stratégiques.",
    inc_rdb_benefits: "Exonération d'impôt sur les sociétés (jusqu'à 7 ans), taux d'imposition préférentiel de 15%, et 0% de droit de douane sur les équipements de capital.",
    req_rdb_1: "Investissement minimum de 250 000 $ USD pour les étrangers (ou 100 000 $ USD pour les ressortissants locaux de l'EAC).",
    req_rdb_2: "Enregistrement auprès du RDB et obtention d'un certificat d'investissement.",
    req_rdb_3: "L'investissement doit cibler les secteurs prioritaires (agriculture, manufacture, tourisme, TIC).",

    inc_anapi_title: "Avantages aux Investissements ANAPI RDC",
    inc_anapi_desc: "Les projets d'investissement agréés par l'Agence Nationale pour la Promotion des Investissements (ANAPI) bénéficient d'exonérations fiscales et de droits de douane préférentiels.",
    inc_anapi_benefits: "Exonération totale des droits de douane sur les équipements et matières premières pendant 3 à 5 ans.",
    req_anapi_1: "Soumission d'un plan d'investissement et d'un dossier complet à l'ANAPI.",
    req_anapi_2: "Capital de projet minimum de 10 000 $ USD pour les PME ou 200 000 $ USD pour les grandes entreprises.",

    // Guides
    guide_title: "Guides Étape par Étape pour le Commerce",
    guide_intro: "Choisissez le profil qui vous correspond le mieux pour voir le processus détaillé du passage de la frontière Goma–Gisenyi.",
    guide_tab_small: "Petit Commerçant",
    guide_tab_med: "Moyen Commerçant (PME)",
    guide_tab_investor: "Investisseur Étranger",
    guide_steps_header: "Déroulement du Passage Frontière",
    guide_docs_needed: "Documents obligatoires à emporter:",
    guide_tips_header: "Conseils pratiques pour ce parcours",
    guide_contacts_header: "Officiels de Frontière & Assistance Helpline",
    contact_coop_rep: "Représentant Coopérative",
    contact_border_officer: "Agent des douanes RRA Gisenyi",
    contact_helpdesk: "Assistance DGDA Corridor",
    contact_clearing_assoc: "Représentant des Commissionnaires en Douane",
    contact_single_window: "Support Guichet Unique ReSW",
    contact_rdb_center: "Bureau des Investissements RDB",
    contact_anapi_center: "Bureau de Promotion ANAPI",

    // Small guide details
    guide_small_title: "Parcours des Petits Commerçants Transfrontaliers",
    guide_small_sub: "Optimisé pour les agriculteurs individuels, les petits boutiquiers et les femmes commerçantes en coopérative.",
    guide_small_overview: "Ce parcours utilise le Régime Commercial Simplifié (RCS) de l'EAC. Il est conçu pour réduire la paperasse, supprimer les taxes sur les produits locaux et protéger les commerçants contre les paiements informels.",
    guide_small_s1_title: "Identification transfrontalière et contrôle sanitaire",
    guide_small_s1_desc: "Rendez-vous au poste frontière conjoint (Petite Barrière). Présentez votre jeton ou laissez-passer CEPGL. Passez le contrôle sanitaire pour valider le vaccin de la fièvre jaune.",
    guide_small_s2_title: "Obtenir le Certificat d'Origine Simplifié",
    guide_small_s2_desc: "Présentez-vous au Bureau d'Information EAC (TID). Déclarez votre produit. S'il figure sur la liste commune de l'EAC, ils délivreront un certificat d'origine simplifié.",
    guide_small_s3_title: "Inspection de la cargaison et pesage",
    guide_small_s3_desc: "Les inspecteurs de douane (DGDA à Goma, RRA à Gisenyi) inspecteront vos marchandises et les pèseront pour s'assurer qu'elles respectent le seuil de 2000 $.",
    guide_small_s4_title: "Dédouanement final et taxes municipales",
    guide_small_s4_desc: "Récupérez votre fiche de dédouanement. Payez les petites taxes de manutention communale à la caisse officielle et traversez légalement.",
    doc_cpgl: "Jeton de passage CEPGL ou Carte d'Identité",
    doc_yellow_fever: "Carte de Vaccination Fièvre Jaune",
    doc_str_cert: "Certificat d'Origine Simplifié EAC",
    doc_weigh: "Ticket de pesée",
    doc_receipt: "Reçu officiel de manutention communale",
    tip_small_1: "Rejoignez toujours une coopérative commerciale enregistrée. Les coopératives ont un pouvoir de négociation collective et accélèrent le passage.",
    tip_small_2: "Ne payez jamais les taxes douanières à des agents individuels. Tous les paiements doivent faire l'objet de reçus officiels des caisses RRA/DGDA.",
    tip_small_3: "Si votre cargaison vaut moins de 2000 $ USD, demandez expressément le 'Certificat Simplifié'.",

    // Medium guide details
    guide_med_title: "Parcours des Moyens Commerçants & PME",
    guide_med_sub: "Pour les commerçants chargeant des camions ou des conteneurs commerciaux en vrac.",
    guide_med_overview: "Pour les cargaisons de plus de 2000 $, la déclaration de douane standard est obligatoire. Ce guide explique comment collaborer avec les commissionnaires en douane agréés.",
    guide_med_s1_title: "Licence commerciale et numéro d'impôt",
    guide_med_s1_desc: "Vérifiez que votre entreprise est bien enregistrée au RCCM (RDC) ou RDB (Rwanda). Vous devez posséder un numéro d'impôt (NIF/TIN) actif.",
    guide_med_s2_title: "Factures commerciales et Certificat d'Origine",
    guide_med_s2_desc: "Obtenez un certificat d'origine officiel auprès de la Chambre de Commerce. Rassemblez les factures commerciales, la liste de colisage et le manifeste.",
    guide_med_s3_title: "Engager un Commissionnaire en Douane",
    guide_med_s3_desc: "Soumettez vos documents à un déclarant agréé. Il saisira la déclaration électronique dans SYDONIA World (RDC) ou ReSW (Rwanda).",
    guide_med_s4_title: "Paiement de la Douane et Mainlevée",
    guide_med_s4_desc: "Payez les droits de douane calculés dans une banque commerciale agréée. Après validation, la douane inspecte et libère le camion.",
    doc_trade_license: "Registre du Commerce & Licence",
    doc_tax_id: "Numéro d'Identification Fiscale (NIF / TIN)",
    doc_cert_origin: "Certificat d'Origine Standard",
    doc_invoice: "Facture Commerciale & Liste de Colisage",
    doc_clearing_decl: "Déclaration de Douane Électronique",
    doc_bank_receipt: "Bordereau de paiement bancaire",
    tip_med_1: "Consultez la liste officielle des commissionnaires agréés sur le site de la douane pour éviter les faux courtiers.",
    tip_med_2: "Soumettez vos documents 24 à 48 heures avant l'arrivée du camion à la Grande Barrière pour éviter des frais de surestaries.",

    // Investor guide details
    guide_inv_title: "Parcours Stratégique pour les Investisseurs",
    guide_inv_sub: "Pour les entreprises régionales s'implantant à long terme ou créant des hubs logistiques.",
    guide_inv_overview: "Découvrez comment utiliser les agences RDB au Rwanda et ANAPI en RDC pour obtenir des congés fiscaux prolongés et importer vos équipements sans taxes.",
    guide_inv_s1_title: "Création d'entreprise et Certificat d'Agrément",
    guide_inv_s1_desc: "Enregistrez votre filiale locale. Déposez votre demande d'agrément au RDB (Rwanda) ou à l'ANAPI (RDC) pour obtenir votre certificat d'investisseur.",
    guide_inv_s2_title: "Soumission du Plan d'Investissement",
    guide_inv_s2_desc: "Soumettez une étude de faisabilité et un plan d'affaires. Fournissez la liste des équipements industriels que vous prévoyez d'importer.",
    guide_inv_s3_title: "Demande d'Exonération Douanière",
    guide_inv_s3_desc: "Déposez une demande de franchise douanière. Le Ministère des Finances approuvera le taux à 0% sur vos équipements pour la phase d'installation.",
    guide_inv_s4_title: "Audit de Conformité & Démarrage",
    guide_inv_s4_desc: "Lancez les opérations. Le RDB ou l'ANAPI effectuera des audits de conformité réguliers pour vérifier le respect des seuils d'investissement.",
    doc_rdb_cert: "Certificat d'Investissement RDB",
    doc_anapi_cert: "Arrêté d'Agrément ANAPI",
    doc_investment_plan: "Étude de Faisabilité & Plan de Capital sur 5 ans",
    doc_duty_exemption_appl: "Liste des Équipements Exonérés Approuvée",
    doc_compliance_audit: "Certificat d'audit de conformité",
    tip_inv_1: "Privilégiez la main-d'œuvre locale. Les deux pays accordent des réductions d'impôts supplémentaires si vous recrutez des nationaux.",
    tip_inv_2: "Les investisseurs ressortissants de l'EAC bénéficient de critères de capital réduits (100 000 $) pour obtenir le certificat RDB au Rwanda.",
    tip_inv_3: "Les projets d'investissement agréés peuvent demander des voies de passage prioritaires à la frontière pour leurs matériaux.",

    // Survey
    sur_title: "Enquête d'Évaluation de la Transparence",
    sur_intro: "Aidez-nous à mesurer l'impact de SmartTrade RDC sur la clarté fiscale et la facilitation du commerce. Donnez votre note honnête.",
    sur_q1: "Quelle est la clarté du calcul des taxes douanières comparé à vos expériences passées à la frontière?",
    sur_q2: "Est-il facile de trouver et vérifier votre éligibilité aux avantages fiscaux sur le portail?",
    sur_q3: "Les guides étape par étape sont-ils utiles pour planifier vos voyages commerciaux?",
    sur_q4: "Pensez-vous que cet outil numérique augmente la transparence et réduit la corruption?",
    sur_q5: "Quelle est votre satisfaction globale vis-à-vis de SmartTrade RDC?",
    sur_comments: "Commentaires Additionnels ou Difficultés Rencontrées à la Frontière",
    sur_rating_1: "Très Mauvais",
    sur_rating_2: "Mauvais",
    sur_rating_3: "Neutre",
    sur_rating_4: "Bon",
    sur_rating_5: "Excellent",
    sur_submitted: "Merci! Vos réponses ont été enregistrées et intégrées aux statistiques de l'administrateur.",

    // Admin Panel
    adm_title: "Administration du Système (Simulé)",
    adm_intro: "Configurez les taux de taxation, gérez les fiches de produits et surveillez les statistiques d'utilisation du portail.",
    adm_tab_rates: "Gestion des Taux de Taxe",
    adm_tab_products: "Registre des Produits",
    adm_tab_analytics: "Statistiques & Retours Enquête",
    adm_lbl_base_duty: "Droit de Douane de Base (%)",
    adm_lbl_vat_drc: "Taux TVA RDC (%)",
    adm_lbl_vat_rwa: "Taux TVA Rwanda (%)",
    adm_lbl_occ_fee: "Frais OCC RDC (%)",
    adm_lbl_wh_nonreg: "Précompte / Retenue (Non-Enregistré) (%)",
    adm_btn_save: "Enregistrer les modifications",
    adm_chart_calculations: "Nombre de Simulations par Catégorie",
    adm_chart_ratings: "Moyennes des Notes d'Enquête (Échelle 1-5)",
    adm_feedback_received: "Commentaires récents des utilisateurs"
  },
  sw: {
    // Nav & General
    app_title: "SmartTrade RDC",
    app_subtitle: "Tovuti ya Biashara na Kodi Goma–Gisenyi",
    nav_dashboard: "Mpanzo",
    nav_estimator: "Kikokotoo cha Ushuru",
    nav_incentives: "Vivutio vya Kodi",
    nav_guides: "Mwongozo wa Biashara",
    nav_survey: "Utafiti wa Tathmini",
    nav_admin: "Dashibodi ya Admin",
    role_label: "Wasifu Uliowekwa:",
    role_small_trader: "Mfanyabiashara Mdogo",
    role_medium_trader: "Mfanyabiashara wa Kati / SMEs",
    role_investor: "Mwekezaji wa Kigeni",
    role_admin: "Msimamizi wa Mfumo",
    btn_calculate: "Kokotoa Gharama",
    btn_reset: "Weka Upya",
    btn_submitting: "Inatuma...",
    btn_submit: "Tuma Maoni",
    success_toast: "Hatua Imekamilika Kikamilifu!",
    last_updated: "Viwango vimesasishwa: Juni 2026 (Chanzo Rasmi: DGDA & RRA)",
    disclaimer: "Ilani: Tovuti hii inatoa makadirio tu ya mipango ya biashara. Kodi halisi huamuliwa na maafisa wa forodha kwenye mpaka.",
    project_meta: "Mradi wa BSc. Software Engineering • Mwanafunzi: Mukakalisa Ketia • Msimamizi: Emmanuel Annor",

    // Dashboard
    dash_welcome: "Karibu kwenye Tovuti ya Biashara ya Goma–Gisenyi",
    dash_summary: "Msaada wa maamuzi ya papo hapo kwa uvukaji wa mpaka, makadirio ya gharama za forodha, na uelewa wa vivutio vya kodi.",
    dash_live_rates: "Viwango vya kubadilisha fedha (USD)",
    dash_status_title: "Hali ya Uendeshaji wa Mpaka",
    dash_status_active: "Mipaka ya Goma (DRC) na Gisenyi (Rwanda) (Petite Barrière na Grande Barrière) inafanya kazi kawaida.",
    dash_stat_calculations: "Makadirio Yaliyofanywa Leo",
    dash_stat_incentives: "Vivutio vya Kodi Vilivyotumika",
    dash_stat_satisfaction: "Kiwango cha Kuridhika kwa Watumiaji",
    dash_stat_flow: "Uvukaji wa Kila Siku wa Mpaka",
    dash_currency_calc: "Kikokotoo cha Haraka cha Fedha",
    dash_news_ticker: "HABARI MPYA: Kiwango cha chini cha utaratibu wa biashara uliorahisishwa (STR) wa EAC kinabaki $2,000. • Tovuti ya kielektroniki ya Rubavu/Gisenyi iko mtandaoni. • Ada ya OCC nchini DRC ni 1.5% ya CIF. • Msamaha wa kodi kwa pembejeo za kilimo DRC uko wazi.",


<truncated 1099 bytes>

NOTE: The output was truncated because it was too long. Use a more targeted query or a smaller range to get the information you need.