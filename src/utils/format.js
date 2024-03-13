// aqui eu criei um formatodor de valor

const formatCurrency = (currency) => {
    const formatted = currency.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL'
    })
    return formatted
}


export {
    formatCurrency
}