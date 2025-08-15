class LikesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_post

  def create
    @like = current_user.likes.build(post: @post)

    if @like.save
      respond_to do |format|
        format.html { redirect_back(fallback_location: root_path) }
        format.json { render json: { success: true, like_count: @post.like_count } }
      end
    else
      respond_to do |format|
        format.html { redirect_back(fallback_location: root_path, alert: @like.errors.full_messages.join(", ")) }
        format.json { render json: { success: false, errors: @like.errors.full_messages } }
      end
    end
  end

  def destroy
    @like = current_user.likes.find_by(post: @post)

    if @like&.destroy
      respond_to do |format|
        format.html { redirect_back(fallback_location: root_path) }
        format.json { render json: { success: true, like_count: @post.like_count } }
      end
    else
      respond_to do |format|
        format.html { redirect_back(fallback_location: root_path) }
        format.json { render json: { success: false } }
      end
    end
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  end
end
