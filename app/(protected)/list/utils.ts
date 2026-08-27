export function aggregateByReference(incomings: any[], expenses: any[]) {
  // Group incomings by reference and sum values
  const incomingsByRef = incomings.reduce((acc, item) => {
    const ref = item.reference;
    if (!acc[ref]) {
      acc[ref] = {
        totalValue: 0,
        origins: [] as string[]
      };
    }
    acc[ref].totalValue += item.value || 0;
    acc[ref].origins.push(item.origin);
    return acc;
  }, {} as Record<string, { totalValue: number; origins: string[] }>);

  // Group expenses by reference and sum values
  const expensesByRef = expenses.reduce((acc, item) => {
    const ref = item.reference;
    if (!acc[ref]) {
      acc[ref] = {
        totalValue: 0,
        destinations: [] as string[]
      };
    }
    acc[ref].totalValue += item.value || 0;
    acc[ref].destinations.push(item.destination);
    return acc;
  }, {} as Record<string, { totalValue: number; destinations: string[] }>);

  // Get all unique references
  const allReferences = new Set([
    ...Object.keys(incomingsByRef),
    ...Object.keys(expensesByRef)
  ]);

  // Create the combined array
  const result = Array.from(allReferences).map(reference => {
    const incomingData = incomingsByRef[reference] || { totalValue: 0, origins: [] };
    const expenseData = expensesByRef[reference] || { totalValue: 0, destinations: [] };
    
    return {
      reference,
      origin: incomingData.origins.join(', ') || 'N/A',
      incoming_value: incomingData.totalValue,
      destination: expenseData.destinations.join(', ') || 'N/A',
      expense_value: expenseData.totalValue,
      net_income: incomingData.totalValue - expenseData.totalValue
    };
  });

  // Sort by reference (month/year)
  return result.sort((a, b) => a.reference.localeCompare(b.reference));
}