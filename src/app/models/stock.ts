export interface Stock {
    id: number;
    userId: number;
    company: string;
    symbol: string;
    quantity: number;
    price: number;
    min: number;
    max: number;
}