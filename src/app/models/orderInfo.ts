export interface OrderInfo {
    id: number;
    stockId: number;
    buyerCompany: string;
    offered: number;
    qtdOrdered: number;
    aproved: boolean;
    revisedOn: string;
    placedOn: string;
    currentPrice: number;
    qtdAvaiable: number;
    company: string;
    symbol: string;
}