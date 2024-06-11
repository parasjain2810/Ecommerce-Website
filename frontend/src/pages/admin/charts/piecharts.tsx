import AdminSidebar from "../../../components/admin/AdminSidebar";
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
import {categories} from "../../../assets/data.json";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { usePieInfoQuery } from "../../../redux/api/dashboardApi";
import { Navigate } from "react-router-dom";
import { Skeleton } from "../../../components/Loading";

const PieCharts = () => {
  const {user}=useSelector((state:RootState)=>state.userReducer)
  const {data,isLoading,isError}=usePieInfoQuery(user?._id!)
  const pie=data?.charts
  if(isError)return <Navigate to={"/dashboard"}/>
   
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Pie & Doughnut Charts</h1>
       {isLoading?<Skeleton/>:
       (
        <>
         <section>
          <div>  

            <PieChart 
              labels={["Processing", "Shipped", "Delivered"]}
              data={[pie?.orderFullFillment.processOrder!,pie?.orderFullFillment.Shipped!,pie?.orderFullFillment.Delivered!]}
              backgroundColor={[
                `hsl(110,80%, 80%)`,
                `hsl(110,80%, 50%)`,
                `hsl(110,40%, 50%)`,
              ]}
              offset={[0, 0, 50]}
            />
          </div>
          <h2>Order Fulfillment Ratio</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={pie?.productCategory.map((i)=>Object.keys(i)[0])!}
              data={pie?.productCategory.map((i)=>Object.values(i)[0])!}
              backgroundColor={categories.map(
                (i) => `hsl(${i.value * 4}, ${i.value}%, 50%)`
              )}
              legends={false}
              offset={[0, 0, 0, 80]}
            />
          </div>
          <h2>Product Categories Ratio</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={["In Stock", "Out Of Stock"]}
              data={[pie?.stockAvailability.inStock!, pie?.stockAvailability.outOfStock!]}
              backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
              legends={false}
              offset={[0, 80]}
              cutout={"70%"}
            />
          </div>
          <h2> Stock Availability</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={[
                "Marketing Cost",
                "Discount",
                "Burnt",
                "Production Cost",
                "Net Margin",
              ]}
              data={[pie?.revenueDistribution.marketingCost!, pie?.revenueDistribution.discount!, pie?.revenueDistribution.burnt!, pie?.revenueDistribution.productionCost!, pie?.revenueDistribution.netMargin!]}
              backgroundColor={[
                "hsl(110,80%,40%)",
                "hsl(19,80%,40%)",
                "hsl(69,80%,40%)",
                "hsl(300,80%,40%)",
                "rgb(53, 162, 255)",
              ]}
              legends={false}
              offset={[20, 30, 20, 30, 80]}
            />
          </div>
          <h2>Revenue Distribution</h2>
        </section>

        <section>
          <div>
            <PieChart
              labels={[
                "Teenager(Below 20)",
                "Adult (20-40)",
                "Older (above 40)",
              ]}
              data={[pie?.UserAge.teen!,pie?.UserAge.adult!,pie?.UserAge.older!]}
              backgroundColor={[
                `hsl(10, ${80}%, 80%)`,
                `hsl(10, ${80}%, 50%)`,
                `hsl(10, ${40}%, 50%)`,
              ]}
              offset={[0, 0, 50]}
            />
          </div>
          <h2>Users Age Group</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={["Admin", "Customers"]}
              data={[pie?.isAdmin.admin!,pie?.isAdmin.customers!]}
              backgroundColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
              offset={[0, 50]}
            />
          </div>
        </section>
        </>
       )}
      </main>
    </div>
  );
};

export default PieCharts;
