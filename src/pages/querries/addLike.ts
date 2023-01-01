import { addDoc, collection, query, where } from 'firebase/firestore';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase';
import { UserPost as IPost } from '../Home';

interface Props {
  post: IPost;
}

interface Like {
  likeId: string;
  userId: string;
}

async function AddLike(props: Props) {
  const { post } = props;
  const [user] = useAuthState(auth);
  const [likes, setLikes] = useState<Like[] | null>(null);
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
}
