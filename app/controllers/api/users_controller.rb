class Api::UsersController < ApplicationController
  def current
    if user_signed_in?
      render json: {
        id: current_user.id,
        email: current_user.email,
        name: current_user.name
      }
    else
      render json: { error: 'Not authenticated' }, status: :unauthorized
    end
  end

  def create
    user = User.new(user_params)
    
    if user.save
      render json: {
        id: user.id,
        email: user.email,
        name: user.name
      }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :phone, :birth_month, :birth_day, :birth_year)
  end
end 