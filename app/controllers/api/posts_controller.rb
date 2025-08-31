class Api::PostsController < ApplicationController
  before_action :authenticate_user!, only: [:create, :destroy]

  def index
    posts = Post.includes(:user).recent.limit(20)
    render json: posts.as_json(include: { user: { only: [:id, :name] } })
  end

  def create
    post = current_user.posts.build(post_params)
    if post.save
      render json: post.as_json(include: { user: { only: [:id, :name] } }), status: :created
    else
      render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    post = current_user.posts.find(params[:id])
    post.destroy
    head :no_content
  end

  private

  def post_params
    params.require(:post).permit(:content)
  end
end 