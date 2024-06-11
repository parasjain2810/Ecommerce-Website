import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import { RootState } from "../../../redux/store";
import { useLineInfoQuery } from "../../../redux/api/dashboardApi";
import { CustomError } from "../../../types/types";
import toast from "react-hot-toast";
import { getLastMonths } from "../../../utils/features";
import { Skeleton } from "../../../components/Loading";


const {last12Months}=getLastMonths()
const Linecharts = () => {
  const {user}=useSelector((state:RootState)=>state.userReducer)
  const {data,isLoading,isError,error}=useLineInfoQuery(user?._id!)
  const lines=data?.lines
  if(isError){
    toast.error((error as CustomError).data.message)
  }
  return (
    <div className="admin-container">
      <AdminSidebar />
      {isLoading?<Skeleton/>:
      (
        <>
        <main className="chart-container">
        <h1>Line Charts</h1>
        <section>
          <LineChart
            data={lines?.users||[]}
            label="Users"
            borderColor="rgb(53, 162, 255)"
            labels={last12Months}
            backgroundColor="rgba(53, 162, 255, 0.5)"
          />
          <h2>Active Users</h2>
        </section>

        <section>
          <LineChart
            data={lines?.products||[]}
            backgroundColor={"hsla(269,80%,40%,0.4)"}
            borderColor={"hsl(269,80%,40%)"}
            labels={last12Months}
            label="Products"
          />
          <h2>Total Products (SKU)</h2>
        </section>

        <section>
          <LineChart
            data={lines?.revenue||[]}
            backgroundColor={"hsla(129,80%,40%,0.4)"}
            borderColor={"hsl(129,80%,40%)"}
            label="Revenue"
            labels={last12Months}
          />
          <h2>Total Revenue </h2>
        </section>

        <section>
          <LineChart
            data={lines?.discount||[]}
            backgroundColor={"hsla(29,80%,40%,0.4)"}
            borderColor={"hsl(29,80%,40%)"}
            label="Discount"
            labels={last12Months}
          />
          <h2>Discount Allotted </h2>
        </section>
      </main>
        </>
      )}
    </div>
  );
};

export default Linecharts;
