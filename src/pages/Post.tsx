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
import { auth, dbStore } from '../config/firebase';
import { UserPost as IPost } from './Home';

interface Props {
  post: IPost;
}

interface Like {
  likeId: string;
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
    setLikes(
      data.docs.map((userDoc) => ({
        userId: userDoc.data().userId,
        likeId: userDoc.id,
      }))
    );
  };

  // TODO: make a new like function
  // get user who like the post
  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setLikes((prev) =>
          prev
            ? [...prev, { userId: user.uid, likeId: newDoc.id }]
            : [{ userId: user.uid, likeId: newDoc.id }]
        );
      }
    } catch (error) {
      console.error(error);
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
      const likeId = unlikeData.docs[0].id;
      const unlike = doc(dbStore, 'likes', likeId);
      await deleteDoc(unlike);
      if (user) {
        setLikes(
          (prev) => prev && prev.filter((like) => like.likeId !== likeId)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

  useEffect(() => {
    getLikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="post-container">
      <div className="title-post">
        <h2>{post.title}</h2>
      </div>
      <div className="body-post">
        <p>{post.description}</p>
      </div>
      <div className="footer-post">
        <p className="footer-uname">@{post.username}</p>
        <button
          className="like-btn"
          type="button"
          onClick={hasUserLiked ? removeLike : addLike}
        >
          {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
        </button>
        {likes?.length === 0 ? (
          <p>{}</p>
        ) : (
          likes && <p>Likes: {likes.length}</p>
        )}
      </div>
    </div>
  );
}

export default Post;
