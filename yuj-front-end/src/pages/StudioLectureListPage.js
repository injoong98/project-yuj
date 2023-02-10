import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LectureItemCard from "../components/LectureItemCard";
import StudioLectureListTopBar from "../components/StudioLectureListTopBar";
import StudioSidebar from "../components/StudioSidebar";
import { getStudioDetail, getStudioLectureList, getStudioLiveLecture } from "../stores/studioSlice";

const StudioLectureListPage = () => {

  //컴포넌트가 마운트 될 때 lecture list를 데이터베이스에서 불러오기(현재 위치한 스튜디오의 강사 userId 기반)
  let teacher = useSelector(state => state.studio.studioDetail);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('mount');
    console.log(teacher.nickname);
    dispatch(getStudioLectureList(teacher.userId));
    setLectureCount(lectureList.length);
    return () => {
    };
  }, []);
  let lectureList = useSelector(state => state.studio.studioLectureList)

  //불러온 lecture 개수 표시
  let [lectureCount, setLectureCount] = useState(0);

  //유저의 권한이 강사일 때 강의개설 버튼 생성
  const [userAuth, setUserAuth] = useState("teacher");

  //사이드바
  const user = useSelector(state => state.user);
  const studio = useSelector(state => state.studio);
  useEffect(() => {
    dispatch(getStudioDetail(user.userId));
    dispatch(getStudioLectureList(user.userId));
    dispatch(getStudioLiveLecture(user.userId));
  }, [])

  return (
    <>
      <div className="flex w-full">
        <StudioSidebar studioDetail={studio.studioDetail} userId={user.userId} studioLiveLecture={studio.studioLiveLecture}/>
        <div className="flex-auto px-40 pt-20">
          <p className="text-3xl font-bold text-accent mb-6 mr-3">강의 목록</p>
          <StudioLectureListTopBar userAuth={userAuth} lectureCount={lectureCount}/>
          <div className="flex py-12 px-0">
            <div className="flex flex-wrap justify-start gap-9">
              {lectureList.map((lecture) => (
                <LectureItemCard thisLecture={lecture} key={lecture.lectureId} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudioLectureListPage;
