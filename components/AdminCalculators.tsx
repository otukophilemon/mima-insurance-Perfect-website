// components/AdminCalculator.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Calculator,
  X,
  Car,
  Percent,
  DollarSign,
  Delete,
} from 'lucide-react';
import {
  MOTOR_RATES,
  calculateMotorPremium,
  calculateProRata,
  calculateInstallments,
  formatKES,
  formatPercent,
} from '@/lib/calculators';

type TabKey = 'basic' | 'motor' | 'prorata';

export default function AdminCalculator() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('basic');

  // ── Keyboard: Esc to close ─────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      {/* ── Floating Button ─────────────────────────────── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
         className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          title="Open Calculator (Esc to close when open)"
          aria-label="Open admin calculator"
        >
          <Calculator size={24} />
        </button>
      )}

      {/* ── Panel ────────────────────────────────────────── */}
      {open && (
          <div className="fixed bottom-24 right-6 z-40 w-[380px] max-w-[calc(100vw-2rem)] ...">
          {/* Header */}
          <div className="bg-[#0f172a] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator size={18} />
              <span className="font-bold text-sm">Quick Calculator</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 transition"
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <TabButton
              active={activeTab === 'basic'}
              onClick={() => setActiveTab('basic')}
              icon={<Calculator size={14} />}
              label="Basic"
            />
            <TabButton
              active={activeTab === 'motor'}
              onClick={() => setActiveTab('motor')}
              icon={<Car size={14} />}
              label="Motor"
            />
            <TabButton
              active={activeTab === 'prorata'}
              onClick={() => setActiveTab('prorata')}
              icon={<Percent size={14} />}
              label="Pro-rata"
            />
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'basic' && <BasicTab />}
            {activeTab === 'motor' && <MotorTab />}
            {activeTab === 'prorata' && <ProRataTab />}
          </div>
        </div>
      )}
    </>
  );
}

// ============================================
// TAB BUTTON
// ============================================

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition ${
        active
          ? 'text-[#1e3a8a] bg-white border-b-2 border-[#1e3a8a]'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ============================================
// TAB: BASIC CALCULATOR
// ============================================

function BasicTab() {
  const [display, setDisplay] = useState('0');
  const [previous, setPrevious] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [freshEntry, setFreshEntry] = useState(true);

  const handleDigit = (d: string) => {
    if (freshEntry) {
      setDisplay(d === '.' ? '0.' : d);
      setFreshEntry(false);
    } else {
      if (d === '.' && display.includes('.')) return;
      setDisplay(display === '0' && d !== '.' ? d : display + d);
    }
  };

  const handleOperator = (op: string) => {
    const current = parseFloat(display);
    if (previous !== null && operator) {
      const result = compute(previous, current, operator);
      setDisplay(String(result));
      setPrevious(result);
    } else {
      setPrevious(current);
    }
    setOperator(op);
    setFreshEntry(true);
  };

  const handleEquals = () => {
    if (previous === null || !operator) return;
    const current = parseFloat(display);
    const result = compute(previous, current, operator);
    setDisplay(String(result));
    setPrevious(null);
    setOperator(null);
    setFreshEntry(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevious(null);
    setOperator(null);
    setFreshEntry(true);
  };

  const handleBackspace = () => {
    if (freshEntry) return;
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  };

  const handlePercent = () => {
    const current = parseFloat(display);
    setDisplay(String(current / 100));
    setFreshEntry(true);
  };

  const compute = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return b === 0 ? 0 : a / b;
      default:
        return b;
    }
  };

  return (
    <div>
      {/* Display */}
      <div className="bg-gray-900 text-white rounded-xl p-4 mb-3 text-right">
        <div className="text-xs text-gray-400 h-4">
          {previous !== null ? `${previous} ${operator || ''}` : ''}
        </div>
        <div className="text-3xl font-bold font-mono truncate">{display}</div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {/* Row 1 */}
        <CalcBtn onClick={handleClear} variant="danger" label="C" />
        <CalcBtn onClick={handleBackspace} variant="secondary" icon={<Delete size={16} />} />
        <CalcBtn onClick={handlePercent} variant="secondary" label="%" />
        <CalcBtn onClick={() => handleOperator('÷')} variant="primary" label="÷" />

        {/* Row 2 */}
        <CalcBtn onClick={() => handleDigit('7')} label="7" />
        <CalcBtn onClick={() => handleDigit('8')} label="8" />
        <CalcBtn onClick={() => handleDigit('9')} label="9" />
        <CalcBtn onClick={() => handleOperator('×')} variant="primary" label="×" />

        {/* Row 3 */}
        <CalcBtn onClick={() => handleDigit('4')} label="4" />
        <CalcBtn onClick={() => handleDigit('5')} label="5" />
        <CalcBtn onClick={() => handleDigit('6')} label="6" />
        <CalcBtn onClick={() => handleOperator('-')} variant="primary" label="−" />

        {/* Row 4 */}
        <CalcBtn onClick={() => handleDigit('1')} label="1" />
        <CalcBtn onClick={() => handleDigit('2')} label="2" />
        <CalcBtn onClick={() => handleDigit('3')} label="3" />
        <CalcBtn onClick={() => handleOperator('+')} variant="primary" label="+" />

        {/* Row 5 */}
        <button
          onClick={() => handleDigit('0')}
          className="col-span-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 rounded-xl transition"
        >
          0
        </button>
        <CalcBtn onClick={() => handleDigit('.')} label="." />
        <CalcBtn onClick={handleEquals} variant="success" label="=" />
      </div>
    </div>
  );
}

function CalcBtn({
  onClick,
  label,
  icon,
  variant = 'default',
}: {
  onClick: () => void;
  label?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'danger' | 'success' | 'secondary';
}) {
  const styles = {
    default: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    primary: 'bg-[#1e3a8a] hover:bg-[#1e40af] text-white',
    danger: 'bg-red-100 hover:bg-red-200 text-red-700',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
  };
  return (
    <button
      onClick={onClick}
      className={`${styles[variant]} font-bold py-3 rounded-xl transition text-sm flex items-center justify-center`}
    >
      {icon || label}
    </button>
  );
}

// ============================================
// TAB: MOTOR PREMIUM
// ============================================

function MotorTab() {
  const [vehicleValue, setVehicleValue] = useState('');
  const [vehicleAge, setVehicleAge] = useState('');
  const [vehicleType, setVehicleType] = useState<'private' | 'commercial' | 'psv' | 'motorcycle'>('private');
  const [ncdPercent, setNcdPercent] = useState(0);
  const [thirdPartyOnly, setThirdPartyOnly] = useState(false);
  const [includeWindscreen, setIncludeWindscreen] = useState(false);
  const [includeExcessProtector, setIncludeExcessProtector] = useState(false);
  const [includePoliticalViolence, setIncludePoliticalViolence] = useState(false);

  const value = parseFloat(vehicleValue) || 0;
  const age = parseFloat(vehicleAge) || 0;

  const result =
    value > 0
      ? calculateMotorPremium({
          vehicleValue: value,
          vehicleAge: age,
          vehicleType,
          ncdPercent,
          thirdPartyOnly,
          includeWindscreen,
          includeExcessProtector,
          includePoliticalViolence,
        })
      : null;

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Vehicle Value (KES)
        </label>
        <input
          type="number"
          value={vehicleValue}
          onChange={(e) => setVehicleValue(e.target.value)}
          placeholder="e.g. 1500000"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Vehicle Age (yrs)
          </label>
          <input
            type="number"
            value={vehicleAge}
            onChange={(e) => setVehicleAge(e.target.value)}
            placeholder="e.g. 3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Type
          </label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] bg-white"
            disabled={thirdPartyOnly}
          >
            <option value="private">Private</option>
            <option value="commercial">Commercial</option>
            <option value="psv">PSV</option>
            <option value="motorcycle">Motorcycle</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          No Claim Discount
        </label>
        <select
          value={ncdPercent}
          onChange={(e) => setNcdPercent(parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] bg-white"
          disabled={thirdPartyOnly}
        >
          {MOTOR_RATES.ncdOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2 pt-1">
        <CheckRow
          label="Third-Party Only"
          checked={thirdPartyOnly}
          onChange={setThirdPartyOnly}
        />
        {!thirdPartyOnly && (
          <>
            <CheckRow
              label="Windscreen Cover (+KES 15,000)"
              checked={includeWindscreen}
              onChange={setIncludeWindscreen}
            />
            <CheckRow
              label="Excess Protector (+KES 5,000)"
              checked={includeExcessProtector}
              onChange={setIncludeExcessProtector}
            />
            <CheckRow
              label="Political Violence (+0.25%)"
              checked={includePoliticalViolence}
              onChange={setIncludePoliticalViolence}
            />
          </>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="mt-4 bg-[#1e3a8a] text-white rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider opacity-80">
              Total Premium
            </span>
            {!thirdPartyOnly && (
              <span className="text-xs opacity-80">
                Rate: {formatPercent(result.effectiveRate)}
              </span>
            )}
          </div>
          <div className="text-2xl font-bold">{formatKES(result.totalPremium)}</div>

          {!thirdPartyOnly && (
            <div className="border-t border-white/20 pt-2 space-y-1 text-xs">
              <Row label="Base Premium" value={formatKES(result.basePremium)} />
              {result.ncdDiscount > 0 && (
                <Row label="NCD Discount" value={`−${formatKES(result.ncdDiscount)}`} />
              )}
              {result.addonWindscreen > 0 && (
                <Row label="Windscreen" value={`+${formatKES(result.addonWindscreen)}`} />
              )}
              {result.addonExcessProtector > 0 && (
                <Row label="Excess Protector" value={`+${formatKES(result.addonExcessProtector)}`} />
              )}
              {result.addonPoliticalViolence > 0 && (
                <Row
                  label="Political Violence"
                  value={`+${formatKES(result.addonPoliticalViolence)}`}
                />
              )}
              <Row label="Levies + Stamp" value={`+${formatKES(result.trainingLevy + result.phcf + result.iraLevy + result.stampDuty)}`} />
            </div>
          )}

          {result.isBelowMinimum && (
            <div className="text-xs bg-yellow-400/20 border border-yellow-300/40 rounded p-2">
              Premium was below the KES 15,000 minimum — using minimum.
            </div>
          )}
        </div>
      )}

      <p className="text-[10px] text-gray-400 italic pt-2">
        Rates are industry-standard estimates. Confirm with MIMA's actual pricing.
      </p>
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded accent-[#1e3a8a]"
      />
      {label}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="opacity-80">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

// ============================================
// TAB: PRO-RATA
// ============================================

function ProRataTab() {
  const [annualPremium, setAnnualPremium] = useState('');
  const [monthsRemaining, setMonthsRemaining] = useState('');

  // Installments sub-tool
  const [showInstallments, setShowInstallments] = useState(false);
  const [depositPercent, setDepositPercent] = useState('30');
  const [numInstallments, setNumInstallments] = useState('3');

  const premium = parseFloat(annualPremium) || 0;
  const months = parseFloat(monthsRemaining) || 0;

  const proRataResult =
    premium > 0 && months > 0 ? calculateProRata(premium, months) : null;

  const installmentResult =
    premium > 0
      ? calculateInstallments(
          premium,
          parseFloat(depositPercent) || 0,
          parseInt(numInstallments) || 0
        )
      : null;

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Annual Premium (KES)
        </label>
        <input
          type="number"
          value={annualPremium}
          onChange={(e) => setAnnualPremium(e.target.value)}
          placeholder="e.g. 75000"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Months Remaining (for pro-rata)
        </label>
        <input
          type="number"
          value={monthsRemaining}
          onChange={(e) => setMonthsRemaining(e.target.value)}
          placeholder="e.g. 6"
          min="0"
          max="12"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
        />
      </div>

      {proRataResult && (
        <div className="bg-[#1e3a8a] text-white rounded-xl p-4">
          <div className="text-xs uppercase tracking-wider opacity-80 mb-1">
            Pro-Rata Premium ({monthsRemaining} months = {proRataResult.daysCharged} days)
          </div>
          <div className="text-2xl font-bold">
            {formatKES(proRataResult.proRataPremium)}
          </div>
          <div className="text-xs opacity-80 mt-2">
            Daily rate: {formatKES(proRataResult.dailyRate)}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-3">
        <button
          onClick={() => setShowInstallments(!showInstallments)}
          className="text-xs font-semibold text-[#1e3a8a] hover:underline"
        >
          {showInstallments ? '− Hide' : '+ Show'} installment breakdown
        </button>
      </div>

      {showInstallments && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Deposit %
              </label>
              <input
                type="number"
                value={depositPercent}
                onChange={(e) => setDepositPercent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                # Installments
              </label>
              <input
                type="number"
                value={numInstallments}
                onChange={(e) => setNumInstallments(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
            </div>
          </div>

          {installmentResult && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Deposit ({depositPercent}%)</span>
                <span className="font-semibold">{formatKES(installmentResult.deposit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining</span>
                <span className="font-semibold">{formatKES(installmentResult.remaining)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Each installment ({numInstallments}×)
                </span>
                <span className="font-bold text-[#1e3a8a]">
                  {formatKES(installmentResult.installmentAmount)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}