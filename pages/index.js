import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { GraphQLClient, gql } from 'graphql-request'
import BlogCard from '../components/BlogCard'
import Navbar from '../components/Navbar'

const graphcms = new GraphQLClient(
  process.env.GRAPH_QL_CLIENT
);

const QUERY = gql`
{
  posts {
    author {
      avatar {
        url
      }
      name
    }
    title
    coverImage {
      url
      publishedAt
      createdBy {
        id
      }
    }
    datePublished
    id
    content {
      html
    }
    slug
  }
}
`;

const inter = Inter({ subsets: ['latin'] })

export async function getStaticProps() {
  const { posts } = await graphcms.request(QUERY);
  return {
    props: {
      posts,
    },
    revalidate: 10,
  };
}

export default function Home({ posts }) {

  return (
    <>

      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className={styles.grid}>
        {posts.map((post) => (
          <BlogCard title={post.title} author={post.author} coverImage={post.coverImage} key={post.id} datePublished={post.datePublished} slug={post.slug} />
        ))}
      </main>
    </>
  )
}
