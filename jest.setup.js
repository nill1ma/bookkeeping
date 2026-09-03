import '@testing-library/jest-dom'

// Mock react-intl to avoid ESM module issues
jest.mock('react-intl', () => ({
  IntlProvider: ({ children }) => children,
  FormattedMessage: ({ id, values }) => {
    let message = id;
    if (values) {
      Object.keys(values).forEach(key => {
        message = message.replace(`{${key}}`, values[key]);
      });
    }
    return <span>{message}</span>;
  },
  useIntl: () => ({
    formatMessage: ({ id }) => id,
    formatNumber: (num) => num.toString(),
    formatDate: (date) => date.toString(),
  }),
  createIntlCache: () => ({}),
  createIntl: () => ({
    formatMessage: ({ id }) => id,
    formatNumber: (num) => num.toString(),
    formatDate: (date) => date.toString(),
  }),
}))