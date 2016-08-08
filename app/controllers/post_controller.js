import Post from '../models/post_model';

const cleanPosts = (posts) => {
  return posts.map(post => {
    return { id: post._id, title: post.title, tags: post.tags };
  });
};

export const createPost = (req, res) => {
  const post = new Post();

  post.title = req.body.title;
  post.content = req.body.content;
  post.tags = req.body.tags;
  post.save()
  .then(result => {
    res.json({ message: 'Post created' });
  }).catch(error => {
    res.json({ error });
  });
};
export const getPosts = (req, res) => {
  Post.find()
    .then(result => {
  //    result.sort('created_at');
      res.json(cleanPosts(result));
    }).catch(error => {
      res.send('Could not retrieve posts');
      res.json({ error });
    });
};

export const getPost = (req, res) => {
  Post.findById(req.params.postId)
  .then(response => {
    res.json(response);
  })
  .catch(error => {
    res.json(error);
  });
};

export const deletePost = (req, res) => {
  Post.findById(req.params.postId).remove(err => { console.log(err); });
  res.send('delete a post here');
};

export const updatePost = (req, res) => {
  Post.update({ _id: req.params.id }, req.body).then(result => {
    res.json({ message: 'Post Updated' });
  }).catch(error => {
    res.json({ error });
  });
};
