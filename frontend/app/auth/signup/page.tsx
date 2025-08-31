'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    birth_month: '',
    birth_day: '',
    birth_year: ''
  })
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Rails APIにユーザー登録リクエストを送信
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        user: formData
      })
      
      if (response.status === 201) {
        // 登録成功後、自動ログイン
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.ok) {
          router.push('/')
        }
      }
    } catch (error) {
      console.error('Registration failed:', error)
      // エラーハンドリングを追加
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
            Google でサインアップ
          </button>
          <button className="x-auth-btn-apple" type="button">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" style={{height:'1.5em',marginRight:'0.5em'}} />
            Appleのアカウントでサインアップ
          </button>
          <div className="x-auth-or">または</div>
          <button 
            className="x-auth-btn-main" 
            type="button" 
            onClick={() => setShowModal(true)}
          >
            アカウントを作成
          </button>
          <div className="x-auth-login-link">
            アカウントをお持ちの場合<br />
            <a href="/auth/signin">ログイン</a>
          </div>
        </div>
      </div>

      {/* サインアップモーダル */}
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
            <div className="x-modal-title">アカウントを作成</div>
            
            <form onSubmit={handleSubmit} id="x-signup-form">
              <button type="button" className="x-auth-btn-google" style={{marginBottom: '12px'}}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{height:'1.5em',marginRight:'0.5em'}} />
                Google でサインアップ
              </button>
              <button type="button" className="x-auth-btn-apple" style={{marginBottom: '12px'}}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" style={{height:'1.5em',marginRight:'0.5em'}} />
                Appleのアカウントでサインアップ
              </button>
              <div className="x-auth-or" style={{margin: '16px 0 12px 0'}}>または</div>
              
              <div className="x-modal-form-group">
                <input
                  type="text"
                  name="name"
                  className="x-modal-input"
                  placeholder="名前"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="x-modal-form-group">
                <input
                  type="email"
                  name="email"
                  className="x-modal-input"
                  placeholder="メールアドレス"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="x-modal-form-group">
                <input
                  type="password"
                  name="password"
                  className="x-modal-input"
                  placeholder="パスワード"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="x-modal-form-group">
                <input
                  type="password"
                  name="password_confirmation"
                  className="x-modal-input"
                  placeholder="パスワード（確認）"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="x-modal-form-group">
                <input
                  type="tel"
                  name="phone"
                  className="x-modal-input"
                  placeholder="電話番号"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="x-modal-form-group">
                <div style={{display: 'flex', gap: '8px'}}>
                  <select
                    name="birth_month"
                    className="x-modal-input"
                    value={formData.birth_month}
                    onChange={handleChange}
                    style={{flex: 1}}
                  >
                    <option value="">月</option>
                    {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select
                    name="birth_day"
                    className="x-modal-input"
                    value={formData.birth_day}
                    onChange={handleChange}
                    style={{flex: 1}}
                  >
                    <option value="">日</option>
                    {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <select
                    name="birth_year"
                    className="x-modal-input"
                    value={formData.birth_year}
                    onChange={handleChange}
                    style={{flex: 1}}
                  >
                    <option value="">年</option>
                    {Array.from({length: 100}, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="x-modal-next-btn x-modal-next-btn-black">
                  アカウントを作成
                </button>
              </div>
            </form>
            
            <div className="x-auth-login-link" style={{marginTop: '24px', textAlign: 'center'}}>
              アカウントをお持ちの場合は<br />
              <a href="/auth/signin">ログイン</a>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 