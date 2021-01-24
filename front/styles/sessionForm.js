import styled from 'styled-components';
import { ButtonDefault } from './reStyled';

export const Container = styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 700px;
height: 750px;
margin: 40px 0px;
background-color: #34495e;
border-radius: 40px;
box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
`;

export const Form = styled.form`
display: flex;
flex-direction: column;
padding: 30px 40px;
`;

export const TitleFormWrapper = styled.div`
display: flex;
flex-direction: column;
margin-bottom: 14px;
& label {
  color: #fffff6;
  font-size: 20px;
  font-weight: bolder;
}
& div {
  margin: 6px 0px;
  & input {
    width: 580px;
    border-radius: 15px;
    height: 40px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    font-size: 16px;
    color: #2f3640;
    /* margin: 7px 0px; */
  }
}
`;

export const CategoryWrapper = styled.div`
margin-bottom: 14px;
& label {
  color: #fffff6;
  font-size: 20px;
  font-weight: bolder;
}
& div {
  margin: 6px 0px;
  display: flex;
  flex-direction: column;
  & select {
    color: #2f3640;
    border-radius: 10px;
    height: 40px;
    font-size: 16px;
    width: 120px;
  }
}
`;

export const DescWrapper = styled.div`
margin-bottom: 14px;
display: flex;
flex-direction: column;
& label {
  color: #fffff6;
  font-size: 20px;
  font-weight: bolder;
}
& div {
  margin: 6px 0px;
  & textarea {
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px,
      rgba(0, 0, 0, 0.23) 0px 3px 6px;
    width: 580px;
    height: 70px;
    font-size: 16px;
    color: rgb(47, 54, 64);
    resize: none;
  }
}
`;

export const QuestionWrappers = styled.div`
margin-bottom: 14px;
display: flex;
flex-direction: column;
& span {
  color: #fffff6;
  font-size: 20px;
  font-weight: bolder;
}
`;

export const SubmitWrapper = styled.div`
display: flex;
justify-content: center;
`;

export const SubmitButton = styled(ButtonDefault)`
background-color: #e84118;
border-radius: 15px;
padding: 10px 90px;
`;
