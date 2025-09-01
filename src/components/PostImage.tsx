interface PostImageProps {
    image: string;
    alt: string;
}

const PostImage = ({ image, alt }: PostImageProps) => {
    return (
        <img
            src={image}
            alt={alt}
            className="w-full  object-cover"
        />
    );
};

export default PostImage;
