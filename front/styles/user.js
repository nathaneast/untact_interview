import styled from 'styled-components';

export const UserBoard = styled.div`
  width: 730px;
  margin: 12px 0px;
  background-color: #34495e;
  border-radius: 30px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
`;

export const Profile = styled.div`
  display: flex;
  justify-content: center;
  display: grid;
  grid-template-columns: 40% 60%;
  height: 118px;
  border-bottom: .5px solid #FFFFF6;
`;

export const Avatar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px 15px;
  & div {
    width: 60px;
    height: 60px;
    background-color: white;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #222f3e;
    font-size: 28px;
    font-weight: bolder;
}
`;

export const UserInfo = styled.article`
  color: #a4b0be;
  font-size: 17px;
  display: flex;
  margin: 0px 15px;
  flex-direction: column;
  justify-content: center;
`;

export const CategoryWrapper = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
`;

export const Category = styled.ul`
  display: flex;
  list-style: none;
  justify-content: center;
  padding: 0px;
  margin: 0px;
`;

export const CategoryItem = styled.li`
    margin: 0px 7px;
  & button {
    width: 88px;
    font-size: 14px;
    font-weight: 500;
    color: #2d3436;
    background-color: #dcdde1;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    cursor: pointer;
    &:hover{
      background-color: #e55039;
      color: #F8EFBA;
    }
  }
`;
