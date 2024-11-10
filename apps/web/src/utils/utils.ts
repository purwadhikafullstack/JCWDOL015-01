export const formatInputWithCommas = (value: string): string => {
    // Remove all non-numeric characters except for the decimal point
    const cleanedValue = value.replace(/[^0-9.]/g, '');

    // If there is a decimal point, split the value into integer and decimal parts
    const [integer, decimal] = cleanedValue.split('.');
    
    // Format the integer part with commas
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // If there is a decimal part, reattach it; otherwise, return the formatted integer
    return decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
};

export const formatCurrency = (value: number | string) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR', 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number(value));
};

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
    const time = date.toTimeString().split(' ')[0]; 
    return `${formattedDate}, ${time}`;
};
