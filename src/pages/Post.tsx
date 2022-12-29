/* eslint-disable import/no-cycle */
import { addDoc, getDocs, collection, query, where } from 'firebase/firestore';
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
  const [likes, setLikes] = useState<Like[] | null>(null);
  const [user] = useAuthState(auth);
  const likesRef = collection(dbStore, 'likes');
  const likesDoc = query(likesRef, where('postId', '==', post.id));
  // TODO: separate func to easily track errors/debug
  const getLikes = async () => {
    const data = await getDocs(likesDoc);
    setLikes(data.docs.map((doc) => ({ userId: doc.data().userId })));
  };

  // TODO make a new function
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
        <button type="button" onClick={addLike}>
          {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
        </button>
        {likes && <p>Likes: {likes.length}</p>}
      </div>
    </div>
  );
}

export default Post;
