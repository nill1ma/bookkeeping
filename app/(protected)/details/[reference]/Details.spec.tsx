import { render, screen, waitFor } from '@testing-library/react';
import Details from './page';
import { getIncomingByReference } from '@/app/services/incomings/incomings';
import { getExpenseByReference } from '@/app/services/expenses/expenses';
import { useParams } from 'next/navigation';
import CardContainer from '@/app/components/card/card';
import CardItem from '@/app/components/card/cardItem';

// Mock the API calls
jest.mock('@/app/services/incomings/incomings');
jest.mock('@/app/services/expenses/expenses');
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

// Mock the useLoading hook
let mockLoading = false;
jest.mock('@/app/hooks/useLoading/useLoading', () => ({
  useLoading: () => ({
    setLoading: jest.fn(),
    Loading: mockLoading ? 'Loading...' : null,
  }),
}));

// Mock the card components
jest.mock('@/app/components/card/card');
jest.mock('@/app/components/card/cardItem');

describe('Details Component', () => {
  const mockIncomings = [
    { id: 1, reference: '01/2024', origin: 'Salary', value: 5000 },
    { id: 2, reference: '01/2024', origin: 'Bonus', value: 1000 },
  ];

  const mockExpenses = [
    { id: 1, reference: '01/2024', destination: 'Rent', value: 1500 },
    { id: 2, reference: '01/2024', destination: 'Food', value: 800 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockLoading = false;
    (useParams as jest.Mock).mockReturnValue({ reference: '01%2F2024' });
    
    // Setup card component mocks
    (CardContainer as jest.Mock).mockImplementation(({ children }) => (
      <div data-testid="card-container">{children}</div>
    ));
    
    (CardItem as jest.Mock).mockImplementation(({ label, value, className }) => (
      <div data-testid="card-item" className={className}>
        <span data-testid="label">{label}</span>
        <span data-testid="value">{value}</span>
      </div>
    ));
  });

  describe('URL Parameter Handling', () => {
    it('should decode the reference parameter', () => {
      (useParams as jest.Mock).mockReturnValue({ reference: '01%2F2024' });
      (getIncomingByReference as jest.Mock).mockResolvedValue([]);
      (getExpenseByReference as jest.Mock).mockResolvedValue([]);

      render(<Details />);

      expect(screen.getByText('Reference: 01/2024')).toBeInTheDocument();
    });

    it('should handle special characters in reference', () => {
      (useParams as jest.Mock).mockReturnValue({ reference: '01%2F2024%20Test' });
      (getIncomingByReference as jest.Mock).mockResolvedValue([]);
      (getExpenseByReference as jest.Mock).mockResolvedValue([]);

      render(<Details />);

      expect(screen.getByText('Reference: 01/2024 Test')).toBeInTheDocument();
    });
  });

  describe('Data Fetching', () => {
    it('should fetch incomings and expenses by reference', async () => {
      (getIncomingByReference as jest.Mock).mockResolvedValue(mockIncomings);
      (getExpenseByReference as jest.Mock).mockResolvedValue(mockExpenses);

      render(<Details />);

      await waitFor(() => {
        expect(getIncomingByReference).toHaveBeenCalledWith('01/2024');
        expect(getExpenseByReference).toHaveBeenCalledWith('01/2024');
      });
    });

    it('should refetch data when reference changes', async () => {
      (getIncomingByReference as jest.Mock).mockResolvedValue(mockIncomings);
      (getExpenseByReference as jest.Mock).mockResolvedValue(mockExpenses);

      const { rerender } = render(<Details />);

      await waitFor(() => {
        expect(getIncomingByReference).toHaveBeenCalledTimes(1);
      });

      // Change reference
      (useParams as jest.Mock).mockReturnValue({ reference: '02%2F2024' });
      rerender(<Details />);

      await waitFor(() => {
        expect(getIncomingByReference).toHaveBeenCalledWith('02/2024');
      });
    });

    it('should handle empty data', async () => {
      (getIncomingByReference as jest.Mock).mockResolvedValue([]);
      (getExpenseByReference as jest.Mock).mockResolvedValue([]);

      render(<Details />);

      await waitFor(() => {
        const cardContainers = screen.queryAllByTestId('card-container');
        expect(cardContainers).toHaveLength(2); // Both containers should render
      });
    });

    it('should handle API errors gracefully', async () => {
      (getIncomingByReference as jest.Mock).mockRejectedValue(new Error('API Error'));
      (getExpenseByReference as jest.Mock).mockResolvedValue([]);

      render(<Details />);

      // Should not crash, just handle the error
      await waitFor(() => {
        expect(getIncomingByReference).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Data Rendering', () => {
    it('should render incoming data with correct properties', async () => {
      (getIncomingByReference as jest.Mock).mockResolvedValue(mockIncomings);
      (getExpenseByReference as jest.Mock).mockResolvedValue([]);

      render(<Details />);

      await waitFor(() => {
        expect(screen.getByText('Incomings:')).toBeInTheDocument();
        const cardItems = screen.getAllByTestId('card-item');
        
        // Should only show 'origin' and 'value' properties
        const labels = cardItems.map(item => item.querySelector('[data-testid="label"]')?.textContent);
        expect(labels).toContain('origin');
        expect(labels).toContain('value');
      });
    });

    it('should render expense data with correct properties', async () => {
      (getIncomingByReference as jest.Mock).mockResolvedValue([]);
      (getExpenseByReference as jest.Mock).mockResolvedValue(mockExpenses);

      render(<Details />);

      await waitFor(() => {
        expect(screen.getByText('Expenses:')).toBeInTheDocument();
        const cardItems = screen.getAllByTestId('card-item');
        
        // Should only show 'destination' and 'value' properties
        const labels = cardItems.map(item => item.querySelector('[data-testid="label"]')?.textContent);
        expect(labels).toContain('destination');
        expect(labels).toContain('value');
      });
    });

    it('should display correct values for each property', async () => {
      (getIncomingByReference as jest.Mock).mockResolvedValue(mockIncomings);
      (getExpenseByReference as jest.Mock).mockResolvedValue(mockExpenses);

      render(<Details />);

      await waitFor(() => {
        expect(screen.getByText('Salary')).toBeInTheDocument();
        expect(screen.getByText('5000')).toBeInTheDocument();
        expect(screen.getByText('Rent')).toBeInTheDocument();
        expect(screen.getByText('1500')).toBeInTheDocument();
      });
    });

    it('should render multiple items for the same reference', async () => {
      (getIncomingByReference as jest.Mock).mockResolvedValue(mockIncomings);
      (getExpenseByReference as jest.Mock).mockResolvedValue([]);

      render(<Details />);

      await waitFor(() => {
        const cardItems = screen.getAllByTestId('card-item');
        // 2 items * 2 properties each = 4 card items
        expect(cardItems.length).toBeGreaterThanOrEqual(4);
      });
    });
  });

  describe('Component Structure', () => {
    it('should render reference in the UI', async () => {
      (getIncomingByReference as jest.Mock).mockResolvedValue([]);
      (getExpenseByReference as jest.Mock).mockResolvedValue([]);

      render(<Details />);

      await waitFor(() => {
        expect(screen.getByText('Reference: 01/2024')).toBeInTheDocument();
      });
    });

    it('should render section headers', async () => {
      (getIncomingByReference as jest.Mock).mockResolvedValue([]);
      (getExpenseByReference as jest.Mock).mockResolvedValue([]);

      render(<Details />);

      await waitFor(() => {
        expect(screen.getByText('Incomings:')).toBeInTheDocument();
        expect(screen.getByText('Expenses:')).toBeInTheDocument();
      });
    });

    it('should render card containers', async () => {
      (getIncomingByReference as jest.Mock).mockResolvedValue([]);
      (getExpenseByReference as jest.Mock).mockResolvedValue([]);

      render(<Details />);

      await waitFor(() => {
        const cardContainers = screen.getAllByTestId('card-container');
        expect(cardContainers).toHaveLength(2);
      });
    });
  });

  describe('Property Filtering', () => {
    it('should filter out non-origin and non-value properties from incomings', async () => {
      const extraPropsIncomings = [
        { id: 1, reference: '01/2024', origin: 'Salary', value: 5000, extra: 'should not show' },
      ];
      
      (getIncomingByReference as jest.Mock).mockResolvedValue(extraPropsIncomings);
      (getExpenseByReference as jest.Mock).mockResolvedValue([]);

      render(<Details />);

      await waitFor(() => {
        expect(screen.queryByText('should not show')).not.toBeInTheDocument();
        expect(screen.getByText('origin')).toBeInTheDocument();
        expect(screen.getByText('value')).toBeInTheDocument();
      });
    });

    it('should filter out non-destination and non-value properties from expenses', async () => {
      const extraPropsExpenses = [
        { id: 1, reference: '01/2024', destination: 'Rent', value: 1500, extra: 'should not show' },
      ];
      
      (getIncomingByReference as jest.Mock).mockResolvedValue([]);
      (getExpenseByReference as jest.Mock).mockResolvedValue(extraPropsExpenses);

      render(<Details />);

      await waitFor(() => {
        expect(screen.queryByText('should not show')).not.toBeInTheDocument();
        expect(screen.getByText('destination')).toBeInTheDocument();
        expect(screen.getByText('value')).toBeInTheDocument();
      });
    });
  });
});