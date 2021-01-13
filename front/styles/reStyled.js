import styled from 'styled-components';

export const ButtonNavy = styled.button`
  border-radius: 4px;
  padding: 6px 50px;
  color: #fffff6;
  background-color: #34495e;
  font-size: 15px;
  font-weight: bolder;
  color: #FFFFF6;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  & :hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }
  cursor: pointer;
`;
