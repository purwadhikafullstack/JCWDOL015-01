export const FormatCurrency = (amount: any) => {
    return new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(amount)
}