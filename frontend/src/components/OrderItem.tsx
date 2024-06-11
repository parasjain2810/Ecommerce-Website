import { MDBCardBody, MDBCardImage, MDBCol, MDBProgress, MDBProgressBar, MDBRow } from 'mdb-react-ui-kit'

type ProductsProps={
    photo:string,
    name:string,
    price:number,
    qunatity:number,
    status:string
  }
const OrderItem = ({
    price,
    name,
    photo,
    qunatity,status}:ProductsProps) => {
  return (
    <MDBCardBody>
    <MDBRow>
      <MDBCol md="2">
        <MDBCardImage
          src={`http://localhost:5000/${photo}`}
          fluid
          alt={name}
        />
      </MDBCol>
      <MDBCol
        md="2"
        className="text-center d-flex justify-content-center align-items-center"
      >
        <p className="text-muted mb-0">{name}</p>
      </MDBCol>
      <MDBCol
        md="2"
        className="text-center d-flex justify-content-center align-items-center"
      >
        <p className="text-muted mb-0 small">Qty: {qunatity}</p>
      </MDBCol>
      <MDBCol
        md="2"
        className="text-center d-flex justify-content-center align-items-center"
      >
        <p className="text-muted mb-0 small">₹{price}</p>
      </MDBCol>
    </MDBRow>
    <hr
      className="mb-4"
      style={{ backgroundColor: "#e0e0e0", opacity: 1 }}
    />
    <MDBRow className="align-items-center">
      <MDBCol md="2">
        <p className="text-muted mb-0 small">Track Order</p>
      </MDBCol>
      <MDBCol md="10">
        <MDBProgress
          style={{ height: "6px", borderRadius: "16px" }}
        >
          <MDBProgressBar
            style={{
              borderRadius: "16px",
              backgroundColor: "#a8729a",
            }}
            valuemin={0}
            valuemax={100}
            width={status==="shipped"?60:status==="processing"?10:100}
          />
        </MDBProgress>
        <div className="d-flex justify-content-around mb-1">
          <p className="text-muted mt-1 mb-0 small ms-xl-5">
            Out for delivary
          </p>
          <p className="text-muted mt-1 mb-0 small ms-xl-5">
            Delivered
          </p>
        </div>
      </MDBCol>
    </MDBRow>
  </MDBCardBody>
  )
}

export default OrderItem
