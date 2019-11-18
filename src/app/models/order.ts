export interface Order {
    id: number,
    stockId: number,
    buyerId: number,
    sellerId: number,
    offer: number,
    quantity: number,
    aproved: boolean,
    aprovedOn: Date,
    placedOn: Date
}