import './App.css';
import { white, black } from 'tailwindcss/colors';
import MypageSidebar from './components/MypageSidebar';
import { BrowserRouter, Routes } from 'react-router-dom/dist';
import MyPage from './pages/MyPageDashBoard';
import StudioPage from './pages/StudioPage';
import { Route } from 'react-router-dom';
import MyPageInfo from './pages/MyPageInfo';
import MyPageLecture from './pages/MyPageLecture';
import MyPageDashBoard from './pages/MyPageDashBoard';



function App() {
  return (
    // start div
    <div className="App" style={{background : white}}> 
      
      
      <BrowserRouter>
      
        <Routes>
          <Route path="/mypage/dashboard" element={<MyPageDashBoard />}></Route>
          <Route path="/mypage/info" element={<MyPageInfo />}></Route>
          <Route path="/mypage/lecture" element={<MyPageLecture />}></Route>
        </Routes>
        
      </BrowserRouter>
      
      {/* end div */}
    </div>
  );
}

export default App;
