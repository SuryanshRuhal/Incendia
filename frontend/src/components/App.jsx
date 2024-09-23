import { Route, Routes, useLocation } from 'react-router-dom';
import Homepage from './homepage';
import Navbar from './Navbar';
import ProfilePage from './Profilepage';
import Signin from './signin';
import ProfileInfo from './profileinfoform';
import Explore from './explore';
import ViewStory from './viewStory';
import ActivityPosts from './Activity';
import FollowingUser from './following';
import FollowerUser from './followers';

function App() {
  const Location = useLocation();
  const isSigninPage = Location.pathname === "/";

  return (
    <div className='App bg-[url("https://i.pinimg.com/564x/99/45/1e/99451ea69bb1c4991db0c0ebca045b55.jpg")] bg- bg-center bg-cover bg-no-repeat'>
      {!isSigninPage && (<div className='w-full bg-white px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64'>
        <Navbar />
      </div>)}
      <div className='sm:px-4 md:px-8 sm:py-2 lg:px-16 xl:px-32 2xl:px-64'>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/profileInfo" element={<ProfileInfo />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/profile/:username" element={<ProfilePage />}>
            <Route path="following" element={<FollowingUser />} />
            <Route path="followers" element={<FollowerUser />} />
          </Route>
          <Route path="/explore" element={<Explore />} />
          <Route path="/story/:id" element={<ViewStory />} />
          <Route path="/activity" element={<ActivityPosts />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
