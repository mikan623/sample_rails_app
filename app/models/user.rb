class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # カスタムバリデーション
  validates :name, presence: true, length: { maximum: 50 }
  validates :email, presence: true
  validates :phone, presence: true, unless: :email_present?

  # 投稿との関連
  has_many :posts, dependent: :destroy
  
  # いいねとの関連
  has_many :likes, dependent: :destroy
  has_many :liked_posts, through: :likes, source: :post



  private

  def email_present?
    email.present?
  end

  def phone_present?
    phone.present?
  end
end
