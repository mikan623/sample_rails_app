'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.ok) {
        router.push('/')
      } else {
        setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。')
      }
    } catch (error) {
      setError('ログイン中にエラーが発生しました。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* メイン画面 */}
      <div className="x-auth-container">
        <div className="x-auth-left">
          <Image src="/x_logo.png" alt="X logo" width={320} height={320} className="x-auth-logo" />
        </div>
        <div className="x-auth-right">
          <div className="x-auth-title">すべての話題が、ここに。by shinoka</div>
          <div className="x-auth-subtitle">今すぐ参加しましょう。</div>
          <button className="x-auth-btn-google" type="button">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{height:'1.5em',marginRight:'0.5em'}} />
            Google でログイン
          </button>
          <button className="x-auth-btn-apple" type="button">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" style={{height:'1.5em',marginRight:'0.5em'}} />
            Appleのアカウントでログイン
          </button>
          <div className="x-auth-or">または</div>
          <button 
            className="x-auth-btn-main" 
            type="button" 
            onClick={() => setShowModal(true)}
          >
            ログイン
          </button>
          <div className="x-auth-login-link">
            アカウントをお持ちでない場合<br />
            <a href="/auth/signup">アカウントを作成</a>
          </div>
        </div>
      </div>

      {/* ログインモーダル */}
      {showModal && (
        <div className="x-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="x-modal-box" onClick={(e) => e.stopPropagation()}>
            <button 
              className="x-modal-close" 
              onClick={() => setShowModal(false)}
              aria-label="閉じる"
            >
              ×
            </button>
            <Image src="/x_logo.png" alt="X logo" width={40} height={40} className="x-modal-logo" />
            <div className="x-modal-title">Xにログイン</div>
            
            <form onSubmit={handleSubmit} id="x-login-form">
              <button type="button" className="x-auth-btn-google" style={{marginBottom: '12px'}}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{height:'1.5em',marginRight:'0.5em'}} />
                Google でログイン
              </button>
              <button type="button" className="x-auth-btn-apple" style={{marginBottom: '12px'}}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" style={{height:'1.5em',marginRight:'0.5em'}} />
                Appleのアカウントでログイン
              </button>
              <div className="x-auth-or" style={{margin: '16px 0 12px 0'}}>または</div>
              
              <div className="x-modal-form-group">
                <input
                  type="email"
                  className="x-modal-input"
                  placeholder="メールアドレス"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="x-modal-form-group">
                <input
                  type="password"
                  className="x-modal-input"
                  placeholder="パスワード"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {error && (
                <div className="x-error-message" style={{ color: 'red', fontSize: '14px', marginBottom: '12px' }}>
                  {error}
                </div>
              )}
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="x-modal-next-btn x-modal-next-btn-black"
                  disabled={isLoading}
                >
                  {isLoading ? 'ログイン中...' : '次へ'}
                </button>
              </div>
            </form>
            
            <button type="button" className="x-auth-btn-google" style={{marginTop: '12px', background: '#fff', color: '#222', border: '1px solid #ccc'}}>
              パスワードを忘れた場合はこちら
            </button>
            <div className="x-auth-login-link" style={{marginTop: '24px', textAlign: 'center'}}>
              アカウントをお持ちでない場合は<br />
              <a href="/auth/signup">登録</a>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 