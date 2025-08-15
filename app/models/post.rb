class Post < ApplicationRecord
  belongs_to :user

  # いいねとの関連
  has_many :likes, dependent: :destroy
  has_many :liked_users, through: :likes, source: :user

  validates :content, presence: true, length: { maximum: 280 }

  scope :recent, -> { order(created_at: :desc) }

  def truncated_content
    content.length > 100 ? "#{content[0..100]}..." : content
  end

  def liked_by?(user)
    likes.exists?(user: user)
  end

  def like_count
    likes.count
  end
end
