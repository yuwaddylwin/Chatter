import {useLocation} from "react-router-dom";

const Home = () => {
    const location = useLocation();
    const user = location.state?.user; // Access the user data passed from the SignIn page
    return (
        <div>
            <h1>Welcome back, {user?.username}!🖐️ </h1>
        </div>
    )
}

export default Home;