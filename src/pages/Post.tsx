/* eslint-disable import/no-cycle */
import {
  addDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRevalidator } from 'react-router-dom';
import { auth, dbStore } from '../config/firebase';
import { UserPost as IPost } from './Home';

interface Props {
  post: IPost;
}

interface Like {
  userId: string;
}

function Post(props: Props) {
  const { post } = props;

  // TODO: separate func to easily track errors/debug
  const [likes, setLikes] = useState<Like[] | null>(null);
  const [user] = useAuthState(auth);
  const likesRef = collection(dbStore, 'likes');
  const queryLike = query(likesRef, where('postId', '==', post.id));
  const getLikes = async () => {
    const data = await getDocs(queryLike);
    setLikes(data.docs.map((userDoc) => ({ userId: userDoc.data().userId })));
  };

  // TODO: make a new like function
  // get user who like the post
  const addLike = async () => {
    try {
      await addDoc(likesRef, { userId: user?.uid, postId: post.id });
      if (user) {
        setLikes((prev) =>
          prev ? [...prev, { userId: user.uid }] : [{ userId: user.uid }]
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // TODO: seperate remove function
  const removeLike = async () => {
    try {
      const queryUnlike = query(
        likesRef,
        where('postId', '==', post.id),
        where('userId', '==', user?.uid)
      );
      const unlikeData = await getDocs(queryUnlike);
      const unlike = doc(dbStore, 'likes', unlikeData.docs[0].id);
      await deleteDoc(unlike);
      // if (user) {
      //   setLikes((prev) =>
      //     prev ? [...prev, { userId: user.uid }] : [{ userId: user.uid }]
      //   );
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

  useEffect(() => {
    getLikes();
  }, []);

  return (
    <div>
      <div className="title">
        <h2>{post.title}</h2>
      </div>
      <div className="body">
        <p>{post.description}</p>
      </div>
      <div className="footer-post">
        <p>@{post.username}</p>
        <button type="button" onClick={hasUserLiked ? removeLike : addLike}>
          {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
        </button>
        {likes && <p>Likes: {likes.length}</p>}
      </div>
    </div>
  );
}

export default Post;
