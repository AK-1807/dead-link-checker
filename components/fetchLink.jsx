
import React from 'react';

export async function getStaticProps() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!res.ok) {
      throw new Error(`Failed to fetch data, status: ${res.status}`);
    }
    const posts = await res.json();

    return {
      props: {
        posts,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        posts: [],
      },
    };
  }
}

export default function Home({ posts }) {
  console.log(posts)
  return (
    <div>
      <h1>Posts</h1>
      {/* <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul> */}
    </div>
  );
}