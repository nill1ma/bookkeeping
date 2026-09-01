import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import List from './page';
import { getIncomings } from '@/app/services/incomings/incomings';
import { getExpenses } from '@/app/services/expenses/expenses';
import { aggregateByReference } from './utils';

// Mock the API calls
jest.mock('@/app/services/incomings/incomings');
jest.mock('@/app/services/expenses/expenses');
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Mock the useLoading hook
let mockLoading = false;
jest.mock('@/app/hooks/useLoading/useLoading', () => ({
  useLoading: () => ({
    setLoading: jest.fn(),
    Loading: mockLoading ? 'Loading...' : null,
  }),
}));

describe('List Component', () => {
  const mockIncomings = [
    { id: 1, reference: '01/2024', origin: 'Salary', value: 5000 },
    { id: 2, reference: '02/2024', origin: 'Freelance', value: 2000 },
  ];

  const mockExpenses = [
    { id: 1, reference: '01/2024', destination: 'Rent', value: 1500 },
    { id: 2, reference: '02/2024', destination: 'Food', value: 800 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Data Fetching', () => {
    it('should fetch incomings and expenses on mount', async () => {
      (getIncomings as jest.Mock).mockResolvedValue(mockIncomings);
      (getExpenses as jest.Mock).mockResolvedValue(mockExpenses);

      render(<List />);

      await waitFor(() => {
        expect(getIncomings).toHaveBeenCalledTimes(1);
        expect(getExpenses).toHaveBeenCalledTimes(1);
      });
    });

    it('should aggregate data correctly', async () => {
      (getIncomings as jest.Mock).mockResolvedValue(mockIncomings);
      (getExpenses as jest.Mock).mockResolvedValue(mockExpenses);

      render(<List />);

      await waitFor(() => {
        const aggregated = aggregateByReference(mockIncomings, mockExpenses);
        expect(aggregated).toHaveLength(2);
        expect(aggregated[0].reference).toBe('01/2024');
        expect(aggregated[0].net_income).toBe(3500); // 5000 - 1500
      });
    });

    it('should handle empty data', async () => {
      (getIncomings as jest.Mock).mockResolvedValue([]);
      (getExpenses as jest.Mock).mockResolvedValue([]);

      render(<List />);

      await waitFor(() => {
        expect(screen.queryByText('01/2024')).not.toBeInTheDocument();
      });
    });

    it('should handle API errors gracefully', async () => {
      (getIncomings as jest.Mock).mockRejectedValue(new Error('API Error'));
      (getExpenses as jest.Mock).mockResolvedValue([]);

      render(<List />);

      // Should not crash, just handle the error
      await waitFor(() => {
        expect(getIncomings).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Table Rendering', () => {
    it('should render table headers correctly', async () => {
      (getIncomings as jest.Mock).mockResolvedValue(mockIncomings);
      (getExpenses as jest.Mock).mockResolvedValue(mockExpenses);

      render(<List />);

      await waitFor(() => {
        expect(screen.getByText('Reference').first()).toBeVisible();
        expect(screen.getByText('Incomings').first()).toBeVisible();
        expect(screen.getByText('Expenses').first()).toBeVisible();
        expect(screen.getByText('Net Income').first()).toBeVisible();
      });
    });

    it('should render data rows correctly', async () => {
      (getIncomings as jest.Mock).mockResolvedValue(mockIncomings);
      (getExpenses as jest.Mock).mockResolvedValue(mockExpenses);

      render(<List />);

      await waitFor(() => {
        expect(screen.getByText('01/2024').first()).toBeVisible();
        expect(screen.getByText('02/2024').first()).toBeVisible();
      });
    });

    it('should display calculated values', async () => {
      (getIncomings as jest.Mock).mockResolvedValue(mockIncomings);
      (getExpenses as jest.Mock).mockResolvedValue(mockExpenses);

      render(<List />);

      await waitFor(() => {
        expect(screen.getByText('5000').first()).toBeVisible(); // Incoming value
        expect(screen.getByText('1500').first()).toBeVisible(); // Expense value
      });
    });
  });

  describe('User Interactions', () => {
    it('should redirect to details page on row click', async () => {
      const { redirect } = require('next/navigation');
      (getIncomings as jest.Mock).mockResolvedValue(mockIncomings);
      (getExpenses as jest.Mock).mockResolvedValue(mockExpenses);

      render(<List />);

      await waitFor(() => {
        const row = screen.getByText('01/2024').closest('tr');
        if (row) {
          userEvent.click(row);
          expect(redirect).toHaveBeenCalledWith('/details/01%2F2024');
        }
      });
    });
  });

  describe('Data Aggregation', () => {
    it('should aggregate multiple items with same reference', () => {
      const multiIncomings = [
        { id: 1, reference: '01/2024', origin: 'Salary', value: 5000 },
        { id: 2, reference: '01/2024', origin: 'Bonus', value: 1000 },
      ];

      const result = aggregateByReference(multiIncomings, []);
      expect(result).toHaveLength(1);
      expect(result[0].incoming_value).toBe(6000);
      expect(result[0].origin).toContain('Salary');
      expect(result[0].origin).toContain('Bonus');
    });

    it('should sort results by reference', () => {
      const unsortedIncomings = [
        { id: 1, reference: '03/2024', origin: 'Salary', value: 5000 },
        { id: 2, reference: '01/2024', origin: 'Bonus', value: 1000 },
      ];

      const result = aggregateByReference(unsortedIncomings, []);
      expect(result[0].reference).toBe('01/2024');
      expect(result[1].reference).toBe('03/2024');
    });
  });
});