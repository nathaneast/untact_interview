import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
// import { useRouter } from 'next/router';

import StartPostModal from '../../components/modal/StartPostModal';
import PostCard from '../../components/PostCard';
import FeedbackCard from '../../components/FeedbackFormCard';
import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../../reducers/post';

const User = () => {
  return ( <div>유저 프로필 ! ! !</div>);
  // const dispatch = useDispatch();
  // const { me } = useSelector((state) => state.user);
  // const { userPosts, hasMorePosts, loadUserPostsLoading } = useSelector((state) => state.post);

  // const [modal, setModal] = useState(false);
  // const [selectedPostId, setSelectedPostId] = useState('');
  // const [selectedCategory, setSelectedCategory] = useState('myPost');

  // const pathname = window.location.pathname;

  // useEffect(() => {
  //   function onScroll() {
  //     if (
  //       window.pageYOffset + document.documentElement.clientHeight >
  //       document.documentElement.scrollHeight - 100
  //     ) {
  //       if (hasMorePosts && !loadUserPostsLoading) {
  //         dispatch({
  //           type: LOAD_USER_POSTS_REQUEST,
  //           data: {
  //             userId: me._id,
  //             lastId: userPosts[userPosts.length - 1]?._id,
  //             category: selectedCategory,
  //             isSame: true,
  //           },
  //         });
  //       }
  //     }
  //   }
  //   window.addEventListener('scroll', onScroll);
  //   return () => {
  //     window.removeEventListener('scroll', onScroll);
  //   };
  // }, [userPosts, hasMorePosts, loadUserPostsLoading, selectedCategory]);

  // const onSelectCategory = useCallback((e) => {
  //   if (e.target.tagName === 'LI' && selectedCategory !== e.target.dataset.name) {
  //     dispatch({
  //       type: LOAD_USER_POSTS_REQUEST,
  //       data: {
  //         userId: me._id,
  //         lastId: null,
  //         category: e.target.dataset.name,
  //         isSame: false,
  //       },
  //     });
  //     setSelectedCategory(e.target.dataset.name);
  //   }
  // }, [selectedCategory]);

  // console.log(userPosts, 'User userPosts');
  // console.log(pathname, 'User pathname');

  // return (
  //   <>
  //     <article>
  //       <article>
  //         <h2>userName: {me.nickname}</h2>
  //         <h2>email: {me.email}</h2>
  //       </article>
  //       <nav>
  //         <ul onClick={onSelectCategory}>
  //           <li data-name="myPost">myPost</li>
  //           {me ? <li data-name="feedback">feedback</li> : ''}
  //           <li data-name="star">star</li>
  //         </ul>
  //       </nav>
  //       <section>
  //         {userPosts.map((post, index) => (
  //           selectedCategory === 'feedback' ? (
  //             <div>
  //               피드백포스트
  //             </div>
  //             // <FeedbackCard
  //             //   key={post._id}
  //             //   question={post}
  //             //   answer={post}
  //             //   feedback={post}
  //             //   FeedbackNumber={index + 1}
  //             //   writeMode={false}
  //             // />
  //           ) : (
  //             <PostCard
  //               key={post._id}
  //               post={post}
  //               onModal={() => setModal(true)}
  //               startPost={setSelectedPostId}
  //             />
  //           )
  //         ))}
  //       </section>
  //       {modal && (
  //         <StartPostModal
  //           postId={selectedPostId}
  //           isLogin={Boolean(me)}
  //           resetPost={() => setSelectedPostId('')}
  //           modal={modal}
  //           onModal={() => setModal(false)}
  //         />
  //       )}
  //     </article>
  //   </>
  // );
};

// export const getServerSideProps = wrapper.getServerSideProps(
//   async (context) => {
//     const cookie = context.req ? context.req.headers.cookie : '';
//     axios.defaults.headers.Cookie = '';
//     if (context.req && cookie) {
//       axios.defaults.headers.Cookie = cookie;
//     }
//     context.store.dispatch({
//       type: LOAD_MY_INFO_REQUEST,
//     });
//     context.store.dispatch({
//       type: LOAD_USER_POSTS_REQUEST,
//       data: {
//         userId: context.params.id,
//         lastId: null,
//         category: 'myPost',
//         isSame: true,
//       },
//     });
//     context.store.dispatch(END);
//     await context.store.sagaTask.toPromise();
//   },
// );

export default User;
