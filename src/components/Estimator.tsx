import React, { useState, useEffect } from 'react';
import { EXCHANGE_RATES } from "../lib/currency";
import { Calculator, ShieldCheck, Award, Info, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EstimatorProps {
    userRole: string;
  taxRates: {
    baseDutyBeans: number;
    baseDutyMaize: number;
    baseDutyCassava: number;
    baseDutyVegetables: number;
    baseDutyTextiles: number;
    baseDutyElectronics: number;
    baseDutyAgriInputs: number;
    vatDrc: number;
    vatRwanda: number;
    occFeeDrc: number;
    whNonRegDrc: number;
    whNonRegRwanda: number;
    whRegDrc: number;
  };
  onCalculationRun: (productName: string, totalTaxUsd: number, incentiveApplied: boolean) => void;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
}

export const Estimator: React.FC<EstimatorProps> = ({ 

  userRole, 
  taxRates, 
  onCalculationRun,
  selectedProductId,
  setSelectedProductId
}) => {
  
  // Form States
  const [direction, setDirection] = useState<'goma_gisenyi' | 'gisenyi_goma'>('gisenyi_goma');
  const [cargoValue, setCargoValue] = useState<number>(500); // FOB USD
  const [cargoWeight, setCargoWeight] = useState<number>(250); // kg
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [hasStrCert, setHasStrCert] = useState<boolean>(true);
  const [products, setProducts] = useState<any[]>([]); // Fallback to local until fetched

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to fetch products in Estimator', err);
      }
    };
    fetchProducts();
  }, []);

  // Result States
  const [showResults, setShowResults] = useState<boolean>(false);
  const [calculation, setCalculation] = useState<{
    fobValue: number;
    cifValue: number; // Simulated CIF = FOB + 5% freight/insurance
    importDutyRate: number;
    importDutyAmount: number;
    vatRate: number;
    vatAmount: number;
    withholdingRate: number;
    withholdingAmount: number;
    otherFees: number;
    totalTax: number;
    totalCost: number;
    savings: number;
    strApplied: boolean;
    agriInputExempt: boolean;
    agriVatExempt: boolean;
  } | null>(null);

  // Pre-fill inputs based on userRole to make it user friendly and simulated
  useEffect(() => {
    if (userRole === 'small_trader') {
      setIsRegistered(false);
      setHasStrCert(true);
      setCargoValue(400);
      setCargoWeight(200);
    } else if (userRole === 'medium_trader') {
      setIsRegistered(true);
      setHasStrCert(false);
      setCargoValue(4500);
      setCargoWeight(2000);
    } else if (userRole === 'investor') {
      setIsRegistered(true);
      setHasStrCert(false);
      setCargoValue(25000);
      setCargoWeight(8000);
      setSelectedProductId('agri_inputs');
    }
  }, [userRole]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];
    
    if (!selectedProduct) return;
    
    // 1. Get base duty rate from parent config
    let baseDutyRate = 0.25;
    if (selectedProduct.id === 'beans') baseDutyRate = taxRates.baseDutyBeans;
    else if (selectedProduct.id === 'maize') baseDutyRate = taxRates.baseDutyMaize;
    else if (selectedProduct.id === 'cassava') baseDutyRate = taxRates.baseDutyCassava;
    else if (selectedProduct.id === 'vegetables') baseDutyRate = taxRates.baseDutyVegetables;
    else if (selectedProduct.id === 'textiles') baseDutyRate = taxRates.baseDutyTextiles;
    else if (selectedProduct.id === 'electronics') baseDutyRate = taxRates.baseDutyElectronics;
    else if (selectedProduct.id === 'agri_inputs') baseDutyRate = taxRates.baseDutyAgriInputs;

    // Simulated CIF value (customs base) = FOB value + 5% shipping/freight simulation
    const cifValue = cargoValue * 1.05;

    // 2. Evaluate incentives
    let strApplied = false;
    let agriInputExempt = false;
    let agriVatExempt = false;
    let appliedDutyRate = baseDutyRate;
    let appliedVatRate = direction === 'goma_gisenyi' ? (taxRates.vatRwanda / 100) : (taxRates.vatDrc / 100);

    // Incentive A: EAC Simplified Trade Regime (STR)
    // Conditions: Product is eligible, has STR certificate, value is < $2000
    if (selectedProduct.isEacStrEligible && hasStrCert && cargoValue <= 2000) {
      strApplied = true;
      appliedDutyRate = 0;
    }

    // Incentive B: DRC Agriculture Inputs Exemption
    // Conditions: Importing into DRC (Gisenyi -> Goma), product is agri inputs or eligible agri seeds
    if (direction === 'gisenyi_goma' && selectedProduct.id === 'agri_inputs') {
      agriInputExempt = true;
      appliedDutyRate = 0;
      appliedVatRate = 0; // Exchanged/exempt VAT
    }

    // Incentive C: Rwanda unprocessed agriculture VAT exemption
    // Conditions: Importing into Rwanda (Goma -> Gisenyi), product is unprocessed agricultural produce
    if (direction === 'goma_gisenyi' && selectedProduct.category === 'agriculture') {
      agriVatExempt = true;
      appliedVatRate = 0; // Rwanda exempts raw agriculture foods from VAT
    }

    // 3. Tax Calculations
    const importDutyAmount = cifValue * appliedDutyRate;
    
    // VAT Base = CIF + Import Duty
    const vatAmount = (cifValue + importDutyAmount) * appliedVatRate;

    // Withholding Tax (WHT)
    let appliedWhtRate = 0;
    if (direction === 'goma_gisenyi') {
      // Into Rwanda
      appliedWhtRate = isRegistered ? 0 : (taxRates.whNonRegRwanda / 100);
    } else {
      // Into DRC
      appliedWhtRate = isRegistered ? (taxRates.whRegDrc / 100) : (taxRates.whNonRegDrc / 100);
    }
    const withholdingAmount = cifValue * appliedWhtRate;

    // 4. Other handling fees
    let otherFees = 0;
    if (direction === 'goma_gisenyi') {
      // Into Rwanda: Radiation/Single window fee (0.2% CIF) + flat $10 handling
      otherFees = (cifValue * 0.002) + 10;
    } else {
      // Into DRC: OCC fee (taxRates.occFeeDrc %) + flat $5 municipality handling
      otherFees = (cifValue * (taxRates.occFeeDrc / 100)) + 5;
    }

    const totalTax = importDutyAmount + vatAmount + withholdingAmount + otherFees;
    const totalCost = cargoValue + totalTax;

    // Calculate Savings from incentives
    const standardDutyAmount = cifValue * baseDutyRate;
    const standardVatRate = direction === 'goma_gisenyi' ? (taxRates.vatRwanda / 100) : (taxRates.vatDrc / 100);
    const standardVatAmount = (cifValue + standardDutyAmount) * standardVatRate;
    const standardTax = standardDutyAmount + standardVatAmount + withholdingAmount + otherFees;
    
    const savings = Math.max(0, standardTax - totalTax);

    setCalculation({
      fobValue: cargoValue,
      cifValue,
      importDutyRate: appliedDutyRate,
      importDutyAmount,
      vatRate: appliedVatRate,
      vatAmount,
      withholdingRate: appliedWhtRate,
      withholdingAmount,
      otherFees,
      totalTax,
      totalCost,
      savings,
      strApplied,
      agriInputExempt,
      agriVatExempt
    });

    setShowResults(true);

    // Call back parent to increment stats
    const hasIncentive = strApplied || agriInputExempt || agriVatExempt;
    onCalculationRun(selectedProduct.name || 'Unknown', totalTax, hasIncentive);

    // Trigger Confetti if any tax incentives were unlocked
    if (hasIncentive && savings > 0) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#fbbf24', '#34d399', '#ffffff']
      });
    }
  };

  const handleReset = () => {
    setCargoValue(500);
    setCargoWeight(250);
    setIsRegistered(false);
    setHasStrCert(true);
    setShowResults(false);
    setCalculation(null);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-3xl p-5 md:p-6 shadow-sm border border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white leading-tight">
              Customs Cost Estimator & Transparency Engine
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Estimate import duties, VAT, and administrative fees for your cargo crossing the Gomaâ€“Gisenyi border. Apply tax incentives automatically.
            </p>
          </div>
        </div>

        <form onSubmit={handleCalculate} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Inputs Section */}
          <div className="space-y-4">
            {/* Direction selection */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                Direction of Trade
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('gisenyi_goma')}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    direction === 'gisenyi_goma'
                      ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900'
                  }`}
                >
                  Gisenyi (Rwanda) to Goma (DRC)
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('goma_gisenyi')}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    direction === 'goma_gisenyi'
                      ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900'
                  }`}
                >
                  Goma (DRC) to Gisenyi (Rwanda)
                </button>
              </div>
            </div>

            {/* Product selection */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Select Product Type
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-500 text-zinc-800 dark:text-zinc-200"
              >
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {(prod.nameKey && prod.nameKey) ? prod.nameKey : prod.name} ({prod.hsCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Value & Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Cargo Customs Value (FOB / USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-zinc-400">$</span>
                  <input
                    type="number"
                    value={cargoValue}
                    min="1"
                    onChange={(e) => setCargoValue(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-7 pr-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-brand-500 text-zinc-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Cargo Weight (Kilograms)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={cargoWeight}
                    min="1"
                    onChange={(e) => setCargoWeight(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-brand-500 text-zinc-800 dark:text-white"
                  />
                  <span className="absolute right-3.5 top-2 text-xs font-bold text-zinc-400">KG</span>
                </div>
              </div>
            </div>

            {/* Circumstances checkboxes */}
            <div className="space-y-2 pt-2 bg-zinc-50/50 dark:bg-zinc-900/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-850">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Are you a registered corporate taxpayer?
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Avoids 5% flat withholding tax at border
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isRegistered}
                  onChange={(e) => setIsRegistered(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-zinc-300 text-brand-600 focus:ring-brand-500 accent-brand-500 cursor-pointer"
                />
              </div>

              {products.find(p => p.id === selectedProductId)?.isEacStrEligible && (
                <div className="flex items-center justify-between border-t border-zinc-150 dark:border-zinc-800 pt-2.5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Do you hold an EAC Simplified Certificate of Origin?
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      Allows 0% duty on local crops under $2,000
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasStrCert}
                    onChange={(e) => setHasStrCert(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-zinc-300 text-brand-600 focus:ring-brand-500 accent-brand-500 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Calculation buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-brand-500/20 hover:brightness-105 transition-all cursor-pointer"
              >
                <Calculator className="h-4 w-4" />
                Calculate Costs
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-none p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 hover:text-brand-500 text-zinc-500 transition-colors cursor-pointer"
                title="Reset Form"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Outputs/Results Section */}
          <div className="flex flex-col justify-between h-full">
            {showResults && calculation ? (
              <div className="space-y-4">
                <div className="border border-brand-900/10 dark:border-zinc-800 bg-brand-500/5 dark:bg-brand-500/10 rounded-2xl p-4">
                  <h3 className="text-xs font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Customs Valuation & Cost Breakdown
                  </h3>
                  
                  {/* Line items list */}
                  <div className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-850">
                      <span>Declared Value:</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        ${calculation.fobValue.toLocaleString()} FOB / ${calculation.cifValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} CIF
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-850 items-center">
                      <div className="flex flex-col">
                        <span>Import Duty:</span>
                        {calculation.strApplied && (
                          <span className="text-[9px] text-brand-600 font-bold bg-brand-500/10 px-1 rounded self-start mt-0.5">
                            EAC STR Applied
                          </span>
                        )}
                        {calculation.agriInputExempt && (
                          <span className="text-[9px] text-brand-600 font-bold bg-brand-500/10 px-1 rounded self-start mt-0.5">
                            Agri Inputs Exempt
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        ${calculation.importDutyAmount.toFixed(2)} ({(calculation.importDutyRate * 100)}%)
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-850 items-center">
                      <div className="flex flex-col">
                        <span>Value Added Tax (VAT):</span>
                        {calculation.agriVatExempt && (
                          <span className="text-[9px] text-brand-600 font-bold bg-brand-500/10 px-1 rounded self-start mt-0.5">
                            Agri Exempt
                          </span>
                        )}
                        {calculation.agriInputExempt && (
                          <span className="text-[9px] text-brand-600 font-bold bg-brand-500/10 px-1 rounded self-start mt-0.5">
                            Input Exempt
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        ${calculation.vatAmount.toFixed(2)} ({(calculation.vatRate * 100)}%)
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-850 items-center">
                      <div className="flex flex-col">
                        <span>Withholding Tax:</span>
                        {isRegistered ? (
                          <span className="text-[9px] text-brand-600 font-bold bg-brand-500/10 px-1 rounded self-start mt-0.5">
                            Registered Rate
                          </span>
                        ) : (
                          <span className="text-[9px] text-accent-600 font-bold bg-accent-500/10 px-1 rounded self-start mt-0.5">
                            Non-Registered Penalized
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        ${calculation.withholdingAmount.toFixed(2)} ({(calculation.withholdingRate * 100)}%)
                      </span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span>Local Handling & Agency Fees:</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        ${calculation.otherFees.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Savings and Totals summary cards */}
                {calculation.savings > 0 && (
                  <div className="rounded-2xl border border-accent-500/20 bg-accent-500/5 dark:bg-accent-500/10 p-3.5 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-accent-500/10 text-accent-600">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-accent-600 dark:text-accent-400 uppercase tracking-wider block">
                        Tax Incentive Applied! You saved:
                      </span>
                      <span className="text-base font-black text-accent-600 dark:text-accent-400 font-display">
                        ${calculation.savings.toFixed(2)} USD
                      </span>
                      <span className="block text-[9px] text-zinc-500 mt-0.5">
                        {calculation.strApplied ? 'Congratulations! You qualified for the EAC Simplified Trade Regime. Your import duty is 0%.' : 'Tax relief applied based on exemptions.'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="bg-brand-500 text-white rounded-2xl p-4 shadow-md shadow-brand-500/10">
                    <span className="block text-[9px] font-bold text-brand-100 uppercase tracking-wider">
                      Total Import Taxes & Fees:
                    </span>
                    <span className="text-lg font-black font-display block mt-1">
                      ${calculation.totalTax.toFixed(2)} USD
                    </span>
                    <span className="block text-[9px] text-brand-200 mt-0.5 font-sans">
                      = {(calculation.totalTax * (direction === 'goma_gisenyi' ? EXCHANGE_RATES.RWF : EXCHANGE_RATES.CDF)).toLocaleString(undefined, { maximumFractionDigits: 0 })} {direction === 'goma_gisenyi' ? 'RWF' : 'CDF'}
                    </span>
                  </div>

                  <div className="bg-zinc-900 text-white dark:bg-zinc-850 rounded-2xl p-4">
                    <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                      Total Capital Required (Value + Tax):
                    </span>
                    <span className="text-lg font-black font-display block mt-1">
                      ${calculation.totalCost.toFixed(2)} USD
                    </span>
                    <span className="block text-[9px] text-zinc-400 mt-0.5 font-sans">
                      = {(calculation.totalCost * (direction === 'goma_gisenyi' ? EXCHANGE_RATES.RWF : EXCHANGE_RATES.CDF)).toLocaleString(undefined, { maximumFractionDigits: 0 })} {direction === 'goma_gisenyi' ? 'RWF' : 'CDF'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 bg-zinc-50/20 dark:bg-zinc-900/10">
                <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-400 mb-3">
                  <Calculator className="h-8 w-8 text-zinc-400" />
                </div>
                <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  Ready to Calculate
                </h4>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-[250px] leading-relaxed">
                  Enter cargo details and user circumstances in the form on the left, then click Calculate to view a detailed tax breakdown.
                </p>
              </div>
            )}

            {/* Informational Help Alert */}
            <div className="mt-4 flex items-start gap-2 rounded-2xl bg-zinc-50 dark:bg-zinc-900 p-3.5 border border-zinc-150 dark:border-zinc-800">
              <Info className="h-4 w-4 text-brand-600 mt-0.5 flex-none" />
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal font-sans">
                <strong>Simplified Trade Regime (STR):</strong> Requires goods to be on the EAC Common List of local crops (beans, maize, vegetables) and valued below $2,000. Ask border agents for the Simplified Certificate of Origin to get 0% duty.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
