'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import axios from 'axios'

interface Post {
  id: string
  content: string
  user: {
    id: string
    name: string
  }
  created_at: string
  like_count: number
}

export default function Home() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    if (session) {
      fetchPosts()
    }
  }, [session])

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts`)
      setPosts(response.data)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPost.trim() && charCount <= 280) {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
          post: { content: newPost }
        })
        setNewPost('')
        setCharCount(0)
        fetchPosts()
      } catch (error) {
        console.error('Failed to create post:', error)
      }
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return '今'
    if (diffInMinutes < 60) return `${diffInMinutes}分前`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}時間前`
    return `${Math.floor(diffInMinutes / 1440)}日前`
  }

  if (!session) {
    return (
      <div className="x-auth-container">
        <div className="x-auth-left">
          <Image src="/x_logo.png" alt="X" width={320} height={320} />
        </div>
        <div className="x-auth-right">
          <div className="x-auth-title">すべての話題が、ここに。by shinoka</div>
          <div className="x-auth-subtitle">今すぐ参加しましょう。</div>
          <a href="/auth/signin" className="x-auth-btn-main">
            ログイン
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="x-main-container">
      {/* 左サイドバー */}
      <div className="x-sidebar-left">
        <div className="x-logo">
          <Image src="/x_logo.png" alt="X" width={40} height={40} />
        </div>
        
        <nav className="x-nav">
          <a href="/" className="x-nav-item active">
            <svg viewBox="0 0 24 24" className="x-nav-icon">
              <path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"/>
            </svg>
            ホーム
          </a>
          <a href="#" className="x-nav-item">
            <svg viewBox="0 0 24 24" className="x-nav-icon">
              <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"/>
            </svg>
            話題を検索
          </a>
          <a href="#" className="x-nav-item">
            <svg viewBox="0 0 24 24" className="x-nav-icon">
              <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2C8.027 2 4.692 4.836 4.11 8.718L4.006 9.042H1.996C1.444 9.042 1 9.486 1 10.038V20.004C1 20.556 1.444 21 1.996 21H21.994C22.546 21 22.99 20.556 22.99 20.004V10.038C22.99 9.486 22.546 9.042 21.994 9.042H19.993ZM12 4.042C14.962 4.042 17.5 6.58 17.5 9.042H6.5C6.5 6.58 9.038 4.042 12 4.042ZM12 19.042C10.5 19.042 9.5 18.042 9.5 16.542C9.5 15.042 10.5 14.042 12 14.042C13.5 14.042 14.5 15.042 14.5 16.542C14.5 18.042 13.5 19.042 12 19.042Z"/>
            </svg>
            通知
            <span className="x-notification-badge">19</span>
          </a>
          <a href="#" className="x-nav-item">
            <svg viewBox="0 0 24 24" className="x-nav-icon">
              <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.22-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"/>
            </svg>
            メッセージ
          </a>
          <a href="#" className="x-nav-item">
            <svg viewBox="0 0 24 24" className="x-nav-icon">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Grok
          </a>
          <a href="#" className="x-nav-item">
            <svg viewBox="0 0 24 24" className="x-nav-icon">
              <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"/>
            </svg>
            ブックマーク
          </a>
          <a href="#" className="x-nav-item">
            <svg viewBox="0 0 24 24" className="x-nav-icon">
              <path d="M7.471 21H.472l.029-.014c4.688-2.296 6.332-5.108 6.47-6.756C7.595 12.75 4.8 12 2.542 12H2.5v-1.012c2.43-.023 4.674-1.114 5.963-2.912.129-.18.18-.08.18.356V21zM9.616 9.27C10.452 7.363 12.415 6 14.5 6V2l1.248.698L19.5 4v2c2.88 0 5.001 2.014 5.001 4.196 0 2.865-1.102 5.196-2.982 6.484-1.086.745-2.776 1.186-4.017 1.34h-.883c-1.5 0-3.196-.998-3.196-2.404 0-.554.227-1.123.4-1.525.173-.402.4-.78.4-1.18 0-.4-.227-.778-.4-1.18-.173-.402-.4-.971-.4-1.525z"/>
            </svg>
            コミュニティ
          </a>
          <a href="#" className="x-nav-item">
            <svg viewBox="0 0 24 24" className="x-nav-icon">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            プレミアム
          </a>
          <a href="#" className="x-nav-item">
            <svg viewBox="0 0 24 24" className="x-nav-icon">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            認証済み組織
          </a>
          <a href="#" className="x-nav-item">
            <svg viewBox="0 0 24 24" className="x-nav-icon">
              <path d="M5.651 19h12.698c-.337-1.021-1.22-1.779-2.317-1.779H7.968c-1.097 0-1.98.758-2.317 1.779zm7.968-3.779c1.097 0 1.98-.758 2.317-1.779H7.968c-1.097 0-1.98.758-2.317 1.779h7.968z"/>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            プロフィール
          </a>
          <a href="#" className="x-nav-item">
            <svg viewBox="0 0 24 24" className="x-nav-icon">
              <path d="M3.75 12c0-4.56 3.69-8.25 8.25-8.25s8.25 3.69 8.25 8.25-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12zM12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zm-4.5 11.5c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25S6.25 11.31 6.25 12s.56 1.25 1.25 1.25zm9 0c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25z"/>
            </svg>
            もっと見る
          </a>
        </nav>
        
        <button className="x-post-btn">ポストする</button>
        
        <div className="x-user-profile">
          <div className="x-user-avatar">
            <Image src="/user_icon2.svg" alt="Avatar" width={40} height={40} />
          </div>
          <div className="x-user-info">
            <div className="x-user-name">紫乃花</div>
            <div className="x-user-handle">@kanoshi_123</div>
          </div>
          <div className="x-user-menu">
            <svg viewBox="0 0 24 24" className="x-nav-icon">
              <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="x-main-content">
        <div className="x-header">
          <h2>ホーム</h2>
        </div>
        
        <div className="x-tabs">
          <button className="x-tab active">おすすめ</button>
          <button className="x-tab">フォロー中</button>
        </div>
        
        <div className="x-post-composer">
          <div className="x-post-avatar">
            <Image src="/user_icon2.svg" alt="Avatar" width={40} height={40} />
          </div>
          <div className="x-post-input-container">
            <form onSubmit={handleSubmit} className="x-post-form">
              <textarea
                className="x-post-input"
                placeholder="いまどうしてる?"
                maxLength={280}
                rows={3}
                value={newPost}
                onChange={(e) => {
                  setNewPost(e.target.value)
                  setCharCount(e.target.value.length)
                }}
              />
              <div className="x-post-actions">
                <div className="x-post-attachments">
                  <button type="button" className="x-attachment-btn">
                    <svg viewBox="0 0 24 24" className="x-attachment-icon">
                      <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.22-.5.5v9l4-4c.553-.553 1.447-.553 2 0L15 15l-2 2-4-4-4 4V5.5c0-.28-.224-.5-.5-.5z"/>
                    </svg>
                  </button>
                  <button type="button" className="x-attachment-btn">
                    <svg viewBox="0 0 24 24" className="x-attachment-icon">
                      <path d="M8.5 13.5l2.5 3.5L14.5 12l4.5 6.5m-16-4l4.5-4.5 2.5 2.5L12 8l4.5 4.5-13 13z"/>
                    </svg>
                  </button>
                  <button type="button" className="x-attachment-btn">
                    <svg viewBox="0 0 24 24" className="x-attachment-icon">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </button>
                  <button type="button" className="x-attachment-btn">
                    <svg viewBox="0 0 24 24" className="x-attachment-icon">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </button>
                  <button type="button" className="x-attachment-btn">
                    <svg viewBox="0 0 24 24" className="x-attachment-icon">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </button>
                </div>
                <div className="x-post-submit-section">
                  <div className="x-char-count-home">
                    <span>{charCount}</span>/280
                  </div>
                  <button 
                    type="submit" 
                    className="x-post-submit-btn"
                    disabled={charCount === 0 || charCount > 280}
                  >
                    ポストする
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        <div className="x-posts">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="x-post">
                <div className="x-post-avatar">
                  <Image src="/user_icon2.svg" alt="Avatar" width={40} height={40} />
                </div>
                <div className="x-post-content">
                  <div className="x-post-header">
                    <span className="x-post-author">{post.user.name}</span>
                    <span className="x-post-time">{formatTimeAgo(post.created_at)}</span>
                  </div>
                  <div className="x-post-text">
                    {post.content}
                  </div>
                  <div className="x-post-actions">
                    <button className="x-post-action">
                      <svg viewBox="0 0 24 24" className="x-post-action-icon">
                        <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-2.26 1.23c-.51.28-1.1.28-1.61 0l-2.26-1.23C3.507 15.68 1.751 12.96 1.751 10zM8.756 2.5c-3.584 0-6.494 2.91-6.494 6.5 0 2.5 1.494 4.85 3.777 5.86l2.26 1.23c.51.28 1.1.28 1.61 0l2.26-1.23c2.283-1.01 3.777-3.36 3.777-5.5 0-3.59-2.91-6.5-6.494-6.5z"/>
                      </svg>
                      <span className="like-count">{post.like_count}</span>
                    </button>
                    <button className="x-post-action">
                      <svg viewBox="0 0 24 24" className="x-post-action-icon">
                        <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-2.26 1.23c-.51.28-1.1.28-1.61 0l-2.26-1.23C3.507 15.68 1.751 12.96 1.751 10zM8.756 2.5c-3.584 0-6.494 2.91-6.494 6.5 0 2.5 1.494 4.85 3.777 5.86l2.26 1.23c.51.28 1.1.28 1.61 0l2.26-1.23c2.283-1.01 3.777-3.36 3.777-5.5 0-3.59-2.91-6.5-6.494-6.5z"/>
                      </svg>
                      <span>0</span>
                    </button>
                    <button className="x-post-action">
                      <svg viewBox="0 0 24 24" className="x-post-action-icon">
                        <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-2.26 1.23c-.51.28-1.1.28-1.61 0l-2.26-1.23C3.507 15.68 1.751 12.96 1.751 10zM8.756 2.5c-3.584 0-6.494 2.91-6.494 6.5 0 2.5 1.494 4.85 3.777 5.86l2.26 1.23c.51.28 1.1.28 1.61 0l2.26-1.23c2.283-1.01 3.777-3.36 3.777-5.5 0-3.59-2.91-6.5-6.494-6.5z"/>
                      </svg>
                      <span>0</span>
                    </button>
                    <button className="x-post-action">
                      <svg viewBox="0 0 24 24" className="x-post-action-icon">
                        <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-2.26 1.23c-.51.28-1.1.28-1.61 0l-2.26-1.23C3.507 15.68 1.751 12.96 1.751 10zM8.756 2.5c-3.584 0-6.494 2.91-6.494 6.5 0 2.5 1.494 4.85 3.777 5.86l2.26 1.23c.51.28 1.1.28 1.61 0l2.26-1.23c2.283-1.01 3.777-3.36 3.777-5.5 0-3.59-2.91-6.5-6.494-6.5z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="x-empty-posts">
              <p>まだ投稿がありません</p>
              <p>最初の投稿を作成してみましょう！</p>
            </div>
          )}
        </div>
      </div>

      {/* 右サイドバー */}
      <div className="x-sidebar-right">
        <div className="x-search-container">
          <div className="x-search-box">
            <svg viewBox="0 0 24 24" className="x-search-icon">
              <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"/>
            </svg>
            <input type="text" placeholder="検索" className="x-search-input" />
          </div>
        </div>
        
        <div className="x-premium-section">
          <h3>プレミアムにサブスクライブ</h3>
          <p>サブスクライブして新機能を利用しましょう。資格を満たしている場合、収益配分を受け取れます。</p>
          <button className="x-premium-btn">サブスクライブする</button>
        </div>
        
        <div className="x-trends-section">
          <h3>「いま」を見つけよう</h3>
          
          <div className="x-trend-item">
            <div className="x-trend-category">プロモーション</div>
            <div className="x-trend-tag">Galaxy AI</div>
            <div className="x-trend-posts">予約購入キャンペーン実施中</div>
            <div className="x-trend-posts" style={{fontSize: '11px', color: '#71767b'}}>Promoted by Samsung Japan</div>
          </div>
          
          <div className="x-trend-item">
            <div className="x-trend-category">エンターテインメント・トレンド</div>
            <div className="x-trend-tag">#アイマス20周年おめでとう</div>
            <div className="x-trend-posts">33,855件のポスト</div>
          </div>
          
          <div className="x-trend-item">
            <div className="x-trend-category">人気の画像・トレンド</div>
            <div className="x-trend-tag">#山田一郎誕生祭2025</div>
            <div className="x-trend-posts">6,257件のポスト</div>
          </div>
          
          <div className="x-trend-item">
            <div className="x-trend-category">日本のトレンド</div>
            <div className="x-trend-tag">コレコレ</div>
            <div className="x-trend-posts">14,490件のポスト</div>
          </div>
          
          <a href="#" className="x-show-more">さらに表示</a>
        </div>
      </div>
    </div>
  )
} 