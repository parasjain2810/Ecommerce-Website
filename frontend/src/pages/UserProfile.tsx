import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserReducerIntialState } from "../types/types";
import { BiArrowBack } from "react-icons/bi";
import { Skeleton } from "../components/Loading";

const Profile = () => {
    const {user,loading}=useSelector((state:{userReducer:UserReducerIntialState})=>state.userReducer)

    const navigate=useNavigate();
  return (
   <>
     <div className="userProfile">
     <button className='back-btn'  onClick={()=>navigate('/')}>
        <BiArrowBack/>
     </button>
     </div>
    {
      loading?<Skeleton/>:
      <div className="profile-page">
      <div className="content">
        <div className="content__cover">
          <div className="content__avatar"></div>
          <div className="content__bull"><span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
        <div className="content__actions">   
        <img src={user?.photo} alt={user?.name} />
        </div>
        <div className="content__title">
          <h1>{user?.name}</h1><span><b>{user?.role}👋</b></span>
        </div>
        <div className="content__description">
          <p><b>Email -</b>{user?.email} </p>
          <p><b>Date Of Birth -</b>{user?.dob} </p>
          <p><b>Gender -</b>{user?.gender} </p>
        </div>
        <div className="content__button"><a className="button" href={"/orders"}>
            <div className="button__border"></div>
            <div className="button__bg"></div>
            <div className="button__text">My Orders</div></a></div>
      </div>
      <div className="bg">
        <div><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>
    </div>
      
    }
   </>
  );
};

export default Profile;