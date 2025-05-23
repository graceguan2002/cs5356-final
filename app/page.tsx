'use client'

import Image from 'next/image'
import PostCard from '@/components/PostCard'
// import { db } from '@/database/db'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"

// static data for patterns
// const patterns = [
//   { title: 'Cozy Winter Beanie', description: 'A warm beanie for chilly days.', author: 'Jane Doe', date: 'Apr 15, 2025', tags: ['pattern', 'clothes'], image: '/images/beanie.jpg' },
//   { title: 'Crochet Teddy Bear', description: 'Perfect for gifting little ones.', author: 'Tom Yarn', date: 'Apr 10, 2025', tags: ['pattern', 'toy'], image: '/images/teddy.jpg' },
// ]

// static data for shops
// const shops = [
//   { title: 'Yarny Delights', description: 'Find colorful, soft yarns.', author: 'Yarn Boutique', date: 'Apr 5, 2025', tags: ['shop', 'decoration'], image: '/images/shop1.webp' },
//   { title: 'The Crochet Cave', description: 'Are you obsessive-compulsive? Then this is your paradise. We have everything you can think of.', author: 'YY', date: 'Apr 3, 2025', tags: ['shop'], image: '/images/shop2.webp' },
// ]


type Post = {
  id: string
  createdAt: Date
  updatedAt: Date
  image: string | null
  userId: string
  description: string | null
  title: string
  category: string | null
  tag: string[] | null
  views: number
  user: {
    name: string | null
    email: string | null
  }
}


export default function LandingPage() {
  const { data: session } = useSession()
  const [patternPosts, setPatterns] = useState<Post[]>([])
  const [shopPosts, setShops] = useState<Post[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/home')
        const postsData = await res.json()
        setShops(postsData.shops)
        setPatterns(postsData.patterns)
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    fetchPosts()
  }, [])


  const router = useRouter()
  const handlePostClick = async (postId: string) => {
    if (!session) {
      router.push('/auth/sign-in')
    } else {
      try {
        console.log(postId)
        await fetch('/api/posts/views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId }),
        })
        router.push('/posts')
      } catch (error) {
        console.error('Error updating views:', error)
      }
    }

  }
  return (
    <div>
      {/* Cover Section */}
      <div className="relative h-[90vh] w-full">
        <Image src="/images/cover.jpg" alt="Crochet Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-black opacity-60" />
        <div className="absolute inset-0 flex items-center justify-start">
          <h1 className="text-white text-6xl font-title font-bold text-left px-10 animate-fadeIn leading-tight">
            STITCH STORIES TOGETHER<br />
            <span className="text-4xl">Share & Discover Crochet Wonders</span>
          </h1>
        </div>
      </div>

      {/* Patterns Section */}
      <section className="px-0 py-10">
        <h2 className="text-3xl font-title font-bold mb-4 px-6">PATTERNS</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 px-6">
          {patternPosts.map((post, idx) => (
            <button key={idx}
              onClick={() => handlePostClick(post.id)}
              className="hover:opacity-80 transition-opacity"
            >
              <PostCard
                key={idx}
                id={post.id}
                title={post.title}
                description={post.description || ''
                }
                author={post.user.name || ''}
                date={post.createdAt}
                tags={post.tag || []}
                image={post.image || ''}
              />
            </button>


          ))}
        </div>
      </section>

      {/* Shops Section */}
      <section className="px-0 py-10">
        <h2 className="text-3xl font-title font-bold mb-4 px-6">SHOPS</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 px-6">
          {shopPosts.map((post, idx) => (
            <button key={idx}
              onClick={() => handlePostClick(post.id)}
              className="hover:opacity-80 transition-opacity"
            >
              <PostCard
                key={idx}
                id={post.id}
                title={post.title}
                description={post.description || ''
                }
                author={post.user.name || ''}
                date={post.createdAt}
                tags={post.tag || []}
                image={post.image || ''}
              />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
