/* eslint-disable import/no-cycle */
import { UserPost as IPost } from './Home';

interface Props {
  post: IPost;
}

function Post(props: Props) {
  const { post } = props;
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
      </div>
    </div>
  );
}

export default Post;
