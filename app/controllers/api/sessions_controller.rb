class Api::SessionsController < ApplicationController
  def create
    user = User.find_by(email: params[:email])
    
    if user&.valid_password?(params[:password])
      render json: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end
end 