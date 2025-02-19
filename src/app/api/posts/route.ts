import { NextResponse } from 'next/server';

interface Post {
  id: string;
  userId: string;
  username: string;
  content: string;
  imageUrl: string;
  likes: string[];
  comments: {
    id: string;
    userId: string;
    username: string;
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
}

// In-memory storage for posts
let posts: Post[] = [];

// GET /api/posts
export async function GET() {
  return NextResponse.json(posts);
}

// POST /api/posts
export async function POST(request: Request) {
  const body = await request.json();
  const newPost: Post = {
    id: Date.now().toString(),
    userId: body.userId,
    username: body.username,
    content: body.content,
    imageUrl: body.imageUrl,
    likes: [],
    comments: [],
    createdAt: new Date().toISOString()
  };
  
  posts.unshift(newPost);
  return NextResponse.json(newPost);
}

// PUT /api/posts/:id/like
export async function PUT(request: Request) {
  const body = await request.json();
  const { postId, userId } = body;
  
  const post = posts.find(p => p.id === postId);
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  
  const hasLiked = post.likes.includes(userId);
  if (hasLiked) {
    post.likes = post.likes.filter(id => id !== userId);
  } else {
    post.likes.push(userId);
  }
  
  return NextResponse.json(post);
}

// POST /api/posts/:id/comment
export async function PATCH(request: Request) {
  const body = await request.json();
  const { postId, userId, username, content } = body;
  
  const post = posts.find(p => p.id === postId);
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  
  const newComment = {
    id: Date.now().toString(),
    userId,
    username,
    content,
    createdAt: new Date().toISOString()
  };
  
  post.comments.push(newComment);
  return NextResponse.json(post);
}