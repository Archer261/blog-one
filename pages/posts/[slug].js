import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../../styles/Slug.module.css'
import { GraphQLClient, gql } from 'graphql-request'
import { IoIosArrowDropleftCircle } from "react-icons/io";

const graphcms = new GraphQLClient(
    'https://api-us-east-1.hygraph.com/v2/clbsouahc1o3r01t7cxfgd0fz/master'
);

const QUERY = gql`
query Post($slug: String!) {
post(where:{slug: $slug}){
    id
    title
    slug
    datePublished
    author {
        id
        name
        avatar {
            url
        }
    }
    content {
        html
    }
    coverImage {
        id
        url
    }
}
}
`;

const SLUGLIST = gql`
    {
    posts {
    slug
    }
    }
`;

export async function getStaticPaths() {
    const { posts } = await graphcms.request(SLUGLIST);
    return {
        paths: posts.map((post) => ({ params: { slug: post.slug } })),
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const slug = params.slug;
    const data = await graphcms.request(QUERY, { slug });
    const post = data.post
    return {
        props: {
            post,
        },
        revalidate: 10,
    };
}

export default function BlogPost({ post }) {
    return (
        <>
            <div className={styles.app__return}>
                <a href='/'><IoIosArrowDropleftCircle /></a>
            </div>
            <main className={styles.blog}>

                <img src={post.coverImage.url} className={styles.cover} alt />
                <div className={styles.title}>
                    <img src={post.author.avatar.url} />
                    <div className={styles.authtext}>
                        <h6>By {post.author.name}</h6>
                        <h6 className={styles.date}>{post.datePublished}</h6>
                    </div>
                </div>
                <h2>{post.title}</h2>
                <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content.html }}>

                </div>
            </main>
        </>
    )
}