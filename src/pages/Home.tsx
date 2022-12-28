import { getDocs, collection } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { dbStore } from '../config/firebase';
// eslint-disable-next-line import/no-cycle
import Post from './Post';

export interface UserPost {
  id: string;
  userId: string;
  title: string;
  username: string;
  description: string;
}

function Home() {
  const [postsList, setPostsList] = useState<UserPost[] | null>(null);
  // fetch to dbStore using firebase function
  const postsRef = collection(dbStore, 'posts');
  const fetchPosts = async () => {
    const data = await getDocs(postsRef);
    setPostsList(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as UserPost[]
    );
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <div>
      {postsList?.map((post) => (
        // eslint-disable-next-line react/jsx-key
        <Post post={post} />
      ))}
    </div>
  );
}
export default Home;
