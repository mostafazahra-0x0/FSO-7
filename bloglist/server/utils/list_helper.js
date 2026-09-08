const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  const reducer = (favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite;
  };
  return blogs.reduce(reducer, blogs[0]);
};

const mostBlogs = (blogs) => {
  const counts = {};
  let mostAuthor = null;
  let topCount = 0;
  for (const blog of blogs) {
    if (counts[blog.author] === undefined) {
      counts[blog.author] = 1;
    } else {
      counts[blog.author] = counts[blog.author] + 1;
    }
    if (counts[blog.author] > topCount) {
      mostAuthor = blog.author;
      topCount = counts[blog.author];
    }
  }
  return { author: mostAuthor, blogs: topCount };
};
const mostLikes = (blogs) => {
  const likes = {};
  let mostLikedAuthor = null;
  let topLikes = 0;

  for (const blog of blogs) {
    if (likes[blog.author] === undefined) {
      likes[blog.author] = blog.likes;
    } else {
      likes[blog.author] = likes[blog.author] + blog.likes;
    }

    if (likes[blog.author] > topLikes) {
      mostLikedAuthor = blog.author;
      topLikes = likes[blog.author];
    }
  }

  return { author: mostLikedAuthor, likes: topLikes };
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }