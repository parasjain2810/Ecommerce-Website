import { Order } from "./types"

export type MessageResponse={
  success:boolean,
  message:string
}

export type AllOrderResponse={
  success:boolean,
  order:Order[]
}

export type SingleOrderResponse={
  success:boolean,
  order:Order
}



export type StaticalResponse={
  success:boolean,
  stats:{
    changePercentage: {
      revenue: number,
      user: number,
      product: number,
      order: number
  },
  counts: {
      user:number,
      product: number,
      orderRevenue: number,
      orderCount: number
  },
  chart: {
      orderMonthCounts: number[],
      orderMonthyRevenue: number[]
  }
  categoriesCount:Record<string, number>[],
ratio: {
    men: number,
    female: number
},
modifiedTrasaction: [
    {
        _id: string,
        discount:number,
        total: number,
        orderItems: number,
        status: string
    }
]
}
}

export type PieResponse={
  success:boolean,
    charts: {
        orderFullFillment: {
            processOrder: number,
            Shipped: number,
            Delivered: number
        },
        productCategory: Record<string, number>[],
        stockAvailability: {
            outOfStock: number,
            inStock: number
        },
        UserAge: {
            teen: number,
            adult: number,
            older: number
        },
        isAdmin: {
            admin: number,
            customers: number
        },
        revenueDistribution: {
            netMargin: number,
            discount: number,
            productionCost: number,
            burnt: number,
            marketingCost: number
        }
    }
}

export type BarResponse={
  success:boolean,
  charts:{
    users:number[],
    products:number[],
    orders:number[],
  }
}
export type LineResponse={
  success:boolean,
  lines:{
    users:number[],
    products:number[],
    orders:number[],
    discount:number[],
    revenue:number[],
  }
}

export type Coupon={
  coupon:string,
  amount:number
}
export type CouponCreate={
    id:string,
    coupon:Coupon
}
export type CouponResponse={
  _id:string,
  code:string,
  amount:number
}
export type AllCoupons={
  success:boolean,
  AllCoupons:CouponResponse[]
}

export type DeleteCoupon={
  couponId:string,
  userId:string
}