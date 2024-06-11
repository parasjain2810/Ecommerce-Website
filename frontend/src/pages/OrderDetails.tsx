import {
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardHeader,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import { useSingleOrderQuery } from "../redux/api/orderApi";
import { Navigate, useParams } from "react-router-dom";
import OrderItem from "../components/OrderItem";
import { Skeleton } from "../components/Loading";

export default function OrderDetails() {

   const {id}=useParams();
  const {data,isLoading,isError}=useSingleOrderQuery(id!)
  if(isError) return <Navigate to={'/orders'}/>
  const order=data?.order
  return (
    <>
      <section
        className="h-100 gradient-custom"
        style={{ backgroundColor: "#eee" }}
      >
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol lg="10" xl="8">
              <MDBCard style={{ borderRadius: "10px" }}>
                <MDBCardHeader className="px-4 py-5">
                  <MDBTypography tag="h5" className="text-muted mb-0">
                    Thanks for your Order,{" "}
                    <span style={{ color: "#a8729a" }}>{order?.user.name}</span>!
                  </MDBTypography>
                </MDBCardHeader>
                <MDBCardBody className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <p
                      className="lead fw-normal mb-0"
                      style={{ color: "#a8729a" }}
                    >
                      Receipt
                    </p>
                    <p className="small text-muted mb-0">
                      Receipt Voucher : {order?._id}
                    </p>
                  </div>

                  {isLoading?<Skeleton/>:
                  <MDBCard className="shadow-0 border mb-4">
                     {order?.orderItems.map((i)=>(
                      <OrderItem photo={i.photo} price={i.price}
                      name={i.name}
                      qunatity={i.quantity}
                      status={order.status}/>
                     ))}
                  </MDBCard>}

                  <div className="d-flex justify-content-between pt-2">
                    <p className="fw-bold mb-0">Order Details</p>
                    <p className="text-muted mb-0">
                      <span className="fw-bold me-4">Total</span>{order?.subtotal}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between pt-2">
                    <p className="text-muted mb-0">Invoice Number : {order?._id}</p>
                    <p className="text-muted mb-0">
                      <span className="fw-bold me-4">Discount</span> {order?.discount}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between">
                    {/* <p className="text-muted mb-0">
                      Invoice Date : 22 Dec,2019
                    </p> */}
                    <p className="text-muted mb-0">
                      <span className="fw-bold me-4">GST 18%</span> {order?.tax}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between mb-5">
                    <p className="text-muted mb-0">
                      Recepits Voucher : {order?._id}
                    </p>
                    <p className="text-muted mb-0">
                      <span className="fw-bold me-4">Delivery Charges</span>{" "}
                      {order?.shippingCharges}
                    </p>
                  </div>
                </MDBCardBody>
                <MDBCardFooter
                  className="border-0 px-4 py-5"
                  style={{
                    backgroundColor: "#a8729a",
                    borderBottomLeftRadius: "10px",
                    borderBottomRightRadius: "10px",
                  }}
                >
                  <MDBTypography
                    tag="h5"
                    className="d-flex align-items-center justify-content-end text-white text-uppercase mb-0"
                  >
                    Total paid: <span className="h2 mb-0 ms-2">{order?.total}</span>
                  </MDBTypography>
                </MDBCardFooter>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </>
  );
}
