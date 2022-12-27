/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { addDoc, collection } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, dbStore } from '../../config/firebase';

interface CreateFormData {
  title: string;
  description: string;
}

function CreateForm() {
  const [user] = useAuthState(auth);
  // input validation
  const schema = yup.object().shape({
    title: yup.string().required('Title required'),
    description: yup.string().required('Post description required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormData>({
    resolver: yupResolver(schema),
  });

  const postsRef = collection(dbStore, 'posts');

  const onCreatePost = async (data: CreateFormData) => {
    await addDoc(postsRef, {
      title: data.title,
      description: data.description,
      username: user?.displayName,
      userId: user?.uid,
    });
  };
  return (
    <form onSubmit={handleSubmit(onCreatePost)}>
      <input type="text" placeholder="Post Title" {...register('title')} />
      <p style={{ color: 'red' }}>{errors.title?.message}</p>
      <textarea placeholder="Post Description" {...register('description')} />
      <p style={{ color: 'red' }}>{errors.description?.message}</p>
      <input type="submit" />
    </form>
  );
}

export default CreateForm;
