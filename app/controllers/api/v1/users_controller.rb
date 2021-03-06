# frozen_string_literal: true

# API for application users
class Api::V1::UsersController < Api::V1::ApiController
  # GET /users
  def index
    authorize User
    @users = User.all

    render json: @users
  end

  # GET /profile
  def show
    render json: current_user
  end
end
