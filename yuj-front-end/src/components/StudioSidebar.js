import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Styles from './StudioSidebar.module.css';
import { Link, Route } from 'react-router-dom';
import { CommonModal, CommonModalBtn } from '../components/CommonModal';
import { useNavigate, Navigate } from 'react-router-dom';

const StudioSidebar = (props) => {

  const {studioDetail, userId, studioLiveLecture} = props;

  const navigate = useNavigate();

  //강사
  const startLiveClicked = () => {
    console.log('Start Live!');
    navigate('/viduTeacher', { state: { mySessionId: '20', myUserName: '황아영', myUserType: '강사' } }) 
  }

  //수강생
  const goLiveClicked = () => {
    console.log('Go Live!');
    // <Link to='/vidu' state={{mySessionId : '20', myUserName : '황아영', myUserType : '강사'}}/>
    // navigate('/viduStudent', { state: { mySessionId: '20', myUserName: '황아영', myUserType: '강사' } })
    navigate('/viduStudent', { state: { mySessionId: '20', myUserName: '황아영', myUserType: '수강생' } }) 
  }


  // 사이드바 메뉴 추가하려면 아래 입력
  const sidebarMenu = [
    {
      name: "강의 목록",
      path: "/studioLectureListPage",
    },
    {
      name: "공지사항",
      path: "/studio",
    },
    {
      name: "수강 후기",
      path: "/studio/reviews",
    },
  ];

  return (
    <>
        <CommonModal 
          // title={'실시간 강의에 참여하시겠습니까?'} 
          content={'실시간 강의에 참여하시겠습니까?'} 
          buttons={[
            {
              text: "수강생으로 참여하기",
              className: "btn-accent text-white",
              onClickEvent: () => goLiveClicked()
            },
            {
              text: "강사로 수업 시작하기",
              className: "btn-accent text-white",
              onClickEvent: () => startLiveClicked()
            },
            {
              text: "취소하기",
              className: "btn-primary text-black"
            }
          ]}
          modalId={'studio-sidebar'}
        />
        <div className="drawer-side">
          <div className={'flex flex-col bg-primary items-center pt-16 '+Styles.studioSidebar}>
            <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
            <div className={'cursor-pointer'} onClick={() => navigate('/studio')}>
              <img className={Styles.profileImg} src={`${process.env.REACT_APP_IMAGE_URL}/assets/${studioDetail.profileImagePath}`}/>
            </div>
            <p className={Styles.teacherNickname+' mt-6'}>{studioDetail.nickname}</p>
            <p className={Styles.teacherEmail+' mt-3'}>{studioDetail.email}</p>
            <div className="rating mt-6 rating-sm flex justify-evenly w-24">
              <input type="radio" name="rating-2" className="mask mask-star-2 bg-accent" disabled/>
              <input type="radio" name="rating-2" className="mask mask-star-2 bg-accent" disabled/>
              <input type="radio" name="rating-2" className="mask mask-star-2 bg-accent" disabled/>
              <input type="radio" name="rating-2" className="mask mask-star-2 bg-accent" disabled/>
              <input type="radio" name="rating-2" className="mask mask-star-2 bg-accent" disabled/>
            </div>
            {
              studioDetail.userId != userId ?
              <CommonModalBtn text={'Go Live'} className={Styles.liveBtn +' border-none btn-accent mt-12'+ (Object.keys(studioLiveLecture).length === 0 ?' btn-disabled':'')} modalId={'studio-sidebar'}/>
              :
              <button className={Styles.liveBtn+' btn border-none mt-12 btn-accent'} onClick={() => startLiveClicked()}>Start Live</button>
            }
            <ul className={Styles.myPageSidebar+" menu pt-7 text-base-content w-full"} >
              {sidebarMenu.map((menu, index) => {
                return (
                  <li key={index}>
                    <Link to={menu.path} className={Styles.sidebarMenu}>
                      {menu.name}
                    </Link>
                  </li>
                );
              })}

            </ul>
            <img className={Styles.mypageSidebarYujLogo+' mb-10'} src='/assets/mypage-sidebar-yuj-logo.png' alt='yuj sidebar logo' />
          </div>
        </div>
    </>
  );
}

export default StudioSidebar;