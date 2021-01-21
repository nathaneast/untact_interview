import styled from 'styled-components';
import { ButtonDefault } from '../../../styles/reStyled';

export const MainContents = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0px;
`;

export const VideoBoard = styled.div`
  margin: 15px;
`;

export const VideoDownload = styled.div`
  display: flex;
  justify-content: center;
  & a {
    color: #fffff6;
  }
`;

export const VideoDownloadButton = styled(ButtonDefault)`
  padding: 8px 250px;
  border: 1px solid gray;
`;

export const FeedbackDesc = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  display: flex;
  flex-direction: column;
  width: 600px;
  & span {
    display: block;
    color: black;
    font-size: 18px;
    font-weight: bolder;
    padding: 5px;
  }
  & textarea {
    color: #2f3640;
    border-radius: 10px;
    margin-top: 5px;
    font-size: 16;
  }
`;

export const FeedbackFormBoard = styled.section`
  margin-bottom: 15px;
`;

export const ButtonWrapper = styled.div`
  margin-bottom: 20px;
`;

export const SubmitButton = styled(ButtonDefault)`
  padding: 8px 80px;
  border-radius: 20px;
`;
