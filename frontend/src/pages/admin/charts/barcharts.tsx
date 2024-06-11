import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import { RootState } from "../../../redux/store";
import { useBarInfoQuery } from "../../../redux/api/dashboardApi";
import { CustomError } from "../../../types/types";
import toast from "react-hot-toast";
import { getLastMonths } from "../../../utils/features";
import { Skeleton } from "../../../components/Loading";

const {last12Months,last6Months}=getLastMonths()
const Barcharts = () => {

  
  const {user}=useSelector((state:RootState)=>state.userReducer)
  const {data,isLoading,isError,error}=useBarInfoQuery(user?._id!)
  const bars=data?.charts
  if(isError){
    toast.error((error as CustomError).data.message)
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      {isLoading?<Skeleton/>:(
        <>
        <main className="chart-container">
        <h1>Bar Charts</h1>
        <section>
          <BarChart
            data_2={bars?.users||[]}
            data_1={bars?.products||[]}
            title_1="Products"
            title_2="Users"
            bgColor_1={`hsl(260, 50%, 30%)`}
            bgColor_2={`hsl(360, 90%, 90%)`}
            labels={last6Months}
          />
          <h2>Top Products & Top Customers</h2>
        </section>

        <section>
          <BarChart
            horizontal={true}
            data_1={bars?.orders||[]}
            data_2={[]}
            title_1="Orders"
            title_2=""
            bgColor_1={`hsl(180, 40%, 50%)`}
            bgColor_2=""
            labels={last12Months}
          />
          <h2>Orders throughout the year</h2>
        </section>
      </main>
        </>
      )}
    </div>
  );
};

export default Barcharts;
