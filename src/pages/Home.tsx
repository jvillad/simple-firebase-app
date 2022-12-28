import { getDocs, collection } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { dbStore } from '../config/firebase';
import Post from './Post';

interface UserPost {
  id: string;
  userId: string;
  title: string;
  username: string;
  descriptiong: string;
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
        <Post key="key" />
      ))}
    </div>
  );
}
export default Home;
