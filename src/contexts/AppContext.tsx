import { createContext, useContext } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { useTheme } from '../hooks/useTheme';
import { useAuthSession } from '../hooks/useAuthSession';
import { useAuthActions } from '../hooks/useAuthActions';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { useFirestoreData } from '../hooks/useFirestoreData';
import { useAiAnalysis } from '../hooks/useAiAnalysis';
import { useModalState } from '../hooks/useModalState';
import { useFirestoreMutations } from '../hooks/useFirestoreMutations';
import { exportData as exportBackupData, importData as importBackupData } from '../utils/importExport';
import { Employee, Expense, InventoryItem, RevenueRecord, CompanyPortfolio, Subscription, Currency } from '../types';

type FormSubmitHandler = (e: FormEvent<HTMLFormElement>) => Promise<void>;

interface AppContextValue {
  // Auth
  user: User | null;
  loading: boolean;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
  upgradeToPro: () => Promise<void>;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Currency
  rates: Record<Currency, number>;
  displayCurrency: Currency;
  setDisplayCurrency: (currency: Currency) => void;

  // Data
  employees: Employee[];
  expenses: Expense[];
  inventory: InventoryItem[];
  revenue: RevenueRecord[];
  portfolio: CompanyPortfolio | null;
  subscription: Subscription | null;

  // AI
  aiAnalysis: string | null;
  isAnalyzing: boolean;
  aiError: string | null;
  runAiAnalysis: (employee: Employee) => Promise<void>;
  runStrategicDecision: (context: string) => Promise<void>;

  // Modals
  modals: ReturnType<typeof useModalState>['modals'];
  openEmployeeModal: (employee: Employee | null) => void;
  closeEmployeeModal: () => void;
  openExpenseModal: () => void;
  closeExpenseModal: () => void;
  openInventoryModal: () => void;
  closeInventoryModal: () => void;
  openRevenueModal: () => void;
  closeRevenueModal: () => void;
  openPortfolioModal: () => void;
  closePortfolioModal: () => void;
  selectEmployee: (employee: Employee | null) => void;
  setProSubTab: (tab: 'inventory' | 'portfolio' | 'revenue') => void;
  toggleProMenu: () => void;

  // Mutations
  addEmployee: FormSubmitHandler;
  deleteEmployee: (id: string) => Promise<void>;
  addExpense: FormSubmitHandler;
  addInventoryItem: FormSubmitHandler;
  addRevenueRecord: FormSubmitHandler;
  savePortfolio: FormSubmitHandler;

  // Utils
  exportData: () => void;
  importData: (e: ChangeEvent<HTMLInputElement>) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, loading } = useAuthSession();
  const { handleLogin, handleLogout, upgradeToPro } = useAuthActions({ user });
  const { rates, displayCurrency, setDisplayCurrency } = useExchangeRates();
  const data = useFirestoreData(user);
  const { aiAnalysis, isAnalyzing, aiError, runAiAnalysis, runStrategicDecision } = useAiAnalysis(data.employees, data.expenses);
  const modalState = useModalState();
  const mutations = useFirestoreMutations({
    user,
    subscription: data.subscription,
    portfolio: data.portfolio,
    modals: { editingEmployee: modalState.modals.editingEmployee },
    onCloseEmployeeModal: modalState.closeEmployeeModal,
    onCloseExpenseModal: modalState.closeExpenseModal,
    onCloseInventoryModal: modalState.closeInventoryModal,
    onCloseRevenueModal: modalState.closeRevenueModal,
    onClosePortfolioModal: modalState.closePortfolioModal,
  });

  const value: AppContextValue = {
    user,
    loading,
    handleLogin,
    handleLogout,
    upgradeToPro,
    isDarkMode,
    toggleDarkMode,
    rates,
    displayCurrency,
    setDisplayCurrency,
    employees: data.employees,
    expenses: data.expenses,
    inventory: data.inventory,
    revenue: data.revenue,
    portfolio: data.portfolio,
    subscription: data.subscription,
    aiAnalysis,
    isAnalyzing,
    aiError,
    runAiAnalysis,
    runStrategicDecision,
    modals: modalState.modals,
    openEmployeeModal: modalState.openEmployeeModal,
    closeEmployeeModal: modalState.closeEmployeeModal,
    openExpenseModal: modalState.openExpenseModal,
    closeExpenseModal: modalState.closeExpenseModal,
    openInventoryModal: modalState.openInventoryModal,
    closeInventoryModal: modalState.closeInventoryModal,
    openRevenueModal: modalState.openRevenueModal,
    closeRevenueModal: modalState.closeRevenueModal,
    openPortfolioModal: modalState.openPortfolioModal,
    closePortfolioModal: modalState.closePortfolioModal,
    selectEmployee: modalState.selectEmployee,
    setProSubTab: modalState.setProSubTab,
    toggleProMenu: modalState.toggleProMenu,
    addEmployee: mutations.addEmployee,
    deleteEmployee: mutations.deleteEmployee,
    addExpense: mutations.addExpense,
    addInventoryItem: mutations.addInventoryItem,
    addRevenueRecord: mutations.addRevenueRecord,
    savePortfolio: mutations.savePortfolio,
    exportData: () => {
      exportBackupData({
        employees: data.employees,
        expenses: data.expenses,
        inventory: data.inventory,
        revenue: data.revenue,
        portfolio: data.portfolio
      });
    },
    importData: (e: ChangeEvent<HTMLInputElement>) => {
      if (!user) return;

      importBackupData(e, {
        user,
        subscription: data.subscription,
        onImport: () => {},
      });
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
