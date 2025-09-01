export interface User {
    name: string;
    avatar: string;
    isVerified: boolean;
}

export interface Comment {
    user: string;
    text: string;
}

export interface Post {
    id: number;
    user: User;
    type: 'image' | 'short_video' | 'long_video' | 'article';
    image?: string;
    video?: string;
    thumbnail?: string;
    duration?: string;
    caption: string;
    likes: number;
    comments: Comment[];
    // Article specific fields
    articleTitle?: string;
    articleContent?: string;
    articleLink?: string;
    articleImage?: string;
}
