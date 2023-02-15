import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { calSimilarity, convertToCalculateFormat, setModelBackend, loadModel, estimate } from "../utils/ModelFunction";
import { ModelParams } from "../utils/ModelParams";

const initModel = createAsyncThunk("SET_INITIAL_MODEL", async()=>{
    await setModelBackend();
    const model = await loadModel(ModelParams.Config, ModelParams.imageShape);
    return model;
})

const inferenceTarget = createAsyncThunk("INFERENCE_TARGET", async({model, target, videoTag})=>{
    // console.log('in async check params', model, videoTag, target);
    let pose = await estimate(model, videoTag);
    console.log(target, ' inf result :', pose);
    // await model.dispose();
    //결과 안나오면 여기 await 걸어 줘야 하는거 잊지마라
    pose = convertToCalculateFormat(pose);
    return {target: target, result: pose};
})

const calculateSimilarity = createAsyncThunk("CALCULATE_DISTANCE", async({user, teacher})=>{
    let similarity = calSimilarity(ModelParams.strategy, teacher, user);
    return similarity;
})

const drawTargetCanvasResults = createAsyncThunk("DRAW_RESULT_TO_TARGET", async({videoTag, canvasTag, result, color})=>{
    let context = canvasTag.getContext('2d');
    //draw background
    context.drawImage(videoTag, 0, 0, canvasTag.width, canvasTag.height);

})


const modelSlice = createSlice({

    name: 'modelSlice',

    initialState : {
        similarity : 0,
        color : '',
        model : '',
    
        userInferenceState : {
            cameraState : true,
            targetVideoRef : '',
            targetCanvasRef : '',
            targetCanvasContext: '',
            inferenceState : false,
            inferenceResult : {}
        },
    
        teacherSkeletonState : {
            isAttend : false,
            cameraState : true,
            targetVideoRef : '',
            targetCanvasRef : '',
            targetCanvasContext: '',
            skeletonState : false,
            skeletonResult : {},
            color : "Green"
        },
    },
    

    reducers : {

        setUserVideoRef:(state, action) => {
            if(state.userInferenceState.targetVideoRef ==='')
                state.userInferenceState.targetVideoRef = action.payload.current;
        },

        setUserCanvasRef:(state, action) =>{
            if(state.userInferenceState.targetCanvasRef === '')
                state.userInferenceState.targetCanvasRef = action.payload.current;
        },

        setUserCanvasContext:(state, action) =>{
            if(state.userInferenceState.targetCanvasContext === '')
                state.userInferenceState.targetCanvasContext = action.payload;
        },

        setTeacherVideoRef:(state, action) => {
            if(state.teacherSkeletonState.targetVideoRef === '')
                state.teacherSkeletonState.targetVideoRef = action.payload.current;
        },

        setTeacherCanvasRef:(state, action) =>{
            if(state.teacherSkeletonState.targetCanvasRef === '')
                state.teacherSkeletonState.targetCanvasRef = action.payload.current;
        },

        setTeacherCanvasContext:(state, action) =>{
            if(state.teacherSkeletonState.targetCanvasContext === '')
                state.teacherSkeletonState.targetCanvasContext = action.payload;
        },

        teacherIsAttend:(state) => {
            state.teacherSkeletonState.isAttend =!state.teacherSkeletonState.isAttend;
        },
        toggleUserCamera:(state)=>{
            state.userInferenceState.cameraState =!state.userInferenceState.cameraState;
        },
        toggleTeacherCamera:(state)=>{
            state.teacherSkeletonState.cameraState =!state.teacherSkeletonState.cameraState;
        },
        toggleInferenceMode:(state)=>{
            state.userInferenceState.inferenceState =!state.userInferenceState.inferenceState;
        },

        toggleSkeletonMode:(state)=>{
            state.teacherSkeletonState.skeletonState =!state.teacherSkeletonState.skeletonState;
        },
        returnToInitState:(state)=>{
            state.model = '';
            state.color = '';
            state.userInferenceState = {
                cameraState : true,
                targetVideoRef : '',
                targetCanvasRef : '',
                targetCanvasContext: '',
                inferenceState : false,
                inferenceResult : {}
            };
            //강사가 내 화면에 들어왔을 때 status 갱신해줘서 context 접근 가능하게 하자
            state.teacherSkeletonState = {
                isAttend : false,
                cameraState : true,
                targetVideoRef : '',
                targetCanvasRef : '',
                targetCanvasContext: '',
                skeletonState : false,
                skeletonResult : {},
                color : "Green"
            }; 
        },
    },

    extraReducers : {
        [initModel.fulfilled]:(state, {payload}) => {
            console.log('redux set model? ', payload);
            state.model = payload;
        },
        [inferenceTarget.fulfilled]:(state, {payload}) => {
            console.log('fulfilled? ',payload);
            if(payload.target !== "강사"){
                state.userInferenceState.inferenceResult = {...payload.result};
            }else {
                state.teacherSkeletonState.skeletonResult = {...payload.result};
            }
        },
        [calculateSimilarity.fulfilled]:(state, payload) => {
            let color = payload <= ModelParams.SIMILARITY_THRESHHOLD ? "Green" : "White";
            state.color = color;
        }
    }

})

export default modelSlice;

export const {
    setUserVideoRef, setUserCanvasRef, setUserCanvasContext,
    setTeacherVideoRef, setTeacherCanvasRef, setTeacherCanvasContext,
    toggleInferenceMode, toggleSkeletonMode, returnToInitState } = modelSlice.actions;

export { inferenceTarget, initModel };