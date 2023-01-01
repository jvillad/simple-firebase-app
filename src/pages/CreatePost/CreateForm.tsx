/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { addDoc, collection } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const onCreatePost = async (data: CreateFormData) => {
    await addDoc(postsRef, {
      title: data.title,
      description: data.description,
      username: user?.displayName,
      userId: user?.uid,
    });

    // return to home after submitting post
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit(onCreatePost)} className="form-post">
      <div className="form-title">
        <input type="text" placeholder="Post Title" {...register('title')} />
      </div>
      <p style={{ color: 'red' }}>{errors.title?.message}</p>
      <div className="form-desc">
        <textarea placeholder="Post Description" {...register('description')} />
      </div>
      <p style={{ color: 'red' }}>{errors.description?.message}</p>
      <div className="form-submit">
        <input type="submit" />
      </div>
    </form>
  );
}

export default CreateForm;
