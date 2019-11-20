export interface Order {
    id: number,
    stockId: number,
    buyerId: number,
    buyerCompany: string,
    sellerId: number,
    sellerCompany: string,
    offer: number,
    quantity: number,
    aproved: boolean,
    revisedOn: string,
    placedOn: string
}