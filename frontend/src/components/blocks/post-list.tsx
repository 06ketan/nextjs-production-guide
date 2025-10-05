import type { PostListProps, PostCardContent } from "@/lib/engine/types";
import type { Locale } from "@/lib/i18n/config";
import { getPosts } from "@/lib/strapi/client";
import PostCard from "./post-card";

export default async function PostList({ content }: PostListProps) {
  const { title, subtitle, locale = "en" } = content || {};

  // Use provided posts or auto-fetch all posts
  let posts: PostCardContent[] = content?.posts || [];

  if (!posts?.length) {
    const fetchedPosts = await getPosts(locale as Locale);
    posts =
      fetchedPosts?.map((p) => ({
        id: p?.id,
        title: p?.title,
        slug: p?.slug,
        pathName: p?.pathName,
        excerpt: p?.excerpt,
        cover: p?.cover?.data?.attributes,
        publishedDate: p?.publishedDate,
        readTime: p?.readTime,
      })) || [];
  }

  if (!posts?.length) {
    return (
      <section className="section-spacing">
        <div className="container-wide text-center">
          <div className="bg-card border border-border rounded-xl p-12">
            <span className="text-4xl mb-4 block">📭</span>
            <p className="text-muted-foreground">No posts found.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="posts" className="section-spacing">
      <div className="container-wide">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post, index) => (
            <PostCard key={post?.slug || post?.id || index} content={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
