class HomeController < ApplicationController
  before_action :authenticate_user!, only: [:create_post]

  def index
    @posts = Post.includes(:user).recent.limit(20)
  end

  def create_post
    @post = current_user.posts.build(post_params)

    if @post.save
      redirect_to root_path, notice: "投稿が作成されました"
    else
      redirect_to root_path, alert: "投稿の作成に失敗しました"
    end
  end

  private

  def post_params
    params.require(:post).permit(:content)
  end
end
